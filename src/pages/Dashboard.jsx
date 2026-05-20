import {
  Activity,
  Zap,
  Cpu,
} from "lucide-react";

export default function Dashboard(){

  return(

    <div className="page">

      <h1>
        Dashboard
      </h1>

      <div className="cards">

        <div className="card">

          <Activity />

          <span>RPM</span>

          <h2>1450</h2>

        </div>

        <div className="card">

          <Zap />

          <span>FPS</span>

          <h2>60</h2>

        </div>

        <div className="card">

          <Cpu />

          <span>TEMP</span>

          <h2>37°</h2>

        </div>

      </div>

      <div className="hero">

        <div className="ring r1"></div>
        <div className="ring r2"></div>
        <div className="ring r3"></div>

        <div className="core"></div>

      </div>

    </div>

  );

}
