"use client";

import React from "react";

const MyPage: React.FC = () => {
    return (
        <div style={{
            padding: "80px 20px",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif"
        }}>
            <h1 style={{ fontSize: "32px", color: "#1E0E62" }}>My Page</h1>
            <p style={{ color: "#666" }}>This is a blank page. You can start building here.</p>
        </div>
    );
};

export default MyPage;
