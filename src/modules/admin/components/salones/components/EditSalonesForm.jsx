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

export const EditSalonesForm = ({ isOpen, setSalones, onClose, salones }) => {
  const [areas, setAreas] = useState([]);
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //Obtener las areas
  const getAreas = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({
        url: "/area/",
      });
      console.log(data.data);
      if (!data.error) setAreas(data.data);
    } catch (error) {
      //alerta de erro
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAreas();
  }, []);
  //Obtener los tipos de salones
  const getTypes = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({
        url: "/type/",
      });
      console.log(data.data);
      if (!data.error) setTypes(data.data);
    } catch (error) {
      //alerta de erro
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTypes();
  }, []);

  const form = useFormik({
    initialValues: {
      id: 0,
      name: "",
      status: true,
      type: {
        id: 0,
        name: "",
      },
      area: {
        id: 0,
        name: "",
      },
    },
    validationSchema: yup.object().shape({
      name: yup
        .string()
        .required("Campo obligatorio")
        .min(4, "Mínimo 4 caracteres"),
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
              url: "/classroom/ ",
              data: JSON.stringify(values),
            });
            if (!response.error) {
              setSalones((salones) => [
                response.data,
                ...salones.filter(
                  (area) => area.id !== values.id,
                  (type) => type.id !== values.id
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
    const { name, status, area, type, id } = salones;
    console.log(id);
    form.values.id = id;
    form.values.name = name;
    form.values.status = status;
    form.values.type = type;
    form.values.area = area;
  }, [salones]);

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
        <Modal.Title>Editar Salon</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={form.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <FormControl
              name="name"
              placeholder="Playera"
              value={form.values.name}
              onChange={form.handleChange}
            />
            {form.errors.name && (
              <span className="error-text">{form.errors.name}</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              as="select"
              name="area.id"
              value={form.values.area.id}
              onChange={form.handleChange}
            >
              <option>{salones.area?.name}</option>
              {areas.map((area) => (
                <option
                  key={area.id}
                  value={area.id}
                  onChange={form.handleChange}
                >
                  {area.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              as="select"
              name="type.id"
              value={form.values.type.id}
              onChange={form.handleChange}
            >
              <option>{salones.type?.name}</option>
              {types.map((type) => (
                <option
                  key={type.id}
                  value={type.id}
                  onChange={form.handleChange}
                >
                  {type.name}
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

export default EditSalonesForm;
