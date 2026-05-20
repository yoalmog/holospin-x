import React, {
  useEffect,
  useState,
} from "react";

import "./styles.css";

export default function App() {

  const [rpm, setRpm] =
    useState(1200);

  const [fps, setFps] =
    useState(60);

  const [connected, setConnected] =
    useState(false);

  useEffect(() => {

    let ws;

    try {

      ws = new WebSocket(
        "ws://192.168.4.1:81/"
      );

      ws.onopen = () => {
        setConnected(true);
      };

      ws.onclose = () => {
        setConnected(false);
      };

      ws.onerror = () => {
        setConnected(false);
      };

      ws.onmessage = (msg) => {

        try {

          const data =
            JSON.parse(msg.data);

          setRpm(data.rpm || 0);

          setFps(data.fps || 0);

        } catch {}

      };

    } catch {}

    return () => {
      if (ws) ws.close();
    };

  }, []);

  return (

    <div className="app">

      <div className="background">
        <div className="ring ring1"></div>
        <div className="ring ring2"></div>
        <div className="core"></div>
      </div>

      <div className="overlay">

        <h1>
          HOLOSPIN X
        </h1>

        <div className="status">
          {connected
            ? "ONLINE"
            : "OFFLINE"}
        </div>

        <div className="stats">

          <div className="card">
            RPM
            <span>{rpm}</span>
          </div>

          <div className="card">
            FPS
            <span>{fps}</span>
          </div>

          <div className="card">
            MODE
            <span>LIVE</span>
          </div>

        </div>

        <div className="buttons">

          <button>
            LIVE FX
          </button>

          <button>
            UPLOAD
          </button>

          <button>
            CONTROL
          </button>

        </div>

      </div>

    </div>

  );

}
