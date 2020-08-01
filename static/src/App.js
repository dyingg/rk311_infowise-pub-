import React, { useState, useEffect } from "react";
import "./App.scss";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";

import { Layout } from "antd";
import TitleBar from "./Components/TitleBar";
import Single from "./Single";

const { Header, Footer, Sider, Content } = Layout;

const { SubMenu } = Menu;

function App() {
  const handleClick = (e) => {
    console.log("click ", e);
  };

  return (
    <>
      <TitleBar />
      <Layout>
        <Sider>
          <Menu
            onClick={handleClick}
            style={{ width: 200, height: "100%" }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
          >
            <SubMenu
              key="sub1"
              title={
                <span>
                  <AreaChartOutlined />
                  <span>Test IPS</span>
                </span>
              }
            >
              <Menu.ItemGroup key="g1" title="Single IPs">
                <Menu.Item key="1">Complete Test</Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup key="g2" title="Batch IPs">
                <Menu.Item key="3">Batch Test</Menu.Item>
              </Menu.ItemGroup>
            </SubMenu>
            <SubMenu
              key="sub2"
              icon={<AppstoreOutlined />}
              title="Navigation Two"
            >
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="7">Option 7</Menu.Item>
                <Menu.Item key="8">Option 8</Menu.Item>
              </SubMenu>
            </SubMenu>
            <SubMenu
              key="sub4"
              title={
                <span>
                  <SettingOutlined />
                  <span>Settings</span>
                </span>
              }
            >
              <Menu.Item key="9">Cloud</Menu.Item>
              <Menu.Item key="10">Module Preferences</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content>
          <Single />
        </Content>
      </Layout>
    </>
  );
}

export default App;
