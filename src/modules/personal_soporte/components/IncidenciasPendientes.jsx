import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../../shared/plugins/axios";
import { ButtonCircle } from "./../../../shared/components/ButtonCircle";
import { Loading } from "./../../../shared/components/Loading";
import { FilterComponent } from "./../../../shared/components/FilterComponent";
import { AiOutlineInfoCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { BsAlarm } from "react-icons/bs";
import DetallesIncidencia from "./incidencias/DetallesIncidencia";
import { FinalizarIncidencia } from "./incidencias/FinalizarIncidencia";
import { TabView, TabPanel } from "primereact/tabview";
const options = {
  rowsPerPageText: "Registros por página",
  rangeSeparatorText: "de",
};

const IncidenciasPendientes = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedIncidencias, setSelectedIncidencias] = useState(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [setIsOpen] = useState(false);

  const filteredIncidencias = incidencias.filter(
    (incidencias) =>
      incidencias.title &&
      incidencias.title.toLowerCase().includes(filterText.toLowerCase())
  );

    //Incidencias Pendientes
    const filteredPendientes = incidencias.filter(
      (incidencia) =>
        incidencia.title &&
        incidencia.title.toLowerCase().includes(filterText.toLowerCase()) &&
        incidencia.status.name === "Pendiente"
    );

     //Incidencias Activas
     const filteredActivas = incidencias.filter(
      (incidencia) =>
        incidencia.title &&
        incidencia.title.toLowerCase().includes(filterText.toLowerCase()) &&
        incidencia.status.name === "Activo"
    );

  //Incidencias concluidas
  const filteredConcluido = incidencias.filter(
    (incidencia) =>
      incidencia.title &&
      incidencia.title.toLowerCase().includes(filterText.toLowerCase()) &&
      incidencia.status.name === "Concluido"
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
    },
    {
      name: "Titulo",
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
      name: "Salon",
      cell: (row) => <div>{row.classroom.name}</div>,
      sortable: true,
      selector: (row) => row.classroom.name,
    },
    {
      name: "Area",
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
          <ButtonCircle
            icon="info"
            type={"btn btn-outline-info btn-circle"}
            size={16}
            onClick={() => {
              setIsEditing(true);
              setSelectedIncidencias(row);
            }}
            disabled={row.status.name === "Concluido"}
          ></ButtonCircle>
        </>
      ),
    },
    {
      name: "Acción",
      cell: (row) => (
        <>
          <ButtonCircle
            icon="thumbs-up"
            type={"btn btn-outline-black btn-circle"}
            size={16}
            onClick={() => {
              setIsFinish(true);
              setSelectedIncidencias(row);
            }}
            disabled={row.status.name === "Concluido"}
          />
        </>
      ),
    },
  ]);
  return (
    <>
      <div className="card">
        <TabView>
          <TabPanel header="Todas las incidencias" leftIcon="pi pi-copy mr-2">
            <Card>
              <Card.Header>
                <Row>
                  <Col>Todas las Incidencias</Col>
                  <Col className="text-end">
                    {selectedIncidencias && (
                      <DetallesIncidencia
                        isOpen={isEditing}
                        onClose={() => setIsEditing(false)}
                        setIncidencias={setIncidencias}
                        incidencias={selectedIncidencias}
                      />
                    )}

                    {selectedIncidencias && (
                      <FinalizarIncidencia
                        isOpen={isFinish}
                        onClose={() => setIsFinish(false)}
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
                  <Col>Incidencias Pendientes</Col>
                  <Col className="text-end">
                    {selectedIncidencias && (
                      <DetallesIncidencia
                        isOpen={isEditing}
                        onClose={() => setIsEditing(false)}
                        setIncidencias={setIncidencias}
                        incidencias={selectedIncidencias}
                      />
                    )}

                    {selectedIncidencias && (
                      <FinalizarIncidencia
                        isOpen={isFinish}
                        onClose={() => setIsFinish(false)}
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

          <TabPanel header="En curso" leftIcon="pi pi-stopwatch mr-2">
          <Card>
              <Card.Header>
                <Row>
                  <Col>Incidencias en Curso</Col>
                  <Col className="text-end">
                    {selectedIncidencias && (
                      <DetallesIncidencia
                        isOpen={isEditing}
                        onClose={() => setIsEditing(false)}
                        setIncidencias={setIncidencias}
                        incidencias={selectedIncidencias}
                      />
                    )}

                    {selectedIncidencias && (
                      <FinalizarIncidencia
                        isOpen={isFinish}
                        onClose={() => setIsFinish(false)}
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

          <TabPanel header="Concluidas" leftIcon="pi pi-star mr-2">
            <Card>
              <Card.Header>
                <Row>
                  <Col>Incidencias Pendientes</Col>
                  <Col className="text-end">
                    {selectedIncidencias && (
                      <DetallesIncidencia
                        isOpen={isEditing}
                        onClose={() => setIsEditing(false)}
                        setIncidencias={setIncidencias}
                        incidencias={selectedIncidencias}
                      />
                    )}

                    {selectedIncidencias && (
                      <FinalizarIncidencia
                        isOpen={isFinish}
                        onClose={() => setIsFinish(false)}
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
                  data={filteredConcluido}
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
        </TabView>
      </div>
    </>
  );
};

export default IncidenciasPendientes;
