import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import AxiosClient from "../../../../shared/plugins/axios";
import { useEffect } from "react";

export default function Grafics() {
  let dataGraphic = {
    labels: [],
    all: [],
    pending: [],
    done: [],
    processing: [],
  };

  const [data, setData] = useState(null);


  const dateFormat = (date_start) => {
    const fecha = new Date(date_start);
    const dia = fecha.getUTCDate();
    const mes = fecha.getUTCMonth() + 1;
    const anio = fecha.getUTCFullYear();
    const fechaFormateada = `${dia < 10 ? '0' + dia : dia}-${mes < 10 ? '0' + mes : mes
      }-${anio}`;
    return fechaFormateada;
  };


  console.log(dateFormat(new Date()))


  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
    },
    validationSchema: yup.object().shape({
      startDate: yup.date().required("La fecha inicio es obligatoria"),
      endDate: yup
        .date()
        .required("La fecha fin es obligatoria")
        .min(
          yup.ref("startDate"),
          "La fecha fin debe ser después de la fecha inicio"
        ),
    }),
    onSubmit: async (values) => {},
  });

  const getCountIncidentsByAreas = async () => {
    const data = await AxiosClient({
      url: "/incidence/graphics/2023-04-25/2023-04-27",
    });

    if (!data.error) {
      console.log(data.data);
      for (let index = 0; index < data.data.length; index++) {
        const [numAll , areaAll] = data.data[index];
        console.log(numAll, areaAll)
        dataGraphic.labels.push(areaAll);
        dataGraphic.all.push(numAll);
        
      }

  
      for (let index = 0; index < dataGraphic.labels.length; index++) {
        const element = dataGraphic.labels[index];

        let data = await AxiosClient({
          url: `/incidence/graphics/1/${element}/2023-04-25/2023-04-27`,
        });
    
        if (!data.error) dataGraphic.pending.push(data.data[0][0]);

        data = await AxiosClient({
          url: `/incidence/graphics/2/${element}/2023-04-25/2023-04-27`,
        });
    
        if (!data.error) dataGraphic.processing.push(data.data[0][0]);


        data = await AxiosClient({
          url: `/incidence/graphics/3/${element}/2023-04-25/2023-04-27`,
        });
    
        if (!data.error) dataGraphic.done.push(data.data[0][0]);
        
      }




    }

    setData({
      labels: dataGraphic.labels,
      datasets: [
        {
          label: "Todos",
          backgroundColor: "#183462",
          borderColor: "#183462",
          hoverBorderColor: "black",
          hoverBackgroundColor: "#002E60BB",
          borderWidth: 1,
          data: dataGraphic.all,
        },
        {
          label: "En curso",
          backgroundColor: "#3b82f6",
          borderColor: "#3b82f6",
          hoverBorderColor: "black",
          hoverBackgroundColor: "#002E60BB",
          borderWidth: 1,
          data: dataGraphic.processing,
        },
        {
          label: "Concluidas",
          backgroundColor: "#0D8E66",
          borderColor: "#0D8E66",
          hoverBorderColor: "black",
          hoverBackgroundColor: "#0D8E66aa",
          borderWidth: 1,
          data: dataGraphic.done,
        },
        {
          label: "Pendientes",
          backgroundColor: "#aaa",
          borderColor: "#aaa",
          hoverBorderColor: "black",
          hoverBackgroundColor: "#aaaaa",
          borderWidth: 1,
          data: dataGraphic.pending,
        },
      ],
    });
  };



useEffect(() => {
  getCountIncidentsByAreas();

}, [])

 

  return (
    <Container>
      <Row>
        <Col xs={12} sm={12}>
          {/* Informacion del perfil */}
          <Card>
            <Card.Header>Graficas Belicas</Card.Header>
            <Card.Body>
              <Container>
                <Row>
                  <Col>
                    <form
                      onSubmit={formik.handleSubmit}
                      className="border-0 pt-1"
                    >
                      <Row>
                        <Col md={5}>
                          <Form.Label className="textForm">
                            Fecha inicio
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="startDate"
                            id="startDate"
                            className={`border border-primary`}
                            onChange={formik.handleChange}
                            value={formik.values.startDate}
                          />
                          {formik.errors.startDate && (
                            <span className="text-primary">
                              {formik.errors.startDate}
                            </span>
                          )}
                        </Col>
                        <Col md={5}>
                          <Form.Label className="textForm ">
                            Fecha fin
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="endDate"
                            id="endDate"
                            className={`border border-primary`}
                            onChange={formik.handleChange}
                            value={formik.values.endDate}
                          />
                          {formik.errors.endDate && (
                            <span className="text-primary">
                              {formik.errors.endDate}
                            </span>
                          )}
                        </Col>
                        <Col className="d-flex align-items-center">
                          <div className="mt-2">
                            <Button
                              type="submit"
                              className="mt-3"
                              disabled={!(formik.isValid && formik.dirty)}
                            >
                              Cargar &nbsp;
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </form>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <div className="py-2 mt-3">
                      {!!data && (
                        <Bar
                          data={data}
                          options={{
                            responsive: true,
                            maintainAspectRatio: true,
                          }}
                          style={{ maxHeight: "300px" }}
                        />
                      )}
                    </div>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
