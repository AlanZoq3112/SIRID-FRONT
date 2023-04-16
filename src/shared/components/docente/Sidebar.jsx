import React, { useState, useRef, useEffect, useContext } from "react";
import { FaClipboardList, FaBars } from "react-icons/fa";
import { AiOutlineUser, AiOutlinePlus } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { Container, Row, Col, FormControl } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useFormik } from "formik";
import { AuthContext } from "./../../../modules/auth/authContext";
import { Button } from "react-bootstrap";
import LogoutButton from "../LogoutButton";

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

//Para las incidencias
import AxiosClient from "./../../plugins/axios";
import Alert, {
  confirmMsg,
  confirmTitle,
  errorMsg,
  errorTitle,
  successMsg,
  successTitle,
} from "./../../plugins/alert";
import * as yup from "yup";
import FeatherIcon from "feather-icons-react";

const Sidebar = ({ children, setIncidencias, onClose }) => {
  //Para subir imagenes

  //Para las Incidencias
  const { user } = useContext(AuthContext);

  const [salones, setSalones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  //Obtener los Salones
  const getSalones = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({
        url: "/classroom/select",
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

  //Obtener las Areas
  const getAreas = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({
        url: "/area/",
      });

      if (!data.error) setAreas(data.data);
    } catch (error) {
      //alerta de erro
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAreas();
  }, []);

  const form = useFormik({
    initialValues: {
      id: 0,
      title: "",
      description: "",
      classroom: {
        id: 0,
        area: {
          id: 0,
          name: "",
        },
      },
      docente: {
        id: user.user.user.id,
      },
    },
    validationSchema: yup.object().shape({
      title: yup.string(),
    }),
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
              method: "POST",
              url: "/incidence/",
              data: JSON.stringify(values),
            });
            if (!response.error) {
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

  //Esto es para abrir y cerrar el sidebar
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  //Para el Modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

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
      path: "/incidencias",
      name: "Incidencias",
      icon: <FaClipboardList />,
    },

    {
      path: "/perfil",
      name: "Perfil",
      icon: <AiOutlineUser />,
    },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit form logic
    form.resetForm();
    handleClose();
  };
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
        <LogoutButton />
      </div>
      <main>{children}</main>
      <div>
        {/* Boton Flotante */}
        <Button
          className="boton-flotante"
          variant="primary"
          onClick={handleShow}
          title="Crear una nueva Incidencia"
        >
          <AiOutlinePlus size={30} />
        </Button>

        <>
          {/* Modal para crear una nueva incidencia */}
          <Modal
            aria-labelledby="example-modal-sizes-title-lg"
            size="lg"
            show={showModal}
            onHide={handleClose}
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-l">
                Nueva Incidencia
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={form.handleSubmit}>
                <Container>
                  <Row>
                    {/*Colocar el tirulo de la incidencia*/}
                    <Col>
                      <FloatingLabel
                        controlId="floatingInputGrid"
                        label="Titulo"
                      >
                        <Form.Control
                          required
                          name="title"
                          placeholder="Titulo"
                          value={form.values.title}
                          onChange={(event) => {
                            const value = event.target.value;
                            // Remove extra spaces
                            const newValue = value.replace(/ +(?= )/g, "");
                            // Truncate to 50 characters
                            const truncatedValue = newValue.slice(0, 50);
                            // Update form value
                            form.setFieldValue("title", truncatedValue);
                          }}
                        />
                      </FloatingLabel>
                    </Col>

                    <Col>
                      <FloatingLabel
                        controlId="floatingInputGrid"
                        label="Lugar de la Incidencia"
                      >
                        <Form.Control
                          required
                          as="select"
                          name="classroom.id"
                          value={form.values.classroom.id}
                          onChange={form.handleChange}
                        >
                          <option>
                            Selecciona el Salon donde ocurrió la incidencia
                          </option>
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
                      </FloatingLabel>
                    </Col>
                  </Row>
                </Container>
                <br />
                <Container>
                  <Row>
                    {/* Descripcion de la incidencia */}
                    <Col>
                      <Form.Group controlId="formDescription">
                        <Form.Label>Descripción:</Form.Label>
                        <FormControl
                          required
                          name="description"
                          as="textarea"
                          value={form.values.description}
                          onChange={(event) => {
                            const value = event.target.value;
                            // Remove extra spaces
                            const newValue = value.replace(/ +(?= )/g, "");
                            // Truncate to 500 characters
                            const truncatedValue = newValue.slice(0, 500);
                            // Update form value
                            form.setFieldValue("description", truncatedValue);
                          }}
                          style={{ height: "100px" }}
                          maxLength={500}
                        />
                        {form.values.description.length <= 500 ? (
                          <div className="text-right">
                            {500 - form.values.description.length} caracteres
                            restantes
                          </div>
                        ) : (
                          <div className="error-text text-right">
                            {form.values.description.length - 500} caracteres de
                            más
                          </div>
                        )}
                        {form.errors.description && (
                          <span className="error-text">
                            {form.errors.description}
                          </span>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Container>
                <Container>
                  <Row>
                    <Col></Col>
                    <Col></Col>
                  </Row>
                </Container>
                <br />

                {/* Boton de envio del Formulario */}
                <Form.Group className="mb-3">
                  <Row>
                    <Col className="text-end">
                      <Button
                        className="me-2"
                        variant="outline-danger"
                        onClick={handleClose}
                      >
                        <FeatherIcon icon="x" />
                        &nbsp;Cerrar
                      </Button>
                      <Button type="submit" variant="outline-success">
                        <FeatherIcon icon="check" />
                        &nbsp;Guardar
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      </div>
    </div>
  );
};

export default Sidebar;
