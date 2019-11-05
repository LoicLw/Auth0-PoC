# Auth0 SPA front-end + API back-end authentication flow


## Setup

Use `npm` to install the project dependencies and run in development. It will compiles and serves the React app, and starts the backend API server on port 3001. Calls to `http://localhost:3000/api/*` routes will be proxied through to the backend. Point DNS A records to your VPS. You can use also use Casper to serve valid HTTPS using Let's Encrypt certificate.

```bash
git clone https://github.com/LoicLw/Auth0-PoC.git
cd Auth0-PoC/
npm install
npm run dev
sudo ./caddy reverse-proxy --from https://auth0.chatdocs.io --to http://localhost:3000
```


### Configuration

The proof of concept can be configured with your Auth0 domain and client ID in `src/auth_config.json`.

An API endpoint `/api/external` is set in the NPM Express server. It requires a bearer token to be supplied in the `Authorization` header as provided during the authentication flow. Validation of the JWT uses [`express-jwt`](https://github.com/auth0/express-jwt) middleware to validate the token against the identifier of your API as set up in the Auth0 dashboard, as well as checking that the signature is valid.


## License

This project is licensed under the MIT license.