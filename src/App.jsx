import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Visualizer from "./pages/Visualizer";
import Files from "./pages/Files";
import Devices from "./pages/Devices";
import Settings from "./pages/Settings";

import "./styles.css";

export default function App() {

  return (

    <BrowserRouter>

      <div className="layout">

        <Sidebar />

        <div className="content">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/visualizer"
              element={<Visualizer />}
            />

            <Route
              path="/files"
              element={<Files />}
            />

            <Route
              path="/devices"
              element={<Devices />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Routes>

        </div>

      </div>

    </BrowserRouter>

  );

}
