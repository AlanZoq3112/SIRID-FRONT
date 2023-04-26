import React, { useState, useRef } from "react";
import { FaBars } from "react-icons/fa";
import { AiOutlineUser, AiOutlineHome } from "react-icons/ai";
import {FaClipboardList} from "react-icons/fa"
import {FcStatistics} from "react-icons/fc"
import { FiUsers } from "react-icons/fi";
import { NavLink } from "react-router-dom";

import LogoutButton from "../LogoutButton";

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminSidebar = ({ children }) => {


  //Esto es para abrir y cerrar el sidebar
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);




  //Son los items del sisebar
  const menuItem = [
    
    {
      path: "/Inicio",
      name: "Componentes",
      icon: <AiOutlineHome />,
    },
    {
      path: "/IncidenciasPendientes",
      name: "Incidencias",
      icon: <FaClipboardList />,
    },
    {
      path: "/Users",
      name: "Usuarios",
      icon: <FiUsers />,
    },
    {
      path: "/Estadisticas",
      name: "Estadisticas",
      icon: <FcStatistics/>
    },
    {
      path: "/Perfil",
      name: "Perfil",
      icon: <AiOutlineUser />,
    },
   
  ];
  return (
    <div className="contenedor">
      {/* Sidebar */}
      <div style={{  width: isOpen ? "250px" : "50px" }} className="sidebars">
        <div className="top_sections">
          <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
            SIRID
          </h1>
          <div
            style={{ marginLeft: isOpen ? "50px" : "0px" }}
            className="barss"
          >
            <FaBars onClick={toggle} />
          </div>
        </div>
        {menuItem.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeclassname="active"
          >
            <div className="icono">{item.icon}</div>
            <div
              style={{ display: isOpen ? "block" : "none" }}
              className="link_text"
            >
              {item.name}
            </div>
          </NavLink>
        ))}
        
      </div>
      <LogoutButton/>
      <main>{children}</main>
     
    </div>
  );
};

export default AdminSidebar;
