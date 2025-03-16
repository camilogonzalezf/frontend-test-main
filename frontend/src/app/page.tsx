"use client";
import { useState, useEffect } from "react";
import useManageAI from "./hooks/useManageAI";
import { Layout, Row, Col, Typography, Tag, notification, Spin } from "antd";
import Chat from "./components/Chat";

export default function ChatComponent() {
  const [query, setQuery] = useState("");
  const sessionId = "XXXXXX";
  const {
    messages,
    handleStartChat,
    loadingMessages,
    errorMessages,
    setErrorMessages,
    handleGetTestHours,
    testHours,
    loadingTestHours,
    handleGetWeather,
    loadingWeather,
  } = useManageAI(sessionId);

  const { Header, Content } = Layout;
  const { Title, Text } = Typography;

  const newYorkTemperature = "20°C";

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    // handleGetTestHours();
    // handleGetWeather();
  }, []);

  useEffect(() => {
    if (errorMessages) {
      api.error({
        message: "Error",
        description: errorMessages,
      });
      setErrorMessages(null);
    }
  }, [errorMessages, api]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {loadingTestHours && <Spin size="large" fullscreen />}
      {contextHolder}
      <Header style={{ background: "#fff", padding: "0 20px" }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Title level={4} style={{ margin: 0 }}>
              New York Temperature: {newYorkTemperature}
            </Title>
          </Col>
          <Col xs={24} sm={12}>
            <div>
              <Text strong>Test Drive Hours: </Text>
              {loadingTestHours && <Spin size="small" />}
              {testHours?.map((time, index) => (
                <Tag key={index} style={{ margin: "0 4px" }}>
                  {time}
                </Tag>
              ))}
            </div>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: "20px" }}>
        <Chat
          query={query}
          messages={messages}
          loadingMessages={loadingMessages}
          onSetQuery={setQuery}
          startChat={handleStartChat}
        />
      </Content>
    </Layout>
  );
}

/*


*/
