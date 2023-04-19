import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  Button,
  Col,
  Row,
  Form,
  Modal,
  FormControl,
  Container,
  Toast,
} from "react-bootstrap";
import AxiosClient from "./../../../../shared/plugins/axios";
import FeatherIcon from "feather-icons-react";
import Alert, {
  confirmMsg,
  confirmTitle,
  errorMsg,
  errorTitle,
  successMsg,
  successTitle,
} from "./../../../../shared/plugins/alert";

export const FinalizarIncidencia = ({
  isOpen,
  setIncidencias,
  onClose,
  incidencias,
}) => {
  const [salones, setSalones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [estados, setEstados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //Obtener Salones
  const getSalones = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({
        url: "/classroom/",
      });

      if (!data.error) setSalones(data.data);
    } catch (error) {
      //alerta de erro
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSalones();
  }, []);

  //Obtener los status de la incidencia
  const getStatus = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({
        url: "/status/",
      });

      if (!data.error) setEstados(data.data);
    } catch (error) {
      //alerta de erro
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStatus();
  }, []);

  //Obtener los usuarios
  const getUsuarios = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({
        url: "/user/",
      });

      if (!data.error) setUsuarios(data.data);
    } catch (error) {
      //alerta de erro
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsuarios();
  }, []);

  const form = useFormik({
    initialValues: {
      id: 0,
      title: "",
      description: "",
      status: {
        id: 0,
        name: "",
      },
      created_at: "",
      last_modify: "",
      finish_at: "",
      classroom: {
        id: 0,
        name: "",
      },
      docente: {
        id: 0,
        name: "",
      },
      personalSoporte: {
        id: 0,
        name: "",
      },
    },
    onSubmit: async (values) => {
      Alert.fire({
        title: confirmTitle,
        text: confirmMsg,
        icon: "warning",
        confirmButtonColor: "#009574",
        confirmButtonText: "Aceptar",
        cancelButtonColor: "#DD6B55",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        backdrop: true,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Alert.isLoading,
        preConfirm: async () => {
          try {
            const response = await AxiosClient({
              method: "PATCH",
              url: "/incidence/finalizeIncident/",
              data: JSON.stringify(values),
            });
            if (!response.error) {
              setIncidencias((incidencias) => [
                response.data,
                ...incidencias.filter(
                  (salon) => salon.id !== values.id,
                  (usuario) => usuario.id !== values.id
                ),
              ]);
              Alert.fire({
                title: successTitle,
                text: successMsg,
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Aceptar",
              }).then((result) => {
                if (result.isConfirmed) {
                  handleClose();
                }
              });
            }
            return response;
          } catch (error) {
            Alert.fire({
              title: errorTitle,
              text: errorMsg,
              icon: "error",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Aceptar",
            }).then((result) => {
              if (result.isConfirmed) {
                handleClose();
              }
            });
          }
        },
      });
    },
  });

  React.useMemo(() => {
    const {
      title,
      description,
      status,
      docente,
      classroom,
      personalSoporte,
      id,
      created_at,
      last_modify,
      finish_at,
    } = incidencias;
    form.values.id = id;
    form.values.title = title;
    form.values.status = status;
    form.values.description = description;
    form.values.classroom = classroom;
    form.values.docente = docente;
    form.values.personalSoporte = personalSoporte;
    form.values.created_at = created_at;
    form.values.last_modify = last_modify;
    form.values.finish_at = finish_at;
  }, [incidencias]);

  const handleClose = () => {
    form.resetForm();
    onClose();
  };

  return (
    <Modal
      size="lg"
      backdrop="static"
      keyboard={false}
      show={isOpen}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Finalizar Incidencias</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
        <Form onSubmit={form.handleSubmit}>
        <Toast>
                    <Toast.Header>
                      <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                      />
                      <strong className="me-auto">SIRID</strong>
                      <small>Tomar en cuenta</small>
                    </Toast.Header>
                    <Toast.Body>
                     La incidencia solo puede ser finalizada si su status está como Activo
                    </Toast.Body>
                  </Toast>
          <Container>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <FormControl
                    disabled
                    name="title"
                    placeholder="Titulo"
                    value={form.values.title}
                    onChange={form.handleChange}
                    hidden
                  />
                  {form.errors.title && (
                    <span classname="error-text">{form.errors.title}</span>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Control
                    hidden
                    disabled
                    as="select"
                    name="status.id"
                    value={form.values.status.id}
                    onChange={form.handleChange}
                  >
                    <option>{estados.status?.name}</option>
                    {estados.map((estado) => (
                      <option
                        key={estado.id}
                        value={estado.id}
                        onChange={form.handleChange}
                      >
                        {estado.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Control
                    hidden
                    disabled
                    as="select"
                    name="classroom.id"
                    value={form.values.classroom.id}
                    onChange={form.handleChange}
                  >
                    <option>{usuarios.classroom?.name}</option>
                    {salones.map((salon) => (
                      <option
                        key={salon.id}
                        value={salon.id}
                        onChange={form.handleChange}
                      >
                        {salon.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Container>

          <Form.Group className="mb-3">
            <FormControl
              hidden
              disabled
              as="textarea"
              name="description"
              placeholder="Descripccion"
              value={form.values.description}
              onChange={form.handleChange}
            />
            {form.errors.description && (
              <span className="error-text">{form.errors.description}</span>
            )}
          </Form.Group>

          <Container>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <FormControl
                    hidden
                    disabled
                    name="created_at"
                    placeholder="Fecha de Creaccion"
                    value={form.values.created_at}
                    onChange={form.handleChange}
                  />
                  {form.errors.created_at && (
                    <span className="error-text">{form.errors.created_at}</span>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <FormControl
                    hidden
                    disabled
                    name="last_modify"
                    placeholder="Fecha de Creaccion"
                    value={form.values.last_modify}
                    onChange={form.handleChange}
                  />
                  {form.errors.last_modify && (
                    <span className="error-text">
                      {form.errors.last_modify}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <FormControl
                    hidden
                    disabled
                    name="finish_at"
                    placeholder="Fecha de Finalización"
                    value={form.values.finish_at}
                    onChange={form.handleChange}
                  />
                  {form.errors.finish_at && (
                    <span className="error-text">
                      {form.errors.last_modify}
                    </span>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Container>

          <Container>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Control
                    hidden
                    disabled
                    as="select"
                    name="docente.id"
                    value={form.values.docente.id}
                    onChange={form.handleChange}
                  >
                    <option>{usuarios.docente?.name}</option>
                    {usuarios.map((usuario) => (
                      <option
                        key={usuario.id}
                        value={usuario.id}
                        onChange={form.handleChange}
                      >
                        {usuario.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Control
                    hidden
                    disabled
                    as="select"
                    name="docente.id"
                    value={form.values.docente.id}
                    onChange={form.handleChange}
                  >
                    <option>{usuarios.docente?.primerApellido}</option>
                    {usuarios.map((usuario) => (
                      <option
                        key={usuario.id}
                        value={usuario.id}
                        onChange={form.handleChange}
                      >
                        {usuario.primerApellido}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Control
                    hidden
                    disabled
                    as="select"
                    name="docente.id"
                    value={form.values.docente.id}
                    onChange={form.handleChange}
                  >
                    <option>{usuarios.docente?.segundoApellido}</option>
                    {usuarios.map((usuario) => (
                      <option
                        key={usuario.id}
                        value={usuario.id}
                        onChange={form.handleChange}
                      >
                        {usuario.segundoApellido}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Control
                    hidden
                    disabled
                    as="select"
                    name="docente.id"
                    value={form.values.docente.id}
                    onChange={form.handleChange}
                  >
                    <option>{usuarios.docente?.academicDivision.name}</option>
                    {usuarios.map((usuario) => (
                      <option
                        key={usuario.id}
                        value={usuario.id}
                        onChange={form.handleChange}
                      >
                        {usuario.academicDivision.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Control
                    hidden
                    disabled
                    as="select"
                    name="docente.id"
                    value={form.values.docente.id}
                    onChange={form.handleChange}
                  >
                    <option>{usuarios.docente?.correoElectronico}</option>
                    {usuarios.map((usuario) => (
                      <option
                        key={usuario.id}
                        value={usuario.id}
                        onChange={form.handleChange}
                      >
                        {usuario.correoElectronico}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                 
                  <Col className="text-end">
                    <Button
                      className="me-2"
                      variant="outline-danger"
                      onClick={handleClose}
                    >
                      <FeatherIcon icon="x" />
                      &nbsp;Cerrar
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={
                        form.values.status.name === "Concluido" ||
                        form.values.status.name === "Pendiente"
                          ? true
                          : false
                      }
                    >
                      Finzalizar
                    </Button>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FinalizarIncidencia;
