import React from "react";
import "./aboutSection.css";
import VD_Photo from "../../../images/VD_Photo.jpeg";
import { Button, Typography, Avatar } from "@material-ui/core";


const About = () => {
  const visitLinkedIn = () => {
    window.location.href = "https://www.linkedin.com/in/vibha-demla-0abb1825b/";
  };

  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>
        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src={VD_Photo}
              alt="Founder"
            />
            <Typography>Vibha Demla</Typography>
            <Button onClick={visitLinkedIn} color="primary">
              Visit LinkedIn
            </Button>
            <span>
              This is a sample website made by Vibha Demla. Only with the
              purpose to learn MERN Stack.
            </span>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default About;
