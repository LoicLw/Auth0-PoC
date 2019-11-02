import React from "react";

import logo from "../assets/logo.svg";

const Hero = () => (
  <div className="text-center hero my-5">
    <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
    <h1 className="mb-4">Pizza ordering authentication & API project</h1>

    <p className="lead">
      This is a sample application that demonstrates an authentication flow for
      an pizza ordering SPA, using ReactJS for the front-end, NodeJS Express for the band-end and Auth0 for the authentication layer
    </p>
  </div>
);

export default Hero;
