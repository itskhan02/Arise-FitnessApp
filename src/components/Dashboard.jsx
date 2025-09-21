import { SignedIn, UserButton } from '@clerk/clerk-react';
import React from 'react'

const Dashboard = () => {
  return (
    <>
      <div
        style={{
          height: "99vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "2rem",
          background: "linear-gradient(90deg, #050a29ff 0%, #08113eff 40%, #1c0d37ff 150%)",
          color: "#fff",
          fontSize: "1.5rem",
        }}
      >
      <div 
      style={{
            position: "absolute",
            top: "0.8rem",
            left: "1rem",
            padding: "0.5rem 0.5rem",
            borderRadius: "0.5rem",
            background: "transparent",
            color: "#fff",
            cursor: "pointer",
            zIndex: 2,
          }}>
        <SignedIn 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem',background: 'transparent', color: '#fff', cursor: 'pointer', zIndex: 2, }}>
          <UserButton/>
        </SignedIn>
      </div>
        Welcome to your Dashboard!
      </div>
    </>
  );
};

export default Dashboard;
