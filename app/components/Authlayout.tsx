// components/AuthLayout.tsx
import React from "react";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url("https://imgur.com/a/4i9vhhn")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: 12,
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
