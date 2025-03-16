import { useState } from "react";
import {
  startSSEStream,
  getHoursAvailable,
  getWeather,
} from "../services/QueryAI.service";

const useManageAI = (sessionId: string) => {
  //@ts-ignore
  const [messages, setMessages] = useState<any[]>([]);
  const [testHours, setTestHours] = useState<any[]>([]);
  const [weather, setWeather] = useState<any[]>([]);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const [errorTestHours, setErrorTestHours] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingTestHours, setLoadingTestHours] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const OnLoadingMessage = () => setLoadingMessages(true);
  const OnLoadedMessage = () => setLoadingMessages(false);

  const OnLoadingTestHours = () => setLoadingTestHours(true);
  const OnLoadedTestHours = () => setLoadingTestHours(false);

  const OnLoadingWeather = () => setLoadingWeather(true);
  const OnLoadedWeather = () => setLoadingWeather(false);

  const handleStartChat = async (query: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    let aiResponse = "";
    setMessages((prev) => [...prev, { sender: "ai_temp", text: "" }]);

    const onChunk = (chunkData: string) => {
      aiResponse += chunkData + " ";
      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender === "ai_temp" ? { ...msg, text: aiResponse } : msg
        )
      );
    };

    const onEnd = () => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender === "ai_temp" ? { sender: "ai", text: aiResponse } : msg
        )
      );
    };

    await startSSEStream(
      query,
      sessionId,
      onChunk,
      setErrorMessages,
      onEnd,
      OnLoadingMessage,
      OnLoadedMessage
    );
  };

  const handleGetTestHours = async () => {
    const onTestHours = (messages: any) => {
      const toolOutput = messages?.find(
        (message: any) => message?.eventType === "tool_output"
      );

      let testHoursConfig: any = [];
      if (toolOutput?.data) {
        const objectToolOutput = JSON.parse(toolOutput?.data);
        let outputStr = objectToolOutput.output;
        outputStr = outputStr.replace(/^"|"$/g, "");
        outputStr = outputStr.replace(/^```|```$/g, "");
        testHoursConfig = eval(outputStr);
      }
      setTestHours(testHoursConfig);
    };

    await getHoursAvailable(
      sessionId,
      onTestHours,
      setErrorTestHours,
      OnLoadingTestHours,
      OnLoadedTestHours
    );
  };

  const handleGetWeather = async () => {
    const onSetWeather = (messages: any) => {
      const toolOutput = messages?.find(
        (message: any) => message?.eventType === "tool_output"
      );
      const weatherConfig = JSON.parse(toolOutput);
      // setWeather()
    };

    await getWeather(
      sessionId,
      onSetWeather,
      setErrorTestHours,
      OnLoadingWeather,
      OnLoadedWeather
    );
  };

  return {
    messages,
    loadingMessages,
    errorMessages,
    handleStartChat,
    setErrorMessages,
    handleGetTestHours,
    testHours,
    loadingTestHours,
    handleGetWeather,
    loadingWeather,
  };
};

export default useManageAI;
