import React, { useEffect, useState } from "react";
import { Card, Col, Row, Badge } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../../shared/plugins/axios";
import { ButtonCircle } from "./../../../shared/components/ButtonCircle";
import { Loading } from "./../../../shared/components/Loading";
import { FilterComponent } from "./../../../shared/components/FilterComponent";
import { IncidenciasForm } from "./components/IncidenciasForm";
import {EditIncidenciasScreen} from './components/EditIncidenciasScreen'

import Alert, {
  confirmMsg,
  confirmTitle,
  errorMsg,
  errorTitle,
  successMsg,
  successTitle,
} from "./../../../shared/plugins/alert";

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
  const [isOpen, setIsOpen] = useState(false);

  const filteredIncidencias = incidencias.filter(
    (incidencias) =>
    incidencias.title && incidencias.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const getIncidencias = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: "/incidence/" });
      console.log("Incidencias", data.data);
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
        console.log("Row", row);
        try {
          const response = await AxiosClient({
            method: "PATCH",
            url: "/incidence/",
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
          getIncidencias();
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
        name: "Creado en:",
        cell: (row) => <div>{row.created_at}</div>,
        sortable: true,
        selector: (row) => row.created_at,
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
        <div
          style={{
            backgroundColor: 
              row.status.name === "Activo" ? "blue" :
              row.status.name === "Concluido" ? "green" :
              row.status.name === "Pendiente" ? "orange" :
              "white",
            color: "white",
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: "4px",
            fontWeight: "bold"
          }}
        >
          {row.status.name}
        </div>
      ),
      sortable: true,
      selector: (row) => row.status.name,
    },
    {
      name: "Docente",
      cell: (row) => <div>{row.docente.name}</div>,
      sortable: true,
      selector: (row) => row.docente.name,
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
              setSelectedIncidencias(row);
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
  ]);

  return (
    <Card>
      <Card.Header>
        <Row>
          <Col>Incidencias</Col>
          <Col className="text-end">
            <ButtonCircle
              type={"btn btn-outline-success"}
              onClick={() => setIsOpen(true)}
              icon="plus"
              size={16}
            />
            <IncidenciasForm
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              setIncidencias={setIncidencias}
            />
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
  );
};

export default IncidenciasScreen;
