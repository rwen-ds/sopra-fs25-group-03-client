'use client';

import "@ant-design/v5-patch-for-react-19";
import Link from 'next/link';
import { Button, Tooltip } from 'antd';
import { FileSearchOutlined, PlusOutlined, AppstoreOutlined } from '@ant-design/icons';
import '@/styles/globals.css';
import SideBar from "@/components/SideBar";

export default function LoggedIn() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header className="header">
        <div className="left-side">
          <div className="brand-name">
            <h1>KindBridge</h1>
          </div>
        </div>
      </header>

      {/* Body: Sidebar + Main Content */}
      <div style={{ flex: 1, display: "flex" }}>

        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <div style={{ flex: 1, padding: "2rem" }}>
          <section
            className="logged-buttons"
            style={{
              display: "flex",
              gap: "24px",
              paddingTop: "40px",
              paddingLeft: "20px",
            }}
          >
            <Tooltip title="Browse Requests" color="#75bd9d">
              <Link href="/requests">
                <Button
                  type="primary"
                  size="large"
                  icon={<AppstoreOutlined />}
                  shape="circle"
                  style={{ fontSize: "32px", width: "64px", height: "64px" }}
                />
              </Link>
            </Tooltip>

            <Tooltip title="My Requests" color="#75bd9d">
              <Link href="/requests/my-requests">
                <Button
                  type="primary"
                  size="large"
                  icon={<FileSearchOutlined />}
                  shape="circle"
                  style={{ fontSize: "32px", width: "64px", height: "64px" }}
                />
              </Link>
            </Tooltip>

            <Tooltip title="Post New Request" color="#75bd9d">
              <Link href="/requests/post-request">
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  shape="circle"
                  style={{ fontSize: "32px", width: "64px", height: "64px" }}
                />
              </Link>
            </Tooltip>
          </section>

        </div>
      </div>
    </div>
  );
}
