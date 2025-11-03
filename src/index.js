// import React from "react";
// import ReactDOM from "react-dom/client";
// import { Auth0Provider } from '@auth0/auth0-react';
// import "@/index.css";
// import App from "@/App";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <Auth0Provider
//     domain="dev-qym8p8oypn0lsq3v.uk.auth0.com"
//     clientId="XmLyglgU5GXeSeq9EFhbgrkmNHGG4SeW"
//     authorizationParams={{
//       redirect_uri: window.location.origin + "/callback",
//     }}
//   >
//     <App />

//   </Auth0Provider>
//   </React.StrictMode>,
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "@/index.css";
import App from "@/App";

const domain = "dev-qym8p8oypn0lsq3v.uk.auth0.com";
const clientId = "XmLyglgU5GXeSeq9EFhbgrkmNHGG4SeW";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
