import React, { useState, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Container, Row, Col } from "react-bootstrap";
import Avatar from "react-avatar";
import Card from "react-bootstrap/Card";
import {  Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../auth/authContext";

const Perfil = (props) => {
  const { user } = useContext(AuthContext);

  //Solicitar cambios
  const [showChanges, setShowChanges] = useState(false);


  //Aqui se controlara lo del reestablecim iento de la contraseña
  //Esta es la alerta de confirmacion de que si se hizo la accion de reestablecimiento
  const [showAlert, setShowAlert] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleCloseConfirm = () => setShowConfirm(false);
 

  const handleConfirmAction = () => {
    setShowAlert(true);
    handleCloseConfirm();
  };
  const handleAlertDismiss = () => {
    setShowAlert(false);
  };

  return (
    <Container>
      {showAlert && (
        <Alert variant="success" onClose={handleAlertDismiss} dismissible>
          Solicitud de Cambio de Contraseña realizada con éxito
        </Alert>
      )}
      <Row>
        <Col xs={12} sm={12}>
          {/* Informacion del perfil */}
          <Card>
            <Card.Header>Perfil de Usuario</Card.Header>
            <Card.Body>
              <Container fluid>
                <Row>
                  {/* Imagen de perfil */}
                  <Col className="text-center pt-1 pb-1" xs={12} md={2}>
                    <Avatar
                      className="avatar"
                      src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"
                      size={150}
                      round="100px"
                    />
                  </Col>
                  <Col xs={12} md={10}>
                    {/* Datos personales */}
                    <Container>
                      <Row>
                        <Col>
                          <p>Nombre(s):</p>
                          <InputText disabled value={user.user.user.name} />
                        </Col>
                        <Col>
                          <p>Primer Apellido:</p>
                          <InputText
                            disabled
                            value={user.user.user.primerApellido}
                          />
                        </Col>
                        <Col>
                          <p>Segundo Apellido:</p>
                          <InputText
                            disabled
                            placeholder={user.user.user.segundoApellido}
                          />
                        </Col>
                      </Row>
                    </Container>
                    <br />
                    {/* Datos personales */}
                    <Container>
                      <Row>
                        <Col>
                          <p>E-mail:</p>
                          <InputText disabled placeholder={user.user.email} />
                        </Col>
                        <Col>
                          <p>División Académica:</p>
                          <InputText
                            disabled
                            placeholder={user.user.user.academicDivision.name}
                          />
                        </Col>
                        <Col>
                          <p>Rol de Usuario:</p>
                          <InputText
                            disabled
                            placeholder={user.user.user.roles.name}
                          />
                        </Col>
                      </Row>
                    </Container>
                    <br />
                   
                      <Row>
                      
                        
                        <Col className="text-center">
                          
                        </Col>
                        
                        <Col className="text-center">
                        <Col className="text-center">
                        <Link to="/CambiarContra">
                          <Button
                            className="cambiodatos"
                            size="lg"
                          >
                            Cambiar Contraseña
                          </Button>
                          </Link>
                        </Col>
                        </Col>
                      </Row>
                    
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Perfil;
