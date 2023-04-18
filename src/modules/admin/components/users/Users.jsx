import React, { useEffect, useState } from "react";
import { Card, Col, Row, Badge, Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../../../shared/plugins/axios";
import { ButtonCircle } from "./../../../../shared/components/ButtonCircle";
import { Loading } from "./../../../../shared/components/Loading";
import { FilterComponent } from "./../../../../shared/components/FilterComponent";
import { UserForm } from "./components/UserForm";
import { EditUserForm } from "./components/EditUserForm";
import { DowlandDocentes } from "./components/DowlandDocentes";
import { TabView, TabPanel } from "primereact/tabview";

import Alert, {
  confirmMsg,
  confirmTitle,
  errorMsg,
  errorTitle,
  successMsg,
  successTitle,
} from "./../../../../shared/plugins/alert";

const options = {
  rowsPerPageText: "Registros por página",
  rangeSeparatorText: "de",
};

const Users = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuarios, setSelectedUsuarios] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const descargarPdfDocentes = () => {
    AxiosClient({
      url: `/reports/TeacherList/pdf/`,
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Listado de Docentes";

      setTimeout(() => {
        link.click();
      }, 200);
    });
  };

  const descargarPdfSoporte = () => {
    AxiosClient({
      url: `/reports/supportList/pdf/`,
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Listado de Personal de Soporte";

      setTimeout(() => {
        link.click();
      }, 200);
    });
  };

  // const descargarPdfEstadisticas = () => {
  //   AxiosClient({
  //     url: `/reports/statistics/pdf/`,
  //     responseType: "blob",
  //   }).then((response) => {
  //     const url = window.URL.createObjectURL(response);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = "Estadisticas de las incidencias";

  //     setTimeout(() => {
  //       link.click();
  //     }, 200);
  //   });
  // };

  const filteredUsuarios = usuarios.filter(
    (usuarios) =>
      usuarios.name &&
      usuarios.name.toLowerCase().includes(filterText.toLowerCase())
  );

  //Mostrar solo los docentes
  const filteredDocentes = usuarios.filter(
    (usuario) => usuario.roles.name === "Docente"
  );
  //Mostrar solo los personales de soporte
  const filteredSoporte = usuarios.filter(
    (usuario) => usuario.roles.name === "Soporte Tecnico"
  );

  const getUsuarios = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: "/user/" });

      if (!data.error) setUsuarios(data.data);
    } catch (error) {
      //poner alerta de error
    } finally {
      setIsLoading(false);
    }
  };
  //Se ejecuta después del return
  useEffect(() => {
    getUsuarios();
  }, []);

  const enableOrDisable = (row) => {
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
        row.status = !row.status;
        try {
          const response = await AxiosClient({
            method: "PATCH",
            url: "/user/",
            data: JSON.stringify(row),
          });
          if (!response.error) {
            Alert.fire({
              title: successTitle,
              text: successMsg,
              icon: "success",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Aceptar",
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
          });
        } finally {
          getUsuarios();
        }
      },
    });
  };

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

  //Traer todos los usuarios
  const columns = React.useMemo(
    () => [
      {
        name: "#",
        cell: (row, index) => (
          <div style={{ width: "50px", padding: "5px" }}>{index + 1}</div>
        ),
        sortable: true,
      },
      {
        name: "Nombre",
        cell: (row) => <div>{row.name}</div>,
        sortable: true,
        selector: (row) => row.name,
      },
      {
        name: "Primer Apelido",
        cell: (row) => <div>{row.primerApellido}</div>,
        sortable: true,
        selector: (row) => row.primerApellido,
      },
      {
        name: "Segundo Apelido",
        cell: (row) => <div>{row.segundoApellido}</div>,
        sortable: true,
        selector: (row) => row.segundoApellido,
      },
      {
        name: "E-mail",
        cell: (row) => (
          <div style={{ width: "700px", padding: "5px" }}>
            {row.correoElectronico}
          </div>
        ),
        sortable: true,
        selector: (row) => row.correoElectronico,
      },
      {
        name: "Rol",
        cell: (row) => <div>{row.roles.name}</div>,
        sortable: true,
        selector: (row) => row.roles.name,
      },
      {
        name: "Divicion Academica",
        cell: (row) => <div>{row.academicDivision.name}</div>,
        sortable: true,
        selector: (row) => row.academicDivision.name,
      },
      {
        name: "Estado",
        cell: (row) =>
          row.status ? (
            <Badge bg="success">Activo</Badge>
          ) : (
            <Badge bg="danger">Inactivo</Badge>
          ),
        sortable: true,
        selector: (row) => row.status,
      },
      {
        name: "Acciones",
        cell: (row) => (
          <>
            <ButtonCircle
              icon="edit"
              type={"btn btn-outline-warning btn-circle"}
              size={16}
              onClick={() => {
                setIsEditing(true);
                setSelectedUsuarios(row);
              }}
            ></ButtonCircle>
            {row.status ? (
              <ButtonCircle
                icon="trash-2"
                type={"btn btn-outline-danger btn-circle"}
                size={16}
                onClick={() => {
                  enableOrDisable(row);
                }}
              ></ButtonCircle>
            ) : (
              <ButtonCircle
                icon="pocket"
                type={"btn btn-outline-success btn-circle"}
                size={16}
                onClick={() => {
                  enableOrDisable(row);
                }}
              ></ButtonCircle>
            )}
          </>
        ), //fragment
      },
    ],
    []
  );

  return (
    <>
      <div className="card">
        <TabView>
          <TabPanel header="Todos los usuarios" leftIcon="pi pi-users mr-2">
            <Card>
              <Card.Header>
                <Row>
                  <Col>Usuarios</Col>
                  <Col className="text-end">
                    <ButtonCircle
                      type={"btn btn-outline-success"}
                      onClick={() => setIsOpen(true)}
                      icon="user-plus"
                      size={16}
                    />
                    <UserForm
                      isOpen={isOpen}
                      onClose={() => setIsOpen(false)}
                      setUsuarios={setUsuarios}
                    />
                    {selectedUsuarios && (
                      <EditUserForm
                        isOpen={isEditing}
                        onClose={() => setIsEditing(false)}
                        setUsuarios={setUsuarios}
                        usuarios={selectedUsuarios}
                      />
                    )}
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={filteredUsuarios}
                  progressPending={isLoading}
                  progressComponent={<Loading />}
                  noDataComponent={"Sin registros"}
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
          <TabPanel header="Docentes" leftIcon="pi pi-book mr-2">
            <Card>
              <Card.Header>
                <Row>
                  <Col>Docentes</Col>
                  <Col className="text-end">
                    <ButtonCircle
                      type={"btn btn-outline-success"}
                      icon="download"
                      size={16}
                      onClick={() => {
                        descargarPdfDocentes();
                      }}
                    />

                    {selectedUsuarios && (
                      <EditUserForm
                        isOpen={isEditing}
                        onClose={() => setIsEditing(false)}
                        setUsuarios={setUsuarios}
                        usuarios={selectedUsuarios}
                      />
                    )}
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={filteredDocentes}
                  progressPending={isLoading}
                  progressComponent={<Loading />}
                  noDataComponent={"Sin registros"}
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

          <TabPanel header="Personal de Soporte" leftIcon="pi pi-desktop mr-2">
            <Card>
              <Card.Header>
                <Row>
                  <Col>Personal de Soporte Tecnico</Col>
                  <Col className="text-end">
                    <ButtonCircle
                      type={"btn btn-outline-success"}
                      icon="download"
                      size={16}
                      onClick={() => {
                        descargarPdfSoporte();
                      }}
                    />

                    {selectedUsuarios && (
                      <EditUserForm
                        isOpen={isEditing}
                        onClose={() => setIsEditing(false)}
                        setUsuarios={setUsuarios}
                        usuarios={selectedUsuarios}
                      />
                    )}
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={filteredSoporte}
                  progressPending={isLoading}
                  progressComponent={<Loading />}
                  noDataComponent={"Sin registros"}
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

export default Users;
