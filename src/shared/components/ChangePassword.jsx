import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Row,
  Form,
  FormControl,
  Container,
  Card,
  Figure,
} from "react-bootstrap";
import * as yup from "yup";
import AxiosClient from "./../plugins/axios";
import FeatherIcon from "feather-icons-react";
import Alert, {
  confirmMsg,
  confirmTitle,
  errorMsg,
  errorTitle,
  successMsg,
  successTitle,
} from "./../plugins/alert";
import { AuthContext } from "./../../modules/auth/authContext";
import { Dialog } from "primereact/dialog";

const ChangePassword = ({ setUsuarios, onClose }) => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const form = useFormik({
    initialValues: {
      correo_electronico: user.user.email,
      contrasena: "",
    },
    validationSchema: yup.object().shape({
      contrasena: yup
        .string()
        .required("Campo obligatorio")
        .min(6, "Mínimo 6 caracteres"),
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
              method: "PATCH",
              url: "/user/changePassword/ ",
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

  const handleClose = () => {
    form.resetForm();
    dispatch({ type: "LOGOUT" });
    navigate("/auth", { replace: true });
  };

  const [visible, setVisible] = useState(true);

  return (
    <>
      <section className="h-100 gradient-form text-center">
        <Container className="py-5">
          <Row>
            <Col></Col>
            <Col lg={4} md={6} sm={8} xs={10}>
              <Container className="py-5">
                <Row>
                  <Col>
                    <Card className="rounded-3 text-black text-start h-100">
                      <Card.Body className="p-md-6 mx-md-4">
                        <div className="text-center mb-4">
                          <Figure>
                            <Figure.Image
                              width={200}
                              height={110}
                              alt="f"
                              src="https://firebasestorage.googleapis.com/v0/b/carsibb-eb9b3.appspot.com/o/Logo-utez.png?alt=media&token=221cdb88-ebe3-4b23-afea-97cd193ae8fbtambien"
                            />
                          </Figure>
                        </div>
                        <Form onSubmit={form.handleSubmit}>
                          <Form.Group className="form-outline mb-4">
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
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <FormControl
                              name="contrasena"
                              placeholder="Esta será tu Nueva Contraseña"
                              value={form.values.contrasena}
                              onChange={form.handleChange}
                            />
                            {form.errors.contrasena && (
                              <span className="error-text">
                                {form.errors.contrasena}
                              </span>
                            )}
                          </Form.Group>

                          <Form.Group className="form-outline mb-4">
                            <div className="text-center pt-1 pb-1"></div>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Row>
                              <Col className="text-center">
                                <Button type="submit" variant="outline-success">
                                  <FeatherIcon icon="check" />
                                  &nbsp;Guardar
                                </Button>
                              </Col>
                            </Row>
                          </Form.Group>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </section>

      <Dialog
        header={"Bienvenid@ " + user.user.user.name + " "+ user.user.user.primerApellido}
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <p className="m-0">
        ¡Hola! Bienvenido(a) al Sistema de Reportes de Incidencias Para Docentes (SIRID). 
        Parece que es tu primer inicio de sesión en nuestro sistema 
        o se ha restablecido tu contraseña. Por seguridad, 
        te pedimos amablemente que cambies tu contraseña. 
        Nuestro sistema no te permitirá realizar ninguna acción hasta que lo hagas. 
        Una vez echo lo anteriro ya podras iniciar sesion con tu contraseña nueva.
          </p>
      </Dialog>
    </>
  );
};

export default ChangePassword;
