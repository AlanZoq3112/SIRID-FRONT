import React, { useState, useRef } from "react";
import { FaBars } from "react-icons/fa";
import { AiOutlineUser, AiOutlineHome } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";

import LogoutButton from "../LogoutButton";

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminSidebar = ({ children }) => {


  //Esto es para abrir y cerrar el sidebar
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const toast = useRef(null);

  const show = () => {
    toast.current.show({
      severity: "success",
      summary: "Form Submitted",
      detail: formik.values.value,
    });
  };

  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validate: (data) => {
      let errors = {};
      if (!data.value) {
        errors.value = "El titulo es obligatorio.";
      }
      return errors;
    },
    onSubmit: (data) => {
      data && show(data);
      formik.resetForm();
    },
  });

  //Son los items del sisebar
  const menuItem = [
    {
      path: "/Componentes",
      name: "Componentes",
      icon: <AiOutlineHome />,
    },

    {
      className: "chat",
      path: "/ChatAdmin",
      name: "Chat",
      icon: <BsFillChatLeftDotsFill />,
    },
    {
      path: "/Users",
      name: "Usuarios",
      icon: <FiUsers />,
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
      <div style={{ width: isOpen ? "250px" : "50px" }} className="sidebars">
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
      <div>
        <></>
      </div>
    </div>
  );
};

export default AdminSidebar;
