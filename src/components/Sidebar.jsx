import {
  LayoutDashboard,
  Disc3,
  Folder,
  Cpu,
  Settings,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

export default function Sidebar() {

  const location =
    useLocation();

  const menu = [

    {
      icon:<LayoutDashboard />,
      name:"Dashboard",
      path:"/"
    },

    {
      icon:<Disc3 />,
      name:"Visualizer",
      path:"/visualizer"
    },

    {
      icon:<Folder />,
      name:"Files",
      path:"/files"
    },

    {
      icon:<Cpu />,
      name:"Devices",
      path:"/devices"
    },

    {
      icon:<Settings />,
      name:"Settings",
      path:"/settings"
    }

  ];

  return (

    <div className="sidebar">

      <div className="logo">
        HOLOSPIN X
      </div>

      <div className="menu">

        {
          menu.map((item)=>(
            <Link
              key={item.name}
              to={item.path}

              className={
                location.pathname
                === item.path

                ? "menuItem active"
                : "menuItem"
              }
            >

              {item.icon}

              <span>
                {item.name}
              </span>

            </Link>
          ))
        }

      </div>

    </div>

  );

}
