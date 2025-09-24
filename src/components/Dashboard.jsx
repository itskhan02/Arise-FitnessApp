import { SignedIn, UserButton } from "@clerk/clerk-react";
import React from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Heart, PhoneCallIcon, User2Icon } from "lucide-react";

const Dashboard = () => {
  const [value, setValue] = React.useState(0);   

  const handleChange = (event, newValue) => {
    setValue(newValue);  

  };

  return (
    <>
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "2rem",
          background:
            "linear-gradient(90deg, #050a29ff 0%, #08113eff 40%, #1c0d37ff 150%)",
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
          }}
        >
          <SignedIn
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
              zIndex: 2,
            }}
          >
            <UserButton />
          </SignedIn>
        </div>
        Welcome to your Dashboard!
        <Tabs
        style={{
          position: "absolute",
          bottom: "2rem",
          borderRadius: "2rem",
          background: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          color: "#fff",
          minWidth: "250px",
          padding: "0.5rem 0.5rem",
        }}
          value={value}
          onChange={handleChange}
          aria-label="icon label tabs example">
          <Tab icon={<PhoneCallIcon/>}/>
          <Tab icon={<Heart/>}/>
          <Tab icon={<User2Icon />}/>
          <Tab icon={<User2Icon />} />
        </Tabs>
      </div>
    </>
  );
};

export default Dashboard;
