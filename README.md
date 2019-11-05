# Auth0 SPA front-end + API back-end authentication flow



## Setup

Use `npm` to install the project dependencies and run in development. It will compiles and serves the React app, and starts the backend API server on port 3001. Calls to `http://localhost:3000/api/*` routes will be proxied through to the backend. Point DNS A records to your VPS. You can use also use Casper to serve valid HTTPS using Let's Encrypt certificate.

```bash
# Using npm..
npm install
npm run dev
sudo ./caddy2_beta8_linux_amd64 reverse-proxy --from https://auth0.chatdocs.io --to http://localhost:3000
```


### Configuration

The project needs to be configured with your Auth0 domain and client ID in order for the authentication flow to work in `src/auth_config.json`. Replace the values with your own Auth0 application credentials.

An API endpoint `/api/external` is set in the NPM Express server. It requires a bearer token to be supplied in the `Authorization` header as provided during the authentication flow. Validation of the JWT uses [`express-jwt`](https://github.com/auth0/express-jwt) middleware to validate the token against the identifier of your API as set up in the Auth0 dashboard, as well as checking that the signature is valid.

## What is Auth0?

Auth0 helps you to:
- Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
- Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
- Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
- Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
- Analytics of how, when and where users are logging in.
- Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## License

This project is licensed under the MIT license.