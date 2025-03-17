"use client";
import { useState, useEffect } from "react";
import useManageAI from "./hooks/useManageAI";
import { Layout, Row, Col, notification, Spin, Space } from "antd";

import {
  CloudOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import Chat from "./components/Chat";
import CardInfo from "./components/CardInfo";

export default function ChatComponent() {
  const [query, setQuery] = useState("");

  const sessionId = "XXXXXX";

  const {
    messages,
    handleStartChat,
    loadingMessages,
    errorMessages,
    setErrorMessages,
    handleGetInfo,
    loadingGeneralInfo,
    testHours,
    weatherValue,
    dealershipAddress,
    errorGeneralInfo,
    disabledChat,
    setDisabledChat,
  } = useManageAI(sessionId);

  const { Content } = Layout;
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    handleGetInfo();
  }, []);

  useEffect(() => {
    if (errorMessages || errorGeneralInfo) {
      const text = errorMessages
        ? errorMessages
        : errorGeneralInfo
        ? errorGeneralInfo
        : "API error";
      api.error({
        message: "Error",
        description: text,
      });
      setErrorMessages(null);
    }
  }, [errorMessages, errorGeneralInfo, api]);

  const cardsInfo = [
    {
      type: "text",
      title: "Weather information",
      content: weatherValue,
      icon: <CloudOutlined />,
    },
    {
      type: "text",
      title: "Dealership address",
      content: dealershipAddress,
      icon: <EnvironmentOutlined />,
    },
    {
      type: "tag",
      title: "Appointment availability today",
      content: testHours,
      icon: <CalendarOutlined />,
    },
    {
      type: "text",
      title: "Appointment confirmation",
      content: "You have appointments: 17th March 2025",
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", padding: "20px" }}>
      {loadingGeneralInfo && <Spin size="large" fullscreen />}
      {contextHolder}
      <Content>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {cardsInfo?.map((card: any) => (
                <CardInfo
                  title={card.title}
                  content={card.content}
                  type={card.type}
                  icon={card.icon}
                />
              ))}
            </Space>
          </Col>
          <Col xs={24} md={16}>
            <Chat
              query={query}
              messages={messages}
              loadingMessages={loadingMessages}
              onSetQuery={setQuery}
              startChat={handleStartChat}
              disabledChat={disabledChat}
              onDisabledChat={setDisabledChat}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
