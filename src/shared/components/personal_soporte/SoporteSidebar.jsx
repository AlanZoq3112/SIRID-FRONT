import React , { useState, useRef ,useContext}from 'react'
import { AuthContext } from "./../../../modules/auth/authContext";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FaBars } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineUser, AiOutlineHome } from "react-icons/ai";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import { Button } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";



const SoporteSidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);


  const toast = useRef(null);
  //Cerrar sesion
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/auth", { replace: true });
  };
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
  const menuItem = [
  
    {
      path: "/IncidenciasPendientes",
      name: "Incidencias Pendientes",
      icon: <AiOutlineHome />,
    },

    {
      className: "chat",
      path: "/ChatSoporte",
      name: "Chat",
      icon: <BsFillChatLeftDotsFill />,
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
            activeClassname="active"
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
        <Button onClick={handleLogout}>
          <BiLogOut/>
        </Button>
      </div>
      <main>{children}</main>
      <div>
      </div>
      
    </div>
  )
}

export default SoporteSidebar
