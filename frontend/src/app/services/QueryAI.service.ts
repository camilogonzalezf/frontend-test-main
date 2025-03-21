export async function startSSEStream(
  query: string,
  sessionId: string, //@ts-ignore
  onChunk: (element: any) => void,
  onSetErrorMessages: (element: string | null) => void,
  setDisabledChat: (state: boolean) => void,
  onEnd: () => void,
  onLoading: () => void,
  onLoaded: () => void
) {
  const hostUrl = process.env.NEXT_APP_HOST_DOMAIN
    ? process.env.NEXT_APP_HOST_DOMAIN
    : "http://localhost:8000";

  const queryAPI = process.env.NEXT_APP_QUERY_URL
    ? process.env.NEXT_APP_QUERY_URL
    : "/query";

  try {
    //@ts-ignore
    const apiUrl = hostUrl + queryAPI;
    //@ts-ignore
    const response: any = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, session_id: sessionId }),
    });

    if (!response.ok) {
      throw new Error(`Error: response: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let finished = false;
    let recolectedEvents = [];

    while (!finished) {
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
            data = line.replace("data:", "").trim();
          }
        }

        recolectedEvents.push({
          eventType: eventType,
          data: data,
        });

        if (eventType === "end") {
          finished = true;
          break;
        }
      }
    }

    let finalString = "";
    for (const event of recolectedEvents) {
      if (event?.eventType === "chunk" && event?.data !== "") {
        if (
          ["!", "?", ",", ".", "'", "'s", "'re", "'ve", ":"].includes(
            event?.data
          )
        ) {
          finalString = finalString + event?.data;
        } else if (finalString.endsWith(":")) {
          finalString = finalString + event?.data;
        } else {
          finalString = finalString + " " + event?.data;
        }
      }
    }

    onChunk(finalString);
    onLoading();
    setTimeout(() => {
      onEnd();
      onLoaded();
    }, 3000);
  } catch (error) {
    onSetErrorMessages("An error has been found, please write again.");
    onLoaded();
    setDisabledChat(false);
  }
}

export async function getGeneralInfo(
  query: string,
  sessionId: string, //@ts-ignore
  onSetGeneralInfo: any,
  onSetGeneralInfoError: (element: string | null) => void,
  onLoading: () => void,
  onLoaded: () => void
) {
  const hostUrl = process.env.NEXT_APP_HOST_DOMAIN
    ? process.env.NEXT_APP_HOST_DOMAIN
    : "http://localhost:8000";

  const queryAPI = process.env.NEXT_APP_QUERY_URL
    ? process.env.NEXT_APP_QUERY_URL
    : "/query";

  try {
    onLoading();
    //@ts-ignore
    const apiUrl = hostUrl + queryAPI;
    //@ts-ignore
    const response: any = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, session_id: sessionId }),
    });

    if (!response.ok) {
      throw new Error(`Error: response: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let finished = false;
    let recolectedEvents = [];

    while (!finished) {
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
            data = line.replace("data:", "").trim();
          }
        }

        recolectedEvents.push({
          eventType: eventType,
          data: data,
        });

        if (eventType === "end") {
          finished = true;
          break;
        }
      }
    }
    onLoaded();
    onSetGeneralInfo(recolectedEvents);
  } catch (error) {
    onSetGeneralInfoError("An error has been found for obtains information");
    onLoaded();
  }
}
