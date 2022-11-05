import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import LoginGithub from 'react-login-github';
import { useNavigate } from "react-router-dom";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { client } from "../client";
import jwt_decode from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {

    const decoded = jwt_decode(response.credential);
    const { name, picture, sub } = decoded;
    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture
    }
    console.log(decoded);
    client.createIfNotExists(doc)
      .then(() => {
        navigate('/', { replace: true })
      })
  }

  // https://levelup.gitconnected.com/how-to-implement-login-with-github-in-a-react-app-bd3d704c64fc


  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className=" relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
          </div>

          <div className="shadow-2xl">
            <GoogleOAuthProvider
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
            >
              <div>
                <GoogleLogin
                  onSuccess={(response) => { console.log(response) }}
                  onError={responseGoogle}
                />
              </div>
            </GoogleOAuthProvider>
          </div>
          <div className="shadow-2xl">
            {/* <LoginGithub clientId={process.env.REACT_APP_GITHUB_API_CLIENT_ID}
              onSuccess={response => console.log(response)}
              onFailure={response => console.log(response)}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
