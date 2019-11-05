import React from "react";

import logo from "../assets/logo.svg";

const Hero = () => (
  <div className="text-center hero my-5">
    <img className="mb-3 app-logo" src={logo} alt="logo" width="100" />
    <h1 className="mb-4">Plants Pizza42</h1>

    <p className="lead">
      This is a proof of concept application that demonstrates an authentication flow for
      a pizza ordering system. It is made of a single page application using ReactJS for its front-end, NodeJS and Express for its API back-end plus Auth0 to handle the IAM as a Service.
    </p>
  </div>
);

export default Hero;
