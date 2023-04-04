import React from 'react'

const IncidenciasForm = () => {
  const handleDescripcionChange = (e) => {
    if (e.target.value.length <= 500) {
      setDescripcion(e.target.value);
    }
  };

  const enviarForm = (event) => {
    event.preventDefault();
    // Validar que todos los campos estén completos antes de enviar el formulario
    if (titulo && selectedEdificio && selectedAula && descripcion) {
      // Enviar los datos del formulario al servidor
      console.log("Formulario de Nueva Incidencia:", {
        titulo,
        selectedEdificio,
        selectedAula,
        descripcion,
      });
      // Reiniciar los campos del formulario después del envío
      setTitulo("");
      setSelectedEdificio("");
      setSelectedAula("");
      setDescripcion("");
    } else {
      // Mostrar un mensaje de error si faltan campos por completar
      alert("Por favor completa todos los campos.");
    }
  };

  //Subir Fotos y videos

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
  return (
    <div>
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
              <Form onSubmit={enviarForm}>
                <Container>
                  <Row>
                    {/*Colocar el tirulo de la incidencia*/}
                    <Col>
                      <FloatingLabel
                        controlId="floatingInputGrid"
                        label="Titulo"
                      >
                        <Form.Control
                          value={titulo}
                          onChange={(e) => setTitulo(e.target.value)}
                          required
                          type="text"
                          maxLength={20}
                        />
                      </FloatingLabel>
                    </Col>
                    {/* Seleccion de Edificio */}
                    <Col>
                      <FloatingLabel
                        controlId="floatingInputGrid"
                        label="Edificio"
                      >
                        <select
                          className="form-select"
                          value={selectedEdificio}
                          onChange={(e) => setSelectedEdificio(e.target.value)}
                        >
                          <option value="">Selecciona un edificio</option>
                          <option value="biblioteca">BLIOTECA</option>
                          <option value="cecadec">CECADEC</option>
                          <option value="ceviset">CEVISET</option>
                          <option value="rectoria">RECTORIÁ</option>
                          <option value="d1">DOCENCIA 1</option>
                          <option value="d2">DOCENCIA 2</option>
                          <option value="d3">DOCENCIA 3</option>
                          <option value="d4">DOCENCIA 4</option>
                          <option value="d5">DOCENCIA 5</option>
                          <option value="cedim">CEDIM</option>
                        </select>
                      </FloatingLabel>
                    </Col>
                    {/* Seleccion de Aula */}
                    <Col>
                      <FloatingLabel controlId="floatingInputGrid" label="Aula">
                        <select
                          className="form-select"
                          value={selectedAula}
                          onChange={(e) => setSelectedAula(e.target.value)}
                          disabled={!selectedEdificio}
                          required
                        >
                          <option value="">Selecciona un aula</option>
                          {selectedEdificio === "biblioteca" && (
                            <>
                              <option value="B-Sala 1">Sala 1</option>
                              <option value="B-Sala 2">Sala 2</option>
                              <option value="B-Sala 3">Sala 3</option>
                              <option value="B-Baños Damas">Baños Damas</option>
                              <option value="B-Baños Caballeros">
                                Baños Caballeros
                              </option>
                            </>
                          )}

                          {selectedEdificio === "d1" && (
                            <>
                              <option value="D1-auditorio">Auditorio</option>
                              <option value="D1-Baños Damas">
                                Baños Damas
                              </option>
                              <option value="D1-Baños Caballeros">
                                Baños Caballeros
                              </option>
                              <option value="D1-aula 1">Aula 1</option>
                              <option value="D1-aula 2">Aula 2</option>
                              <option value="D1-aula 3">Aula 3</option>
                              <option value="D1-aula 4">Aula 4</option>
                              <option value="D1-aula 5">Aula 5</option>
                              <option value="D1-aula 6">Aula 6</option>
                              <option value="D1-aula 7">Aula 7</option>
                              <option value="D1-aula 8">Aula 8</option>
                              <option value="D1-aula 9">Aula 9</option>
                              <option value="D1-aula 10">Aula 10</option>
                              <option value="D1-aula 11">Aula 11</option>
                              <option value="D1-aula 12">Aula 12</option>
                              <option value="D1-aula 13">Aula 13</option>
                              <option value="D1-aula 14">Aula 14</option>
                              <option value="D1-aula 15">Aula 15</option>
                              <option value="D1-aula 16">Aula 16</option>
                              <option value="D1-aula 17">Aula 17</option>
                              <option value="D1-aula 18">Aula 18</option>
                            </>
                          )}

                          {selectedEdificio === "d2" && (
                            <>
                              <option value="D2-Baños Damas">Baños Damas</option>
                              <option value="D2-Baños Caballeros">
                                Baños Caballeros
                              </option>
                              <option value="D2-CC7">
                                Centro de Computo 7
                              </option>
                              <option value="D2-CC6">
                                Centro de Computo 8
                              </option>
                              <option value="D2-CC3">
                                Centro de Computo 3
                              </option>
                              <option value="D2-auditorio">Auditorio</option>
                            </>
                          )}

                          {selectedEdificio === "d3" && (
                            <>
                            <option value="D3-Baños Damas">Baños Damas</option>
                              <option value="D3-Baños Caballeros">Baños Caballeros</option>
                              <option value="D3-Aula 1">Aula 1</option>
                              <option value="D3-Servico Medico">
                                Servicio Medico
                              </option>
                            </>
                          )}

                          {selectedEdificio === "d4" && (
                            <>
                            <option value="D4-Baños Damas">Baños Damas</option>
                              <option value="D4-Baños Caballeros">Baños Caballeros</option>
                              <option value="D4-CA1">Compu Aula 1</option>
                              <option value="D4-CA2">Compu Aula 2</option>
                              <option value="D4-CA3">Compu Aula 3</option>
                              
                              <option value="D4-CC4">
                                Centro de Computo 4
                              </option>
                              <option value="D4-CC11">
                                Centro de Computo 11
                              </option>
                              <option value="D4-Sala de Comunicaciones">
                                Sala de Comunicaciones
                              </option>
                              <option value="D4-Sala Auditorio">
                                Sala Auditorio
                              </option>
                              <option value="D4-Servico Tecnico">
                                Servicio Tecnico
                              </option>
                            </>
                          )}
                          {selectedEdificio === "d5" && (
                            <>
                            <option value="D5-Baños Damas">Baños Damas</option>
                              <option value="D5-Baños Caballeros">Baños Caballeros</option>
                              <option value="D5-Aula 1">Aula 1</option>
                              <option value="D5-Aula 2">Aula 2</option>
                              <option value="D5-Aula 3">Aula 3</option>
                              <option value="D5-Auditorio">Auditorio</option>
                              <option value="D5-Psicologia">
                                Apoyo Psicopedagógico
                              </option>
                            </>
                          )}

                          {selectedEdificio === "cecadec" && (
                            <>
                            <option value="cecadec-Baños Damas">Baños Damas</option>
                              <option value="cecadec-Baños Caballeros">Baños Caballeros</option>
                              <option value="cecadec-CC10">
                                Centro de Computo 10
                              </option>
                              <option value="cecadec-Aula Doble">
                                Aula Doble
                              </option>
                              <option value="cecadec-Aula de Cableado">
                                Aula de Cableado
                              </option>
                            </>
                          )}

                          {selectedEdificio === "ceviset" && (
                            <>
                            <option value="cevoset-Baños Damas">Baños Damas</option>
                              <option value="ceviset-Baños Caballeros">Baños Caballeros</option>
                              <option value="CDS">
                                Centro de Desarrollo de Software
                              </option>
                            </>
                          )}

                          {selectedEdificio === "cedim" && (
                            <>
                            <option value="cedim-Baños Damas">Baños Damas</option>
                              <option value="cedim-Baños Caballeros">Baños Caballeros</option>
                              <option value="cedim-CC1">
                                Centro de Computo 1
                              </option>
                            </>
                          )}
                        </select>
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
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Describe cual es la inicidencia"
                          required
                          value={descripcion}
                          onChange={handleDescripcionChange}
                          maxLength={500}
                        />
                        <span>{contador} de 500</span>
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
                <Button variant="primary" type="submit">
                  Enviar
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
    </div>
  )
}

export default IncidenciasForm
