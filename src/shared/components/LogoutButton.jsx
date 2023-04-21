import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../modules/auth/authContext";
import { BiLogOut } from "react-icons/bi";

const LogoutButton = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/auth", { replace: true });
  };
  return (
    <>
      <Button
        variant="outline"
        style={{
          position: "fixed",
          bottom: "10px",
          left: "1px",
          backgroundColor: "#002e6",
        }}
        onClick={handleShow}
      >
        <BiLogOut
          style={{
            fontSize: '25px',
            transition: "color 0.3s ease",
          }}
          className="hoverable"
          title="Cerrar sesión"
        />
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar cierre de sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas cerrar sesión?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LogoutButton;
