"use client";

import { useRouter } from "next/navigation";
import { Button } from "antd";
import { HomeOutlined } from "@ant-design/icons"; // 可选：加个图标更好看

const Header: React.FC = () => {
    const router = useRouter();

    return (
        <div className="header-container" style={{ padding: "1rem" }}>
            <Button
                type="default"
                icon={<HomeOutlined />}
                onClick={() => router.push("/")}
            >
                Home
            </Button>
        </div>
    );
};

export default Header;
