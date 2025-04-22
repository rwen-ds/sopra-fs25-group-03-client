"use client";

import { useRouter } from "next/navigation";
import { Button } from "antd";
import { HomeOutlined } from "@ant-design/icons"; // 可选：加个图标更好看

const LoggedIn: React.FC = () => {
    const router = useRouter();

    return (
        <div className="header-container" style={{ padding: "1rem" }}>
            <Button
                type="default"
                icon={<HomeOutlined />}
                onClick={() => router.push("/logged-in")}
            >
                Home
            </Button>
        </div>
    );
};

export default LoggedIn;
