import { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import AxiosClient from "./../../shared/plugins/axios";
import { AuthContext } from "../../modules/auth/authContext";
import FeatherIcon from "feather-icons-react";
import * as yup from "yup";
import { Card, Container, Figure, Row, Col, Form } from "react-bootstrap";
import Alert from "./../../shared/plugins/alert";
import { Button } from "primereact/button";

export const LoginScreen = () => {
  const navigation = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().required("Campo obligatorio"),
      password: yup.string().required("Campo obligatorio"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await AxiosClient({
          url: "/auth/login",
          method: "POST",
          data: JSON.stringify(values),
        });
        if (!response.error) {
          const action = {
            type: "LOGIN",
            payload: response.data,
          };
          dispatch(action);
          navigation("/Perfil", { replace: true });
        } else {
          throw Error();
        }
      } catch (err) {
        Alert.fire({
          title: "Verificar datos",
          text: "Usuario y/o contraseña incorrectos",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
        });
      }
    },
  });

  useEffect(() => {
    document.title = "SIRID";
  }, []);

  if (user.isLogged) {
    return <Navigate to={"/Perfil"} />;
  }

  return (
    <>
      <section className="h-100 gradient-form text-center">
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
                        alt=""
                        src="https://firebasestorage.googleapis.com/v0/b/carsibb-eb9b3.appspot.com/o/Logo-utez.png?alt=media&token=221cdb88-ebe3-4b23-afea-97cd193ae8fbtambien"
                      />
                    </Figure>
                  </div>
                  <Form onSubmit={formik.handleSubmit}>
                    <Form.Group className="form-outline mb-4">
                      <Form.Label htmlFor="email">
                        Correo Electrónico
                      </Form.Label>
                      <Form.Control
                        placeholder="alandominguez@utez.edu.mx"
                        id="email"
                        autoComplete="off"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.email ? (
                        <span className="error-text">
                          {formik.errors.email}
                        </span>
                      ) : null}
                    </Form.Group>
                    <Form.Group className="form-outline mb-4">
                      <Form.Label htmlFor="password">Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="*********"
                        id="password"
                        autoComplete="off"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.password ? (
                        <span className="error-text">
                          {formik.errors.password}
                        </span>
                      ) : null}
                    </Form.Group>
                    <Form.Group className="form-outline mb-4">
                      <div className="text-center pt-1 pb-1">
                        <a href="ForgotPassword" className="text-muted">
                          ¿Has olvidado tu contraseña?
                        </a>
                      </div>
                    </Form.Group>
                    <Form.Group className="form-outline mb-4">
                      <div className="text-center pt-1 pb-1">
                        <Button
                          variant="primary"
                          className="btn-hover btn-primario gradient-custom-2"
                          type="submit"
                          disabled={!(formik.isValid && formik.dirty)}
                          style={{ backgroundColor: "#009475" }}
                        >
                          <FeatherIcon icon={"log-in"} />
                          &nbsp; Iniciar sesión
                        </Button>
                      </div>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={8} xs={10}></Col>
            <Col></Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default LoginScreen;
