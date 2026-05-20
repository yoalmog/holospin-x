import React,
{
  useEffect,
  useState,
} from "react";

import {
  Activity,
  Cpu,
  Radio,
  Zap,
  Wifi,
  Power,
  SlidersHorizontal,
  Disc3,
  Sparkles,
  Palette,
} from "lucide-react";

import "./styles.css";

export default function App() {

  const [connected,setConnected] =
    useState(false);

  const [rpm,setRpm] =
    useState(1450);

  const [temp,setTemp] =
    useState(37);

  const [fps,setFps] =
    useState(60);

  const [brightness,setBrightness] =
    useState(180);

  const [mode,setMode] =
    useState("HOLOGRAM");

  const [ws,setWs] =
    useState(null);

  // ===================================
  // SOCKET
  // ===================================

  useEffect(()=>{

    let socket;

    try{

      socket =
      new WebSocket(
        "ws://192.168.4.1:81/"
      );

      socket.onopen = ()=>{

        setConnected(true);

      };

      socket.onclose = ()=>{

        setConnected(false);

      };

      socket.onerror = ()=>{

        setConnected(false);

      };

      socket.onmessage = (msg)=>{

        try{

          const data =
          JSON.parse(msg.data);

          if(data.rpm)
            setRpm(data.rpm);

          if(data.temp)
            setTemp(data.temp);

          if(data.fps)
            setFps(data.fps);

        }catch{}

      };

      setWs(socket);

    }catch{}

    return ()=>{

      if(socket)
        socket.close();

    };

  },[]);

  // ===================================
  // SEND
  // ===================================

  const send = (obj)=>{

    if(
      ws &&
      ws.readyState === 1
    ){

      ws.send(
        JSON.stringify(obj)
      );

    }

  };

  // ===================================
  // UI
  // ===================================

  return(

    <div className="app">

      <div className="bg"></div>

      {/* ========================= */}

      <header className="header">

        <div className="brand">

          <div className="logoGlow"></div>

          <div>

            <h1>
              HOLOSPIN X
            </h1>

            <span>
              POV CONTROL SYSTEM
            </span>

          </div>

        </div>

        <div
          className={
            connected
            ? "status online"
            : "status offline"
          }
        >

          <Wifi size={18}/>

          {
            connected
            ? "CONNECTED"
            : "DISCONNECTED"
          }

        </div>

      </header>

      {/* ========================= */}

      <div className="reactorWrap">

        <div className="ring r1"></div>
        <div className="ring r2"></div>
        <div className="ring r3"></div>

        <div className="core">

          <div className="coreInner">

            <Disc3 size={60}/>

          </div>

        </div>

      </div>

      {/* ========================= */}

      <section className="metrics">

        <div className="metric">

          <Activity size={22}/>

          <label>RPM</label>

          <h2>{rpm}</h2>

        </div>

        <div className="metric">

          <Cpu size={22}/>

          <label>TEMP</label>

          <h2>{temp}°</h2>

        </div>

        <div className="metric">

          <Zap size={22}/>

          <label>FPS</label>

          <h2>{fps}</h2>

        </div>

      </section>

      {/* ========================= */}

      <section className="panel">

        <div className="panelTitle">

          <SlidersHorizontal size={18}/>

          LIVE ENGINE CONTROL

        </div>

        {/* ================= */}

        <div className="sliderBlock">

          <div className="sliderTop">

            <span>
              BRIGHTNESS
            </span>

            <strong>
              {brightness}
            </strong>

          </div>

          <input
            type="range"
            min="10"
            max="255"
            value={brightness}

            onChange={(e)=>{

              setBrightness(
                e.target.value
              );

              send({

                type:
                "brightness",

                value:
                e.target.value

              });

            }}
          />

        </div>

        {/* ================= */}

        <div className="modeGrid">

          <button

            className={
              mode==="HOLOGRAM"
              ? "active"
              : ""
            }

            onClick={()=>{

              setMode(
                "HOLOGRAM"
              );

              send({

                type:"mode",
                value:"hologram"

              });

            }}
          >

            <Sparkles size={18}/>

            HOLOGRAM

          </button>

          <button

            className={
              mode==="SPECTRUM"
              ? "active"
              : ""
            }

            onClick={()=>{

              setMode(
                "SPECTRUM"
              );

              send({

                type:"mode",
                value:"spectrum"

              });

            }}
          >

            <Palette size={18}/>

            SPECTRUM

          </button>

          <button

            className={
              mode==="SYNC"
              ? "active"
              : ""
            }

            onClick={()=>{

              setMode(
                "SYNC"
              );

              send({

                type:"mode",
                value:"sync"

              });

            }}
          >

            <Radio size={18}/>

            AUDIO SYNC

          </button>

          <button

            onClick={()=>{

              send({

                type:"power",
                value:"reboot"

              });

            }}
          >

            <Power size={18}/>

            REBOOT

          </button>

        </div>

      </section>

    </div>

  );

}
