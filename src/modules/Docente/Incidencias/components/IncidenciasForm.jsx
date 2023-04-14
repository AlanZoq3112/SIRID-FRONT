import React, { useState, useEffect, useContext } from "react";
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

import { AuthContext } from "./../../../auth/authContext";

import { storage } from "../../../../firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { v4 } from "uuid";

export const IncidenciasForm = ({ isOpen, setIncidencias, onClose }) => {
  //Obtemer la informacion del docente
  const { user } = useContext(AuthContext);

  const [salones, setSalones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

 

  //Obtener los Salones
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

  const form = useFormik({
    initialValues: {
      id: 0,
      title: "",
      description: "",
      classroom: {
        id: 0,
      },
      docente: {
        id: user.user.user.id,
      },
    },
    validationSchema: yup.object().shape({
      name: yup.string(),
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
              setIncidencias((incidencias) => [response.data, ...incidencias]);
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
    >
      <Modal.Header closeButton>
        <Modal.Title>Registrar una Nueva Incidencia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={form.handleSubmit}>
          {/* Titulo */}
          <Form.Group className="mb-3">
            <Form.Label>Titulo</Form.Label>
            <FormControl
              name="title"
              placeholder="Titulo"
              value={form.values.title}
              onChange={form.handleChange}
            />
            {form.errors.name && (
              <span className="error-text">{form.errors.title}</span>
            )}
          </Form.Group>

          {/* Seleccion del salon donde fue la incidencia */}
          <Form.Group className="mb-3">
            <Form.Label>Salon</Form.Label>
            <Form.Control
              as="select"
              name="classroom.id"
              value={form.values.classroom.id}
              onChange={form.handleChange}
            >
              <option>Selecciona el Salon donde ocurrió la incidencia</option>
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

          {/* Descrpccion */}
          <Form.Group className="mb-3">
            <Form.Label>Descripccion</Form.Label>
            <FormControl
              name="description"
              placeholder="Descripcción"
              value={form.values.description}
              onChange={form.handleChange}
            />
            {form.errors.description && (
              <span className="error-text">{form.errors.description}</span>
            )}
          </Form.Group>


          {/*Descripccion*/}
          {/* <Form.Group controlId="formDescription">
                        <Form.Label>Descripción:</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Describe cual es la inicidencia"
                          required
                          value={form.values.description}
                          onChange={form.handleChange}
                          maxLength={500}
                        />
                       {
                            form.errors.description &&
                            (<span className='error-text'>
                                {form.errors.description}
                            </span>)
                        }
                      </Form.Group> */}
          <br />

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
