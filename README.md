# Auth0 SPA front-end + API back-end authentication flow

An API endpoint `/api/external` is set in the Express server. It requires a bearer token to be supplied in the `Authorization` header as provided during the authentication flow. 
Validation of the JWT uses [`express-jwt`](https://github.com/auth0/express-jwt) middleware to validate the token against the identifier of your API as set up in the Auth0 dashboard, as well as checking that the signature is valid.

## Project setup

Use `yarn` or `npm` to install the project dependencies:

```bash
# Using npm..
npm install
```

### Configuration

The project needs to be configured with your Auth0 domain and client ID in order for the authentication flow to work in `src/auth_config.json`. Replace the values with your own Auth0 application credentials.

### Compiles with hot-reloads

This compiles and serves the React app, and starts the backend API server on port 3001. Calls to `http://localhost:3000/api/*` routes will be proxied through to the backend:

```bash
npm run dev
```

## Frequently Asked Questions

We are compiling a list of questions and answers regarding the new JavaScript SDK - if you're having issues running the sample applications, [check the FAQ](https://github.com/auth0/auth0-spa-js/blob/master/FAQ.md)!

## What is Auth0?

Auth0 helps you to:

- Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
- Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
- Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
- Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
- Analytics of how, when and where users are logging in.
- Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## License

This project is licensed under the MIT license. See the [LICENSE](../LICENSE) file for more info.
