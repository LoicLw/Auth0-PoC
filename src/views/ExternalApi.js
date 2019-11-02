import React, { useState } from "react";
import { Button } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0 } from "../react-auth0-spa";

const ExternalApi = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const { getTokenSilently } = useAuth0();

  //User info in 
  const { user } = useAuth0();

  const callApi = async () => {
    try {
      const token = await getTokenSilently();

      //We use user.sub
      console.log("Front - USERID is: ", user.sub)

      //ADD CHECK IF USER_EMAIL is verified
      if(!user.email_verified){
        setShowResult(true);
        setApiMessage("You need to verify your email first")
      }
        
      else{
        const response = await fetch("/api/order", {
          headers: {
            Authorization: `Bearer ${token}`,
            UserID: user.sub
          },
        });

        const responseData = await response.json();

        setShowResult(true);
        setApiMessage("Your email is validated, thank you :) " + responseData.msg);

      }

      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="mb-5">
        <h1>Our pizza menu</h1>
        <p>
          We only offer one kind of pizza. A healthy vegan pizza sourced from great food producers.
        </p>

        <Button color="primary" className="mt-5" onClick={callApi}>
          Order our pizza
        </Button>
      </div>

      <div className="result-block-container">
        <div className={`result-block ${showResult && "show"}`}>
          <h6 className="muted">Result</h6>
          <Highlight>{JSON.stringify(apiMessage, null, 2)}</Highlight>
        </div>
      </div>
    </>
  );
};

export default ExternalApi;
