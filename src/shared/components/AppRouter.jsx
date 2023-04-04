import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AuthContext } from "../../modules/auth/authContext";
import LoginScreen from "../../modules/auth/LoginScreen";

import AdminSidebar from "./admin/AdminSideba";
import Sidebar from "./docente/Sidebar";
import SoporteSidebar from './personal_soporte/SoporteSidebar';

//Pantallas profesor
import Incidencias from "./../../modules/Docente/components/Incidencias";
import Perfil from "./../../modules/Docente/components/Perfil";
import SolicitudCambios from "./../../modules/Docente/components/cambios/SolicitudCambios";

//Pantallas Admin
import Componentes from "./../../modules/admin/components/Componentes";
import Users from "./../../modules/admin/components/users/Users";

//Pantallas de personal de soporte
//import ChatSoporte from "./../../modules/personal_soporte/components/ChatSoporte";
import AtenderIncidencia from "./../../modules/personal_soporte/components/AtenderIncidencia";
import IncidenciaEnCurso from "./../../modules/personal_soporte/components/IncidenciaEnCurso"
import IncidenciasPendientes from "./../../modules/personal_soporte/components/IncidenciasPendientes"
//import PerfilSoporte from "./../../modules/personal_soporte/components/PerfilSoporte"

export const AppRouter = () => {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<LoginScreen />}/>
        <Route
          path="/*"
          element={
            user.isLogged ? (
              <>
                {user.user.user.roles.name === "SuperAdmin" ? (
                  <>
                    <AdminSidebar>
                    <Container style={{ marginTop: "20px" }}>
                      <Routes>
                        <Route path="/Componentes" element={<Componentes />} />
                        <Route path="/Users" element={<Users />} />
                        <Route path="/Perfil" element={<Perfil/>} />
                      </Routes>
                    </Container>
                    </AdminSidebar>
                  </>
                ) : null}
                {user.user.user.roles.name === "Docente" ? (
                  <>
                    <>
                      <Sidebar>
                      <Container style={{ marginTop: "20px" }}>
                        <Routes>
                          <Route path="/Incidencias" element={<Incidencias />} />
                          <Route path="/Perfil" element={<Perfil/>} />
                          <Route path="/SolicitudCambios" element={<SolicitudCambios/>} />
                        </Routes>
                      </Container>
                      </Sidebar>
                    </>
                  </>
                ) : null}
                {user.user.user.roles.name === "Soporte Tecnico" ? (
                  <>
                    <>
                      <SoporteSidebar>
                      <Container style={{ marginTop: "20px" }}>
                        <Routes>
                          <Route path="/AtenderIncidencia" element={<AtenderIncidencia />} />
                          <Route path="/IncidenciaEnCurso" element={<IncidenciaEnCurso/>} />
                          <Route path="/IncidenciasPendientes" element={<IncidenciasPendientes/>} />
                          <Route path="/Perfil" element={<Perfil/>} />
                        </Routes>
                      </Container>
                      </SoporteSidebar>
                    </>
                  </>
                ) : null}
              </>
            ) : (
              <LoginScreen/>
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
