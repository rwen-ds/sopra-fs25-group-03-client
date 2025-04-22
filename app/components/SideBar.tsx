"use client";

import { useRouter } from "next/navigation";
import { UserOutlined, MessageOutlined, BellOutlined } from "@ant-design/icons";
import React from "react";

const SideBar: React.FC = () => {
    const router = useRouter();

    const iconStyle: React.CSSProperties = {
        fontSize: "24px",
        cursor: "pointer",
        padding: "20px",
        borderRadius: "12px",
        transition: "background 0.2s",
    };

    const handleNavigate = (path: string) => {
        router.push(path);
    };

    return (
        <div style={{
            height: "100vh",
            width: "80px",
            backgroundColor: "#f9f9f9",
            borderRight: "1px solid #eee",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "20px",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.05)"
        }}>
            <div
                style={iconStyle}
                onClick={() => handleNavigate("/profile")}
                title="Profile"
            >
                <UserOutlined />
            </div>
            <div
                style={iconStyle}
                onClick={() => handleNavigate("/chat")}
                title="Messages"
            >
                <MessageOutlined />
            </div>
            <div
                style={iconStyle}
                onClick={() => handleNavigate("/notification")}
                title="Notifications"
            >
                <BellOutlined />
            </div>
        </div>
    );
};

export default SideBar;
