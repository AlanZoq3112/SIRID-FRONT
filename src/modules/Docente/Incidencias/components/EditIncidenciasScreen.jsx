import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button, Col, Row, Form, Modal, FormControl } from "react-bootstrap";
import * as yup from "yup";
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

export const EditIncidenciasScreen = ({ isOpen, setIncidencias, onClose, incidencias }) => {
  const [salones, setSalones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //Obtener los salones
  const getSalones = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({
        url: "/classroom/",
      });
      console.log("Salones",data.data.name)
      if (!data.error) setSalones(data.data);
    } catch (error) {
      //alerta de erro
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSalones();
  }, []);


  const form = useFormik({
    initialValues: {
      id: 0,
      title: '',
      description: '',
      created_at: '',
      classroom: {
          id: 0,
          name: ''
      },
      docente: {
          id: 0,
          name: ''
      }
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
              url: "/incidence/ ",
              data: JSON.stringify(values),
            });
            if (!response.error) {
              setIncidencias((incidencias) => [
                response.data,
                ...incidencias.filter(
                  (salones) => salones.id !== values.id
                  
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
      classroom,
      id,
      created_at,
    } = incidencias;
    form.values.id = id;
    form.values.title = title;
    form.values.description = description;
    form.values.created_at = created_at
    form.values.classroom.name = classroom;
  }, [incidencias]);

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
        <Modal.Title>Datos de la incidencia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={form.handleSubmit}>
          {/* Nombre */}
          <Form.Group className="mb-3">
            <Form.Label>Titulo</Form.Label>
            <FormControl
            disabled
              name="title"
              placeholder="Titulo"
              value={form.values.title}
              onChange={form.handleChange}
            />
            {form.errors.title && (
              <span className="error-text">{form.errors.title}</span>
            )}
          </Form.Group>
          {/* Primer Apellido */}
          <Form.Group className="mb-3">
            <Form.Label>Descripccion</Form.Label>
            <FormControl
            disabled
              name="description"
              placeholder="Descripccion"
              value={form.values.description}
              onChange={form.handleChange}
            />
            {form.errors.description && (
              <span className="error-text">{form.errors.description}</span>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de Creacion</Form.Label>
            <FormControl
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

          <Form.Group className="mb-3">
            <Form.Label>Salon</Form.Label>
            <FormControl
              name="classromm"
              placeholder="Salon"
              value={form.values.classroom}
              onChange={form.handleChange}
            />
            {form.errors.classroom && (
              <span className="error-text">{form.errors.classroom}</span>
            )}
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

export default EditIncidenciasScreen;
