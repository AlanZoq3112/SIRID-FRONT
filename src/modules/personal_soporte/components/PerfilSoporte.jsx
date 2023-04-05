import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Container, Row, Col } from "react-bootstrap";
import Avatar from "react-avatar";
import Card from "react-bootstrap/Card";
import { Modal, Button, Alert } from "react-bootstrap";
import { Link  } from 'react-router-dom';

const PerfilSoporte = () => {
    //Solicitar cambios
  const [showChanges, setShowChanges] = useState(false);
  

  //Aqui se controlara lo del reestablecim iento de la contraseña
  //Esta es la alerta de confirmacion de que si se hizo la accion de reestablecimiento
  const [showAlert, setShowAlert] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleCloseConfirm = () => setShowConfirm(false);
  const handleShowConfirm = () => setShowConfirm(true);

  const handleConfirmAction = () => {
    console.log("Se ha solicitado el cambio de contraseña!");
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
        Solicitud de Cambio de Contraseña realizada con exito
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
                <Col xs={12} md={2}>
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
                        <InputText
                          disabled
                          placeholder="Lisseth Georgina"
                        />
                      </Col>
                      <Col>
                        <p>Primer Apellido:</p>
                        <InputText disabled placeholder="Fuentes" />
                      </Col>
                      <Col>
                        <p>Segundo Apellido:</p>
                        <InputText disabled placeholder="Figueroa" />
                      </Col>
                    </Row>
                  </Container>
                  <br />
                  {/* Datos personales */}
                  <Container>
                    <Row>
                      <Col>
                        <p>E-mail:</p>
                        <InputText
                          disabled
                          placeholder="20213tn014@utez.edu.mx"
                        />
                      </Col>
                      <Col>
                        <p>Contraseña:</p>
                        <InputText disabled placeholder="lissfigueroa0101" />
                      </Col>
                      <Col>
                        <p>Telefono:</p>
                        <InputText disabled placeholder="777-168-0188" />
                      </Col>
                    </Row>
                  </Container>
                  <br />
                  <Container>
                    <Row>
                      <Col>
                        <p>Divicion Academica:</p>
                        <InputText disabled placeholder="DATID" />
                      </Col>
                      <Col>
                        <p>ㅤ</p>
                        <Button
                          onClick={setShowChanges}
                          className="cambiodatos"
                          size="lg"
                        >
                          Solictar Cambiosㅤ
                        </Button>{" "}
                      </Col>
                      <Col>
                        <p>ㅤ</p>
                        <Button
                          onClick={handleShowConfirm}
                          className="cambiodatos"
                          size="lg"
                        >
                          Cambiar Contraseña
                        </Button>{" "}
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    {/*Solicitar cambios */}
    <Modal show={showChanges} onHide={() => setShowChanges(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Solicitus de cambios</Modal.Title>
      </Modal.Header>

      <Modal.Body>
      ¿Estás seguro de solicitar un cambio de datos??
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={() => setShowChanges(false)}>
          Cancelar
        </Button>
        <Link to="/SolicituCambios">
    <Button variant="primary">Confirmar</Button>
  </Link>
      </Modal.Footer>
    </Modal>

    {/* Solicitar cambio de contrasenia */}
    <Modal show={showConfirm} onHide={handleCloseConfirm}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmación de acción</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de solicitar un cambio de Contraseña?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleCloseConfirm}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleConfirmAction}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>

   
  </Container>
  )
}

export default PerfilSoporte
