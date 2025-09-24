import { SignIn, useAuth } from '@clerk/clerk-react'; // Import useAuth
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { isSignedIn } = useAuth(); // Check if the user is signed in
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/home');
    }
  }, [isSignedIn, navigate]);

  return (
    <>
      <div className="login-page"
        style={{
          height: "99vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "2rem",
          margin: "4px",
          background:
            "linear-gradient(90deg, #050a29ff 0%, #08113eff 40%, #1c0d37ff 150%)",
          boxShadow: "0 0 40px 20px #3a1c71, 0 0 80px 20px #0e2483ff",
          borderRadius: ".5rem",
          overflow: "hidden",
        }}>
        <SignIn />
      </div>
    </>
  );
};

export default Login;
