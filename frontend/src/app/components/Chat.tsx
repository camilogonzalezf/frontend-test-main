import React, { useEffect, useRef } from "react";
import { Card, Input, Button, List, Typography, Space } from "antd";

import { WechatOutlined } from "@ant-design/icons";

const { Text } = Typography;

import "./styles.css";
const Chat: React.FC<{
  messages: any[];
  loadingMessages: boolean;
  disabledChat: boolean;
  query: string;
  onSetQuery: (element: string) => void;
  startChat: any;
  onDisabledChat: any;
}> = ({
  messages,
  loadingMessages,
  query,
  onSetQuery,
  startChat,
  disabledChat,
  onDisabledChat,
}) => {
  const listRef = useRef(null);

  const displayedMessages = messages.filter(
    (msg: any) => msg.sender !== "ai_temp"
  );

  const handleInputChange = (e: any) => {
    onSetQuery(e.target.value);
  };

  const handleSend = async () => {
    onDisabledChat(true);
    await startChat(query);
    onSetQuery("");
  };

  useEffect(() => {
    if (listRef.current) {
      //@ts-ignore
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [displayedMessages, loadingMessages]);

  useEffect(() => {
    if (!loadingMessages) {
      onDisabledChat(false);
    }
  }, [loadingMessages]);

  return (
    <Card
      title={
        <span style={{ color: "#30c463", fontWeight: "bolder" }}>
          <span>
            <WechatOutlined style={{ fontSize: "32px", marginRight: "10px" }} />
          </span>
          Chat with Lex
        </span>
      }
      style={{
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div
        ref={listRef}
        style={{ marginBottom: 16, maxHeight: 300, overflowY: "auto" }}
      >
        <List
          dataSource={displayedMessages}
          renderItem={(msg, index) => (
            <List.Item
              key={index}
              style={{
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  paddingRight: "10px",
                }}
              >
                <Text strong>{msg.sender === "user" ? "You:" : "Lex:"}</Text>
                <div>{msg.text}</div>
              </div>
            </List.Item>
          )}
        />
      </div>
      {loadingMessages && (
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div className="loader"></div>
        </div>
      )}
      <Space.Compact style={{ display: "flex" }}>
        <Input
          style={{ width: "calc(100% - 100px)" }}
          placeholder="Type your message..."
          value={query}
          onChange={handleInputChange}
          onPressEnter={handleSend}
        />
        <Button type="primary" onClick={handleSend} disabled={disabledChat}>
          Send
        </Button>
      </Space.Compact>
    </Card>
  );
};

export default Chat;
