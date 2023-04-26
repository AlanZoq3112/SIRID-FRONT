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
} from "react-bootstrap";
import * as yup from "yup";
import AxiosClient from "../../../../../shared/plugins/axios";
import FeatherIcon from "feather-icons-react";
import Alert, {
  confirmMsg,
  confirmTitle,
  errorMsg,
  errorTitle,
  successMsg,
  successTitle,
} from "../../../../../shared/plugins/alert";

export const DocenteForm = ({ isOpen, setUsuarios, onClose }) => {
  const [diviciones, setDiviciones] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //Obtener las Diviciones Academicas
  const getDiviciones = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({
        url: "/academic/",
      });

      if (!data.error) setDiviciones(data.data);
    } catch (error) {
      //alerta de erro
 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDiviciones();
  }, []);
  //Obtener los roles
  const getRoles = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({
        url: "/role/",
      });
   
      if (!data.error) setRoles(data.data);
    } catch (error) {
      //alerta de erro
   
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const form = useFormik({
    initialValues: {
      id: 0,
      name: "",
      primer_apellido: "",
      segundo_apellido: "",
      correo_electronico: "",
      contrasena: "",
      status: 1,
      changePassword: 0,
      role: {
        id: 3,
        name: "Docente",
      },
      academicDivision: {
        id: 0,
        name: "",
      },
    },
    validationSchema: yup.object().shape({
      correo_electronico: yup
        .string()
        .email("")
    }),
    onSubmit: async (values) => {
      if (values.role.name === "SuperAdmin") {
        Alert.fire({
          title: "Error",
          text: "No se puede crear un SuperAdmin",
          icon: "error",
        });
        return;
      }
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
              url: "/user/",
              data: JSON.stringify(values),
            });
            if (!response.error) {
              setUsuarios((usuarios) => [response.data, ...usuarios]);
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

  const handleClose = () => {
    form.resetForm();
    onClose();
  };

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isOpen}
      onHide={handleClose}
      size="lg"z
    >
      <Modal.Header closeButton>
        <Modal.Title>Registrar un Nuevo Docente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={form.handleSubmit}>
          <Container>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <FormControl
                    name="name"
                    placeholder="Nombre"
                    value={form.values.name}
                    onChange={(event) => {
                      const value = event.target.value;
                      // Remove extra spaces and limit to 20 characters
                      const newValue = value
                        .replace(/\s{2,}/g, " ")
                        .slice(0, 50);
                      // Remove non-letter and non-space characters
                      const sanitizedValue = newValue.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                      );
                      // Capitalize first letter after a space and make rest of letters lowercase
                      const formattedValue = sanitizedValue
                        .toLowerCase()
                        .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
                      // Update form value
                      form.setFieldValue("name", formattedValue);
                    }}
                    onKeyPress={(event) => {
                      const lastTwoChars = form.values.name.slice(-2);
                      const currentChar = event.key;
                      if (currentChar === " " && lastTwoChars === " ") {
                        event.preventDefault();
                        return;
                      }
                      if (/^\d+$/.test(currentChar)) {
                        event.preventDefault();
                        return;
                      }
                      if (
                        lastTwoChars[0] === currentChar &&
                        lastTwoChars[1] === currentChar
                      ) {
                        event.preventDefault();
                        return;
                      }
                    }}
                    required
                  />

                  {form.errors.name && (
                    <span className="error-text">{form.errors.name}</span>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Primer Apellido</Form.Label>
                  <FormControl
                    required
                    name="primer_apellido"
                    placeholder="Primer Apellido"
                    value={form.values.primer_apellido}
                    maxLength={20}
                    onChange={(event) => {
                      const value = event.target.value;
                      // Remove extra spaces and limit to 20 characters
                      const newValue = value
                        .replace(/\s{2,}/g, " ")
                        .slice(0, 20);
                      // Remove non-letter and non-space characters
                      const sanitizedValue = newValue.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                      );
                      // Capitalize first letter and make rest of letters lowercase
                      const formattedValue =
                        sanitizedValue.charAt(0).toUpperCase() +
                        sanitizedValue.slice(1).toLowerCase();
                      // Update form value
                      form.setFieldValue("primer_apellido", formattedValue);
                    }}
                  />

                  {form.errors.primer_apellido && (
                    <span className="error-text">
                      {form.errors.primer_apellido}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Segundo Apellido</Form.Label>
                  <FormControl
                    required
                    name="segundo_apellido"
                    placeholder="Segundo Apellido"
                    value={form.values.segundo_apellido}
                    maxLength={20}
                    onChange={(e) => {
                      // Eliminar espacios y números de la entrada
                      const inputValue = e.target.value.replace(/[\s0-9]/g, "");
                      // Convertir la primera letra en mayúscula y el resto en minúsculas
                      const formattedInputValue =
                        inputValue.charAt(0).toUpperCase() +
                        inputValue.slice(1).toLowerCase();
                      // No permitir la repetición de la misma letra más de 2 veces seguidas
                      const sanitizedInputValue = formattedInputValue.replace(
                        /(.)\1{2,}/g,
                        "$1$1"
                      );
                      // Truncar la entrada a 20 caracteres
                      const truncatedInputValue = sanitizedInputValue.slice(
                        0,
                        20
                      );
                      // Actualizar el valor del campo en el formulario
                      form.setFieldValue(
                        "segundo_apellido",
                        truncatedInputValue
                      );
                    }}
                  />

                  {form.errors.segundo_apellido && (
                    <span className="error-text">
                      {form.errors.segundo_apellido}
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
                  <Form.Label>Correo Electrónico</Form.Label>
                  <FormControl
                    required
                    name="correo_electronico"
                    placeholder="Correo Electrónico"
                    value={form.values.correo_electronico.replace(/\s/g, "")} // Eliminar espacios en blanco
                    onChange={(e) =>
                      form.setFieldValue(
                        "correo_electronico",
                        e.target.value.replace(/\s/g, "")
                      )
                    }
                  />

                  {form.errors.correo_electronico && (
                    <span className="error-text">
                      {form.errors.correo_electronico}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Division Academica</Form.Label>
                  <Form.Control
                    required
                    as="select"
                    name="academicDivision.id"
                    value={form.values.academicDivision.id}
                    onChange={form.handleChange}
                  >
                    <option>Academia a la que Pertenece</option>
                    {diviciones.map((divicion) => (
                    
                      <option
                        key={divicion.id}
                        value={divicion.id}
                        onChange={form.handleChange}
                      >
                        {divicion.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Rol del Usuario</Form.Label>
                  <Form.Control
                    disabled
                    as="select"
                    name="role.id"
                    value={form.values.role.id}
                    onChange={form.handleChange}
                  >
                    <option>Docente</option>
                    {roles.map((rol) => (
                      <option
                        key={rol.id}
                        value={rol.id}
                        onChange={form.handleChange}
                      >
                        {rol.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Container>

          <Form.Group className="mb-3">
            <Row>
              <Col className="text-end">
                <Button type="submit" variant="outline-success">
                  <FeatherIcon icon="check" />
                  &nbsp;Crear
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
