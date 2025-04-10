// components/ProfileMessNotiLayout.tsx
//This is part of the layout for profile setting&messgae center&notifications
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import {
  Layout,
  Menu,
  Button,
} from "antd";
import {
  AppstoreOutlined,
  MessageOutlined,
  BellOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

interface Props {
  children: ReactNode;
  activeKey?: string;
}

const ProfileMessNotiLayout = ({ children, activeKey }: Props) => {
  const router = useRouter();

  const menuItems = [
    {
      key: "profile",
      icon: <AppstoreOutlined />,
      label: "Profile",
      onClick: () => router.push("/profile"),
    },
    {
      key: "messages",
      icon: <MessageOutlined />,
      label: "Messages",
      onClick: () => router.push("/messages"),
    },
    {
      key: "notifications",
      icon: <BellOutlined />,
      label: "Notifications",
      onClick: () => router.push("/notifications"),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Left Sidebar */}
      <Sider width={80} style={{ background: "#fff", paddingTop: 64 }}>
        <Menu
          mode="inline"
          selectedKeys={[activeKey || ""]}
          style={{ height: "100%", borderRight: 0 }}
        >
          {menuItems.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={item.onClick}
              style={{ fontSize: "18px", display: "flex", justifyContent: "center" }}
            />
          ))}
        </Menu>
      </Sider>

      {/* Main layout */}
      <Layout style={{ flex: 1 }}>
        {/* Top HOME button */}
        <Header style={{ background: "#f5f5f5", padding: "1rem" }}>
          <Button
            style={{
              backgroundColor: "#60dbc5",
              color: "white",
              borderRadius: 24,
              fontWeight: "bold",
            }}
            onClick={() => router.push("/")}
          >
            HOME
          </Button>
        </Header>

        <Content
          style={{
            margin: "24px",
            background: "#fff",
            padding: "24px",
            borderRadius: "12px",
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProfileMessNotiLayout;
