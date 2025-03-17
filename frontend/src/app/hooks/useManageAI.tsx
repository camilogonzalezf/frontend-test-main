import { useState } from "react";
import { startSSEStream, getGeneralInfo } from "../services/QueryAI.service";

const useManageAI = (sessionId: string) => {
  //@ts-ignore
  const [messages, setMessages] = useState<any[]>([]);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const [errorGeneralInfo, setErrorGeneralInfo] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingGeneralInfo, setLoadingGeneralInfo] = useState(false);
  const [disabledChat, setDisabledChat] = useState(false);

  const [weatherValue, setWeatherValue] = useState("");
  const [dealershipAddress, setDealershipAddress] = useState("");
  const [testHours, setTestHOurs] = useState<any[]>([]);

  const OnLoadingMessage = () => setLoadingMessages(true);
  const OnLoadedMessage = () => setLoadingMessages(false);

  const OnLoadingGeneralInfo = () => setLoadingGeneralInfo(true);
  const OnLoadedGeneralInfo = () => setLoadingGeneralInfo(false);

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
      setDisabledChat,
      onEnd,
      OnLoadingMessage,
      OnLoadedMessage
    );
  };

  const handleGetInfo = async () => {
    const query =
      "give me , weather in New york, dealership address and Appointment availability";

    const onGeneralInfo = (messages: any) => {
      const checkAppointment: any = messages.find(
        (message: any) =>
          message?.data?.includes("check_appointment_availability") &&
          message?.eventType === "tool_output"
      );
      let testHoursConfig: any = [];
      if (checkAppointment?.data) {
        const objectcheckAppointment = JSON.parse(checkAppointment?.data);
        let outputStr = objectcheckAppointment.output;
        outputStr = outputStr.replace(/^"|"$/g, "");
        outputStr = outputStr.replace(/^```|```$/g, "");
        testHoursConfig = eval(outputStr);
      }

      setTestHOurs(testHoursConfig);

      const weatherElement: any = messages.find(
        (message: any) =>
          message?.data?.includes("get_weather") &&
          message?.eventType === "tool_output"
      );

      let weatherConfig: any = "";
      if (weatherElement?.data) {
        const objectcheckWeather = JSON.parse(weatherElement?.data);
        let outputStr = objectcheckWeather.output;
        weatherConfig = outputStr;
      }

      setWeatherValue(weatherConfig);

      const dealerAddressElement: any = messages.find(
        (message: any) =>
          message?.data?.includes("get_dealership_address") &&
          message?.eventType === "tool_output"
      );

      let dealerAddressConfig: any = "";
      if (dealerAddressElement?.data) {
        const objectcheckDealer = JSON.parse(dealerAddressElement?.data);
        let outputStr = objectcheckDealer.output;
        dealerAddressConfig = outputStr;
      }

      setDealershipAddress(dealerAddressConfig);
    };

    await getGeneralInfo(
      query,
      sessionId,
      onGeneralInfo,
      setErrorGeneralInfo,
      OnLoadingGeneralInfo,
      OnLoadedGeneralInfo
    );
  };

  return {
    messages,
    loadingMessages,
    errorMessages,
    handleStartChat,
    setErrorMessages,
    handleGetInfo,
    loadingGeneralInfo,
    testHours,
    weatherValue,
    dealershipAddress,
    errorGeneralInfo,
    disabledChat,
    setDisabledChat,
  };
};

export default useManageAI;
