import { useContext, useEffect} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import AxiosClient from './../../shared/plugins/axios';
import { AuthContext } from '../../modules/auth/authContext';
import FeatherIcon from 'feather-icons-react';
import * as yup from 'yup';
import { Card, Container, Figure, Row, Col, Form, Button } from 'react-bootstrap';
import Alert from './../../shared/plugins/alert';



export const LoginScreen = () => {
  const navigation = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object().shape({
      email: yup.string().required('Campo obligatorio'),
      password: yup.string().required('Campo obligatorio'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await AxiosClient({
          url: '/auth/login',
          method: 'POST',
          data: JSON.stringify(values),
        });
        if (!response.error) {
          const action = {
            type: 'LOGIN',
            payload: response.data,
          };
          dispatch(action);
          navigation('/Perfil', { replace: true });
        }else{
          throw Error()
        }
      } catch (err) {
        Alert.fire({
          title: 'Verificar datos',
          text: 'Usuario y/o contraseña incorrectos',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        });
      }
    },
  });

  useEffect(() => {
    document.title = 'SIRID';
  }, []);

  if (user.isLogged) {
    return <Navigate to={'/Perfil'} />;
  }

  return (
    <>
    <section className="h-100 gradient-form">
      <Container className="py-5 h-100">
        <Row
          className="d-flex justify-content-center
          align-items-center h-100"
        >
          <Col className="col-xl-10">
            <Card className="rounded-3 text-black">
              <Row className="g-0">
                <Col className="col-lg-6">
                  <Card.Body className="p-md-5 mx-md-4">
                    <div className="text-center">
                    
                      <Figure>
                        <Figure.Image
                          width={200}
                          height={110}
                          alt="f"
                          src="https://firebasestorage.googleapis.com/v0/b/carsibb-eb9b3.appspot.com/o/Logo-utez.png?alt=media&token=221cdb88-ebe3-4b23-afea-97cd193ae8fbtambien"
                        />
                      </Figure>
                      
                    </div>
                    <Form onSubmit={formik.handleSubmit}>
                      <Form.Group className="form-outline mb-4">
                        <Form.Label htmlFor="email">
                          Correo Electronico
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
                          type='password'
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
                        <div className="text-end pt-1 pb-1">
                          <a href="#!" className="text-muted">
                            ¿Has olvidado tu contraseña?
                          </a>
                        </div>
                      </Form.Group>
                      <Form.Group className="form-outline mb-4">
                        <div className="text-center pt-1 pb-1">
                          <Button
                            variant="primary"
                            className="btn-hover gradient-custom-2"
                            type="submit"
                            disabled={!(formik.isValid && formik.dirty)}
                          >
                            <FeatherIcon icon={'log-in'} />
                            &nbsp; Iniciar sesión
                          </Button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Card.Body>
                </Col>
                <Col
                  className="col-lg-6 d-flex 
                  align-items-center gradient-custom-2"
                >
                  <div className="text-white px-3 p-md-5 mx-md-4">
                    <h4 className="mb-4">SIRID</h4>
                    <p className="small mb-0">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Nostrum quisquam dicta asperiores aliquid. Quisquam,
                      quae magni? Neque tenetur, odio officia, repudiandae
                      earum nemo, quia nam voluptatibus debitis excepturi sunt
                      illo?
                    </p>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  </>
  )
}

export default LoginScreen