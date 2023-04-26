import React, { useEffect, useState, useContext } from "react";
import { Card, Col, Row, Toast, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../../shared/plugins/axios";
import { ButtonCircle } from "./../../../shared/components/ButtonCircle";
import { Loading } from "./../../../shared/components/Loading";
import { FilterComponent } from "./../../../shared/components/FilterComponent";
import { EditIncidenciasScreen } from "./components/EditIncidenciasScreen";
import { AiOutlineInfoCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { BsAlarm } from "react-icons/bs";
import { TabView, TabPanel } from "primereact/tabview";
import { AuthContext } from "./../../auth/authContext";
import { AiOutlineAlert } from 'react-icons/ai';
const options = {
  rowsPerPageText: "Registros por página",
  rangeSeparatorText: "de",
};

const IncidenciasScreen = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [selectedIncidencias, setSelectedIncidencias] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterText, setFilterText] = useState("");

  //Datos del usuario logueado
  const { user } = useContext(AuthContext);

  const filteredIncidencias = incidencias.filter(
    (incidencias) => incidencias.docente.id === user.user.user.id
  );
  //Incidencias Pendientes
  const filteredPendientes = incidencias.filter(
    (incidencias) =>
      incidencias.docente.id === user.user.user.id &&
      incidencias.title.toLowerCase().includes(filterText.toLowerCase()) &&
      incidencias.status.name === "Pendiente"
  );

  //Incidencias Activas
  const filteredActivas = incidencias.filter(
    (incidencias) =>
      incidencias.docente.id === user.user.user.id &&
      incidencias.title.toLowerCase().includes(filterText.toLowerCase()) &&
      incidencias.status.name === "Activo"
  );

  //Incidencias concluidas
  const filteredConcluidas = incidencias.filter(
    (incidencias) =>
      incidencias.docente.id === user.user.user.id &&
      incidencias.title.toLowerCase().includes(filterText.toLowerCase()) &&
      incidencias.status.name === "Concluido"
  );

  const getIncidencias = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: "/incidence/" });

      if (!data.error) setIncidencias(data.data);
    } catch (error) {
      //poner alerta de error
    } finally {
      setIsLoading(false);
    }
  };
  //Se ejecuta después del return
  useEffect(() => {
    getIncidencias();
  }, []);

  const headerComponent = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) setFilterText("");
    };
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText]);

  const columns = React.useMemo(() => [
    {
      name: "#",
      cell: (row, index) => <div>{index + 1}</div>,
      sortable: true,
      width: "60px",
    },
    {
      name: "Título",
      cell: (row) => <div>{row.title}</div>,
      sortable: true,
      selector: (row) => row.title,
    },
    {
      name: "Descripción",
      cell: (row) => <div>{row.description}</div>,
      sortable: true,
      selector: (row) => row.description,
    },

    {
      name: "Salón",
      cell: (row) => <div>{row.classroom.name}</div>,
      sortable: true,
      selector: (row) => row.classroom.name,
    },
    {
      name: "Área",
      cell: (row) => <div>{row.classroom.area.name}</div>,
      sortable: true,
      selector: (row) => row.classroom.area.name,
    },
    {
      name: "Status",
      cell: (row) => (
        <>
          {row.status.name === "Activo" ? (
            <BsAlarm size={22} style={{ color: "FF7400" }} />
          ) : row.status.name === "Concluido" ? (
            <AiOutlineCheckCircle size={25} style={{ color: "green" }} />
          ) : row.status.name === "Pendiente" ? (
            <AiOutlineInfoCircle size={25} style={{ color: "red" }} />
          ) : (
            <AiOutlineInfoCircle size={25} style={{ color: "white" }} />
          )}
        </>
      ),
      sortable: true,
      selector: (row) => row.status.name,
    },

    {
      name: "Detalles",
      cell: (row) => (
        <>
          {row.status.name === "Pendiente" ? (
            <ButtonCircle
              icon="info"
              type={"btn btn-outline-info btn-circle disabled"}
              size={16}
              disabled
            ></ButtonCircle>
          ) : (
            <ButtonCircle
              icon="info"
              type={"btn btn-outline-info btn-circle"}
              size={16}
              onClick={() => {
                setIsEditing(true);
                setSelectedIncidencias(row);
              }}
            ></ButtonCircle>
          )}
        </>
      ),
    },
  ]);

  const [show, setShow] = useState(false);

  return (
    <>
      <Row>
        <Col xs={6}>
          <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={9000}
            autohide
          >
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">SIRID</strong>
              <small>Atención!</small>
            </Toast.Header>
            <Toast.Body>
              Es importante saber que solo podrás ver los detalles de las
              incidencias En curso o Finalizadas
            </Toast.Body>
          </Toast>
        </Col>
        <Col xs={6}></Col>
      </Row>

      <div className="card">
        <TabView>
          <TabPanel header="Todas las incidencias" leftIcon="pi pi-copy mr-2">
            <Card>
              <Card.Header>
                <Row>
                  <Col sm={11} className="text-end">
                    <center>
                      <b>Incidencias Propias</b>
                    </center>
                  </Col>
                  <Col sm={1} className="text-end">
                    <Button
                      variant="warning"
                      title="Es importante saberlo"
                      onClick={() => setShow(true)}
                    >
                      <AiOutlineAlert />
                    </Button>
                    {selectedIncidencias && (
                      <EditIncidenciasScreen
                        isOpen={isEditing}
                        onClose={() => setIsEditing(false)}
                        setIncidencias={setIncidencias}
                        incidencias={selectedIncidencias}
                      />
                    )}
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={filteredIncidencias}
                  progressPending={isLoading}
                  progressComponent={<Loading />}
                  noDataComponent={"Sin incidencias registradas"}
                  pagination
                  paginationComponentOptions={options}
                  subHeader
                  subHeaderComponent={headerComponent}
                  persistTableHead
                  striped={true}
                  highlightOnHover={true}
                />
              </Card.Body>
            </Card>
          </TabPanel>
          <TabPanel header="Pendientes" leftIcon="pi pi-book mr-2">
            <Card>
              <Card.Header>
                <Row>
                  <Col>Incidencias Propias</Col>
                  <Col className="text-end">
                    {selectedIncidencias && (
                      <EditIncidenciasScreen
                        isOpen={isEditing}
                        onClose={() => setIsEditing(false)}
                        setIncidencias={setIncidencias}
                        incidencias={selectedIncidencias}
                      />
                    )}
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={filteredPendientes}
                  progressPending={isLoading}
                  progressComponent={<Loading />}
                  noDataComponent={"Sin incidencias pendientes"}
                  pagination
                  paginationComponentOptions={options}
                  subHeader
                  subHeaderComponent={headerComponent}
                  persistTableHead
                  striped={true}
                  highlightOnHover={true}
                />
              </Card.Body>
            </Card>
          </TabPanel>

          <TabPanel header="En curso" leftIcon="pi pi-stopwatch mr-2">
            <Card>
              <Card.Header>
                <Row>
                  <Col>Incidencias Propias</Col>
                  <Col className="text-end">
                    {selectedIncidencias && (
                      <EditIncidenciasScreen
                        isOpen={isEditing}
                        onClose={() => setIsEditing(false)}
                        setIncidencias={setIncidencias}
                        incidencias={selectedIncidencias}
                      />
                    )}
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={filteredActivas}
                  progressPending={isLoading}
                  progressComponent={<Loading />}
                  noDataComponent={"Sin incidencias en curso"}
                  pagination
                  paginationComponentOptions={options}
                  subHeader
                  subHeaderComponent={headerComponent}
                  persistTableHead
                  striped={true}
                  highlightOnHover={true}
                />
              </Card.Body>
            </Card>
          </TabPanel>

          <TabPanel header="Concluidas" leftIcon="pi pi-star mr-2">
            <Card>
              <Card.Header>
                <Row>
                  <Col>Incidencias Propias</Col>
                  <Col className="text-end">
                    {selectedIncidencias && (
                      <EditIncidenciasScreen
                        isOpen={isEditing}
                        onClose={() => setIsEditing(false)}
                        setIncidencias={setIncidencias}
                        incidencias={selectedIncidencias}
                      />
                    )}
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={filteredConcluidas}
                  progressPending={isLoading}
                  progressComponent={<Loading />}
                  noDataComponent={"Sin incidencias concluidas"}
                  pagination
                  paginationComponentOptions={options}
                  subHeader
                  subHeaderComponent={headerComponent}
                  persistTableHead
                  striped={true}
                  highlightOnHover={true}
                />
              </Card.Body>
            </Card>
          </TabPanel>
        </TabView>
      </div>
    </>
  );
};

export default IncidenciasScreen;
