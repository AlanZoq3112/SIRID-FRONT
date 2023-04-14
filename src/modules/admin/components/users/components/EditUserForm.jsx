import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button, Col, Row, Form, Modal, FormControl } from "react-bootstrap";
import * as yup from "yup";
import AxiosClient from "./../../../../../shared/plugins/axios";
import FeatherIcon from "feather-icons-react";
import Alert, {
  confirmMsg,
  confirmTitle,
  errorMsg,
  errorTitle,
  successMsg,
  successTitle,
} from "./../../../../../shared/plugins/alert";

export const EditUserForm = ({ isOpen, setUsuarios, onClose, usuarios }) => {
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
      correo_electronico: usuarios.correoElectronico,
      contrasena: "",
      status: 1,
      changePassword: 0,
      role: {
        id: 0,
        name: "",
      },
      academicDivision: {
        id: 0,
        name: "",
      },
    },
    validationSchema: yup.object().shape({
      name: yup
        .string()
        .required("Campo obligatorio")
        .min(3, "Mínimo 3 caracteres"),
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
              method: "PUT",
              url: "/user/ ",
              data: JSON.stringify(values),
            });
            if (!response.error) {
              setUsuarios((usuarios) => [
                response.data,
                ...usuarios.filter(
                  (roles) => roles.id !== values.id,
                  (academicDivision) => academicDivision.id !== values.id
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
      name,
      status,
      primerApellido,
      segundoApellido,
      correoElectronico,
      academia,
      role,
      id,
    } = usuarios;
    form.values.id = id;
    form.values.name = name;
    form.values.primer_apellido = primerApellido;
    form.values.segundo_apellido = segundoApellido;
    form.values.correo_electronico = correoElectronico;
    form.values.status = status;
    form.values.role = role;
    form.values.academia = academia;
  }, [usuarios]);

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
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={form.handleSubmit}>
          {/* Nombre */}
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <FormControl
              name="name"
              placeholder="Nombre"
              value={form.values.name}
              onChange={form.handleChange}
            />
            {form.errors.name && (
              <span className="error-text">{form.errors.name}</span>
            )}
          </Form.Group>
          {/* Primer Apellido */}
          <Form.Group className="mb-3">
            <Form.Label>Primer Apellido</Form.Label>
            <FormControl
              name="primer_apellido"
              placeholder="Primer Apellido"
              value={form.values.primer_apellido}
              onChange={form.handleChange}
            />
            {form.errors.primer_apellido && (
              <span className="error-text">{form.errors.primer_apellido}</span>
            )}
          </Form.Group>
          {/* Segundo Apellido */}
          <Form.Group className="mb-3">
            <Form.Label>Segundo Apellido</Form.Label>
            <FormControl
              name="segundo_apellido"
              placeholder="Segundo Apellido"
              value={form.values.segundo_apellido}
              onChange={form.handleChange}
            />
            {form.errors.segundo_apellido && (
              <span className="error-text">{form.errors.segundo_apellido}</span>
            )}
          </Form.Group>
          {/* Correo Electronico */}
          <Form.Group className="mb-3">
            <Form.Label>Correo Electronico</Form.Label>
            <FormControl
              name="correoElectronico"
              placeholder="Correo Electronico"
              value={form.values.correo_electronico}
              onChange={form.handleChange}
              disabled
            />
            {form.errors.correo_electronico && (
              <span className="error-text">
                {form.errors.correo_electronico}
              </span>
            )}
          </Form.Group>

          {/* Contrasenia */}
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <FormControl
              name="contrasena"
              placeholder="Contraseña"
              value={form.values.contrasena}
              onChange={form.handleChange}
            />
            {form.errors.contrasena && (
              <span className="error-text">{form.errors.contrasena}</span>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              as="select"
              name="role.id"
              value={form.values.role}
              onChange={form.handleChange}
            >
              <option>Seleccion de Rol de usuario</option>
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

          <Form.Group className="mb-3">
            <Form.Control
              as="select"
              name="academicDivision.id"
              value={form.values.academia}
              onChange={form.handleChange}
            >
              <option>{usuarios.academicDivision?.name}</option>
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
  );
};

export default EditUserForm;
