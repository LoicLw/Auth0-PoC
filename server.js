const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { join } = require("path");
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

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

app.use(morgan("dev"));
app.use(helmet());
app.use(express.static(join(__dirname, "build")));

app.use(asyncHandler(async (req, res, next) => {
	next()
}))

async function getGoogleContacts(accessToken) {

   var optionsGoogleContacts={
	   method: 'GET',
	   url: 'https://www.google.com/m8/feeds/contacts/default/full?alt=json&oauth_token='+accessToken,
   }
	
   //console.log("DEBUG GOOGLE Contact response body:",bodyGoogleContacts)
   const result =  await requestPromise(optionsGoogleContacts)
   console.log(await result.text());

}

const manualToken="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik1UbEdOalUxTWtRMk4wWXlNRE0xUXpoRlJEZ3dNMEUxTjBVM09EUTJSRFUzTXpVeE9EWTVRZyJ9.eyJpc3MiOiJodHRwczovL3NlYXBwbC5ldS5hdXRoMC5jb20vIiwic3ViIjoidnBOMUtMN3ZNcG1kd3ZrRzBxWW5kTEkxcENXTjI0Sk1AY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vc2VhcHBsLmV1LmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNTcyNjU3ODA2LCJleHAiOjE1NzM1MjE4MDYsImF6cCI6InZwTjFLTDd2TXBtZHd2a0cwcVluZExJMXBDV04yNEpNIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDpydWxlc19jb25maWdzIHVwZGF0ZTpydWxlc19jb25maWdzIGRlbGV0ZTpydWxlc19jb25maWdzIHJlYWQ6ZW1haWxfcHJvdmlkZXIgdXBkYXRlOmVtYWlsX3Byb3ZpZGVyIGRlbGV0ZTplbWFpbF9wcm92aWRlciBjcmVhdGU6ZW1haWxfcHJvdmlkZXIgYmxhY2tsaXN0OnRva2VucyByZWFkOnN0YXRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6c2hpZWxkcyBjcmVhdGU6c2hpZWxkcyBkZWxldGU6c2hpZWxkcyByZWFkOmFub21hbHlfYmxvY2tzIGRlbGV0ZTphbm9tYWx5X2Jsb2NrcyB1cGRhdGU6dHJpZ2dlcnMgcmVhZDp0cmlnZ2VycyByZWFkOmdyYW50cyBkZWxldGU6Z3JhbnRzIHJlYWQ6Z3VhcmRpYW5fZmFjdG9ycyB1cGRhdGU6Z3VhcmRpYW5fZmFjdG9ycyByZWFkOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGRlbGV0ZTpndWFyZGlhbl9lbnJvbGxtZW50cyBjcmVhdGU6Z3VhcmRpYW5fZW5yb2xsbWVudF90aWNrZXRzIHJlYWQ6dXNlcl9pZHBfdG9rZW5zIGNyZWF0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIGRlbGV0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIHJlYWQ6Y3VzdG9tX2RvbWFpbnMgZGVsZXRlOmN1c3RvbV9kb21haW5zIGNyZWF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.eRerv6q5USbWOys2NVdn7zcfH7LESCxLAEJOEiacb9wvnebr34W09POPxO99kuMwSJ3EUShLIOq1EnY74mhzVWOg9uqPeOzYUdo5cw2-Adn3UQexwuQVYDccwtv4eCwy4crQFcOyXlTvM3FNONcr2r-IMwDFUimvv-ccGZo25BXD9DjjlQFBYvR1HKsklJqGZshZfUdXMZWg_SZoxr3jaEbscVgNlsizDWnZOnsCvJtmVBj-kuC8jHjrF89mkZGpvJ6J259yunu73c4uxKToYzBR4O9CK5G54JMD2P8aLESzDXDoBMx58NGiAkqjsZdj4u4Atnl7BRMnlY06TrlvQg"

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


// Check if user is email verified before actually ordering
app.get("/api/order",  checkJwt, asyncHandler(async (req, res, next) => {
//app.get("/api/order", checkJwt, (req, res) => {

  //Get request user information
  console.log("DEBUG - api/order - Req.user object: ",req.user)

  console.log("DEBUG - user Access token")

  //Production process will be to Get a token by Asking Auth0 for an access token from this application
  //For this small pizza demo we hardcode the Management API Bearer access token

  
  var options = { method: 'POST',
    url: 'https://seappl.eu.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: '{"client_id":"6h4xiZ7GkVE1dcgODsDbkRCcv06DW7EB","client_secret":"-vEHGrP_zc2_WJaC3WFFe0hZq1sA1_BzKVXvIO1eiVXo79QrrOzyQK0YpaEVkc10","audience":"https://seappl.eu.auth0.com/api/v2/","grant_type":"client_credentials"}' };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    body=JSON.parse(body)
    console.log("DEBUG POST obtain ACCESS TOKEN:", body.access_token)
    //console.log("DEBUG POST full response:", body);
    //Now let's call the user api and verify
  });
  



  var options = {
    method: 'GET',
    url: 'https://seappl.eu.auth0.com/api/v2/users/'+req.user.sub,
    //For production, we use the fresh access token
    //headers: {authorization: 'Bearer '+body.access_token+''}
    headers: {authorization: 'Bearer '+manualToken+''}
  };

  console.log("DEBUG - GET USERS options:",options)
  let contactTotal=0

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    body=JSON.parse(body)
	  console.log("DEBUG - AUTH Mgmt API User object",body)
    console.log("DEBUG - Google User IDP Token (Access Token):",body.identities.find(i => i.access_token).access_token);

  //require('request').debug = true

	 /* 
   var optionsGoogleContacts={
	   method: 'GET',
	   url: 'https://www.google.com/m8/feeds/contacts/default/full?alt=json&oauth_token='+body.identities.find(i => i.access_token).access_token.trim(),
   }
   */
	  /*
   var result =  await requestPromise(optionsGoogleContacts, function(error, response, bodyGoogleContacts){
	   if (error) throw new Error(error);
	   console.log("DEBUG GOOGLE Contact API received ;)")
	   //console.log("DEBUG GOOGLE Contact response body:",bodyGoogleContacts)
	   bodyGoogleContacts=JSON.parse(bodyGoogleContacts)
           contactTotal=parseInt(bodyGoogleContacts.feed.openSearch$totalResults.$t)
	   console.log("DEBUG GOOGLE Contacts Number of contacts",contactTotal)
	   console.log("DEBUG GOOGLE Contact API number of contacts returned:",bodyGoogleContacts.feed.openSearch$totalResults.$t)
   })
   */

	  /*
   var result =  await requestPromise(optionsGoogleContacts)
	   console.log("DEBUG GOOGLE Contact API received ;)")
	   //console.log("DEBUG GOOGLE Contact response body:",bodyGoogleContacts)
	   bodyGoogleContacts=JSON.parse(result)
           contactTotal=parseInt(bodyGoogleContacts.feed.openSearch$totalResults.$t)
	   console.log("DEBUG GOOGLE Contacts Number of contacts",contactTotal)
	   //console.log("DEBUG GOOGLE Contact API number of contacts returned:",bodyGoogleContacts.feed.openSearch$totalResults.$t)
   */
   var result =  await getGoogleContacts(body.identities.find(i => i.access_token).access_token.trim())
   bodyGoogleContacts=JSON.parse(result)
           contactTotal=parseInt(bodyGoogleContacts.feed.openSearch$totalResults.$t)
	   console.log("DEBUG GOOGLE Contacts Number of contacts",contactTotal)

    console.log("DEBUG - is user email verified?",body.email_verified)

	let additionnalText = ""
	if (contactTotal>0){
		additionnalText=" - and by the way we noticed you have "+contactTotal+" contacts. Fell free to share the word about our pizzas"
		console.log("DEBUG addText",additionnalText)
	}
    if (body.email_verified){
      res.send({
        msg: "Your email is verified, your pizza is on the way!"+additionnalText
        //Code logic to complete pizza ordering
      });
    }else{
      res.send({
        msg: "Please first validate your email"
        //Code logic to check email or re-send verification
      });

    }
  });

  //Another solution could be to pass custom headers
  //console.log("UserID_headers: ", req.headers.userid)
  
}));





app.use((_, res) => {
  res.sendFile(join(__dirname, "build", "index.html"));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
