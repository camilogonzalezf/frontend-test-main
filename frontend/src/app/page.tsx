"use client";
import { useState } from "react";

export default function SSEComponent() {
  const [query, setQuery] = useState("");
  const [sessionId] = useState("XXXXXX");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const startSSE = async () => {
    try {
      const response = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, session_id: sessionId }),
      });

      if (!response.ok) {
        console.error("Error en la respuesta:", response.statusText);
        return;
      }
      //@ts-ignore
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        console.log(chunk);
        // Aquí podrías parsear los eventos SSE (ej. separando líneas y detectando "event:" o "data:" según el formato)
      }
    } catch (error) {
      console.error("Error en fetch:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Ingresa tu query"
        value={query}
        onChange={handleInputChange}
      />
      <button onClick={startSSE}>Enviar y empezar SSE</button>
    </div>
  );
}
