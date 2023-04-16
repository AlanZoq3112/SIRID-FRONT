import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AuthContext } from "../../modules/auth/authContext";
import LoginScreen from "../../modules/auth/LoginScreen";


import { Navigate } from 'react-router-dom';

import ChangePassword from "./ChangePassword";
import ForgotPassword from "./ForgotPassword";
import ForgotPasswordLog from "./ForgotPasswordLog";

import AdminSidebar from "./admin/AdminSideba";
import Sidebar from "./docente/Sidebar";
import SoporteSidebar from "./personal_soporte/SoporteSidebar";

//Pantallas profesor
import Perfil from "./../../modules/Docente/components/Perfil";
import IncidenciasScreen from "../../modules/Docente/Incidencias/IncidenciasScreen";

//Pantallas Admin
import Componentes from "./../../modules/admin/components/Componentes";
import Users from "./../../modules/admin/components/users/Users";

//Pantallas de personal de soporte
//import ChatSoporte from "./../../modules/personal_soporte/components/ChatSoporte";

import IncidenciasPendientes from "./../../modules/personal_soporte/components/IncidenciasPendientes";
import ChatSoporte from "../../modules/personal_soporte/components/ChatSoporte";

export const AppRouter = () => {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<LoginScreen />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route
          path="/*"
          element={
            user.isLogged ? (
              <>
                {user.user.user.changePassword === false ? (
                  <Navigate to="/reset-password" replace />
                ) : null}

                {user.user.user.roles.name === "SuperAdmin" ? (
                  <>
                    <AdminSidebar>
                      <Container style={{ marginTop: "20px" }}>
                        <Routes>
                          <Route
                            path="/Componentes"
                            element={<Componentes />}
                          />
                          <Route path="/Users" element={<Users />} />
                          <Route path="/Perfil" element={<Perfil />} />

                          <Route path="/reset-password" element={<ChangePassword />} />

                          <Route path="/CambiarContra" element={<ForgotPasswordLog />} />
                        </Routes>
                      </Container>
                    </AdminSidebar>
                  </>
                ) : null}
                {user.user.user.roles.name === "Docente"? (
                  <>
                    <Sidebar>
                      <Container style={{ marginTop: "20px" }}>
                        <Routes>
                          <Route
                            path="/Incidencias"
                            element={<IncidenciasScreen />}
                          />
                          <Route path="/Perfil" element={<Perfil />} />

                          <Route path="/CambiarContra" element={<ForgotPasswordLog />} />
                          {  <Route
                            path="/reset-password"
                            element={<ChangePassword />}
                          />}

                            <Route path="/CambiarContra" element={<ForgotPasswordLog />} />
                          </Routes>
                        </Container>
                      </Sidebar>
                    </>
                  
                ) : null}
                {user.user.user.roles.name === "Soporte Tecnico" ? (
                  <>
                    <>
                      <SoporteSidebar>
                        <Container style={{ marginTop: "20px" }}>
                          <Routes>
                            <Route
                              path="/IncidenciasPendientes"
                              element={<IncidenciasPendientes />}
                            />
                            <Route
                              path="/ChatGeneral"
                              element={<ChatSoporte />}
                            />
                            <Route path="/Perfil" element={<Perfil />} />
                            <Route path="/reset-password" element={<ChangePassword />} />
                            <Route path="/CambiarContra" element={<ForgotPasswordLog />} />
                          </Routes>
                        </Container>
                      </SoporteSidebar>
                    </>
                  </>
                ) : null}
              </>
            ) : (
              <LoginScreen />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
