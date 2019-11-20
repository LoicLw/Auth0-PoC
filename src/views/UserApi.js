import React, { useState } from "react";
import { Button } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0 } from "../react-auth0-spa";

const UserApi = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const { getTokenSilently } = useAuth0();

  //We ask for user info in use object
  const { user } = useAuth0();

  const userApi = async () => {
    try {
      console.log("[Dev Logs] - Calling getTokenSilently")
      
      //getTokenSilently: If there's a valid token stored, return it. Otherwise, opens an iFrame with the /authorize URL using the parameters provided as arguments. 
      
      //Google OAuth 2.0 needs to pass the parameter access_type=offline when calling the Auth0 /authorize endpoint)access_type=offline to force new token as Google OAuth Access Token are only valid for 3600s
      //We can customize the scopes and audience here i.e. authorize readonly contacts access

      const token = await getTokenSilently();


      console.log("[Dev Logs] - Auth0 token is:", token)
      //We use user.sub
      console.log("[Dev Logs] - Your User ID is: ", user.sub)

      // We check on both Front-end and back-end if email is verified
      
      console.log("[Dev Logs] - Calling Management API")
      //https://seappl.eu.auth0.com/api/v2/users/+ user.sub
      const response = await fetch("/api/userinfo" , {
        headers: {
          Authorization: `Bearer ${token}`,
          UserID: user.sub
        },
      });

      const responseData = await response.json();

      setShowResult(true);
      setApiMessage(responseData.msg);
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="mb-5">
        <h1>Dear user</h1>
        <p>
        In accordance with GDPR please find below your user data. The process might take a few seconds.
        </p>

        <Button color="primary" className="mt-5" onClick={userApi}>
          Retrieve your user info the Management API
        </Button>
      </div>

      <div className="result-block-container">
        <div className={`result-block ${showResult && "show"}`}>
          <h6 className="muted">Result</h6>
          <p>
          <Highlight>{JSON.stringify(apiMessage, null, 2)}</Highlight>
          </p>
        </div>
      </div>
    </>
  );
};

export default UserApi;
