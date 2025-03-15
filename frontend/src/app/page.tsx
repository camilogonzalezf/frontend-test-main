"use client";
import { useState } from "react";

export default function ChatComponent() {
  const [query, setQuery] = useState("");
  const [sessionId] = useState("XXXXXX");
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const startChat = async () => {
    setMessages((prev) => [...prev, { sender: "user", text: query }]);

    try {
      const response = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, session_id: sessionId }),
      });

      if (!response.ok) {
        console.error("Error answer:", response.statusText);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let aiResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        const events = chunk.split("\n\n");
        for (const eventBlock of events) {
          if (!eventBlock.trim()) continue;
          const lines = eventBlock.split("\n").map((line) => line.trim());
          let eventType = "";
          let data = "";

          for (const line of lines) {
            if (line.startsWith("event:")) {
              eventType = line.replace("event:", "").trim();
            }
            if (line.startsWith("data:")) {
              data += line.replace("data:", "").trim();
            }
          }

          if (eventType === "chunk") {
            const separated = data.replace(/([a-z])([A-Z])/g, "$1 $2");
            aiResponse += separated + " ";
            setMessages((prev) => {
              const withoutTemp = prev.filter((m) => m.sender !== "ai_temp");
              return [...withoutTemp, { sender: "ai_temp", text: aiResponse }];
            });
          }
        }
      }

      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.sender !== "ai_temp");
        return [...withoutTemp, { sender: "ai", text: aiResponse }];
      });
    } catch (error) {
      console.error("Error en fetch:", error);
    }

    setQuery("");
  };

  return (
    <div>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              textAlign: msg.sender === "user" ? "right" : "left",
            }}
          >
            <strong>{msg.sender === "user" ? "Tú" : "IA"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Type..."
          value={query}
          onChange={handleInputChange}
          style={{ width: "80%", padding: "8px" }}
        />
        <button
          onClick={startChat}
          style={{ padding: "8px 12px", marginLeft: "5px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
