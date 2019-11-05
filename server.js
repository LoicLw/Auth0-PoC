const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const path = require('path')
const {
   join
} = require("path");
const authConfig = require("./src/auth_config.json");
const request = require("request");

const requestPromise = require("request-promise");

const app = express();

const port = process.env.SERVER_PORT || 3001;

if (!authConfig.domain || !authConfig.audience) {
   throw new Error(
      "Please make sure that auth_config.json is in place and populated"
   );
}

require('dotenv').config({ path: ".env.development"})
const manualToken = process.env.CACHETOKEN;
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

app.use(morgan("dev"));
app.use(helmet());
app.use(express.static(join(__dirname, "build")));

app.use(asyncHandler(async (req, res, next) => {
   next()
}))


// Authentication middleware. When used, the Access Token must exist and be verified against the Auth0 JSON Web Key Set
const checkJwt = jwt({
   // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
   secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
   }),

   // Validate the audience and the issuer.
   audience: authConfig.audience,
   issuer: `https://${authConfig.domain}/`,
   algorithm: ["RS256"]
});


//
// This is our order API logic. The API checks for user authentication with checkJwt.
// 
// Check if user is email verified before actually ordering
// We add an asyncHandler function to use await in the main thread

app.get("/api/order", checkJwt, asyncHandler(async (req, res, next) => {

   //Get user information passed with the request
   console.log("[Dev Logs] - /api/order - req.user Object: ", req.user)
   console.log("[Dev Logs] - User Access Token logic")
   let additionnalText = ""


   //Is this a Google OAuth2 logged user?
   if (req.user.sub.startsWith('google-oauth2')){
      console.log("[Dev Logs] - Detected Google OAuth2 logged User")

      //Production process will be to Get a token by Asking Auth0 for an access token from this application
      //For this small pizza demo we hardcode the Management API Bearer access token
      var options = {
         method: 'POST',
         url: 'https://seappl.eu.auth0.com/oauth/token',
         headers: {
            'content-type': 'application/json'
         },
         body: '{"client_id":"6h4xiZ7GkVE1dcgODsDbkRCcv06DW7EB","client_secret":"-vEHGrP_zc2_WJaC3WFFe0hZq1sA1_BzKVXvIO1eiVXo79QrrOzyQK0YpaEVkc10","audience":"https://seappl.eu.auth0.com/api/v2/","grant_type":"client_credentials"}'
      };

      request(options, function(error, response, body) {
         if (error) throw new Error(error);
         body = JSON.parse(body)
         console.log("[Dev Logs] - Auth0 - Management API Access Token:", body.access_token)
         //Now let's call the User API
      });
      
      // With this flow we will use our Auth0 Management API access token to get the user Google OAuth Access Token - stored in Auth0
      //We will a contactTotal var to store the number of contact for Google OAuth using Google Contacts API
      let contactTotal = 0

      try {
         var options = {
            method: 'GET',
            url: 'https://seappl.eu.auth0.com/api/v2/users/' + req.user.sub,
            //For production, we'd use a fresh access token from the Management API
            //headers: {authorization: 'Bearer '+body.access_token+''}
            headers: {
               authorization: 'Bearer ' + manualToken + ''
            }
         };


         var body = await requestPromise(options)
         body = JSON.parse(body)
         console.log("[Dev Logs] - Google User IDP Token (Access Token):", body.identities.find(i => i.access_token).access_token);

         var optionsGoogleContacts = {
            method: 'GET',
            url: 'https://www.google.com/m8/feeds/contacts/default/full?alt=json&oauth_token=' + body.identities.find(i => i.access_token).access_token.trim()
         }

         const result = await requestPromise(optionsGoogleContacts)
         console.log("[Dev Logs] -  Google Contacts API response:", result)

         bodyGoogleContacts = JSON.parse(result)
         contactTotal = parseInt(bodyGoogleContacts.feed.openSearch$totalResults.$t)
         console.log("[Dev Logs] - Google Contacts - Number of contacts", contactTotal)
         
      } catch (e) {
         console.error("[ERR - Dev Logs] - Error with Google API Access")
         additionnalText = " | Note: we could not access your contacts. Did you authorize our contact Access request? Or is your Google OAuth Access Tokens stored in Auth0 expired?"
         console.error(e)
      }
      

      //Text to be returned through the API showing number of contacts 
      if (contactTotal > 0) {
         additionnalText = " Feel free to share the word to all your Google "+ contactTotal + " contacts if you like our pizzas."
      }
   }


   //We still check for verified email status in our back-end
   console.log("[Dev Logs] - Is user email verified?", body.email_verified)

   if (body.email_verified) {
      res.send({
         msg: "Your email is verified ✅, pizzas on the way!" + additionnalText
         //
         //Code logic to complete pizza ordering
         //
      });
   } else {
      res.send({
         msg: "Please first validate your email ⛔️."
         //
         //Improvement Code logic to check email or re-send verification
         //
      });
   }
}));



app.use((_, res) => {
   res.sendFile(join(__dirname, "build", "index.html"));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));