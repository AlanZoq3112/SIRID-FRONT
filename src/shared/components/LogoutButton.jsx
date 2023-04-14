import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../modules/auth/authContext";
import { BiLogOut } from "react-icons/bi";

const LogoutButton = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/auth", { replace: true });
  };
  return (
    <Button
    variant="outline"
      style={{
        position: "fixed",
        bottom: "10px",
        left: "1px",
        backgroundColor: "#002e6",
      }}
      onClick={handleLogout}
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
  );
};

export default LogoutButton;
