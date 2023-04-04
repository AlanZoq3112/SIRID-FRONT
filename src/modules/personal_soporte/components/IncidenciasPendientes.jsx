import React, { useEffect, useState } from "react";
import { Card, Col, Row, Badge, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../../shared/plugins/axios";
import { ButtonCircle } from "./../../../shared/components/ButtonCircle";
import { Loading } from "./../../../shared/components/Loading";
import { FilterComponent } from "./../../../shared/components/FilterComponent";
import {DetallesIncidencia} from "./incidencias/DetallesIncidencia";
import AtenderIncidencia from "./AtenderIncidencia";

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


const IncidenciasPendientes = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const filteredIncidencias = incidencias.filter(
    (incidencias) =>
    incidencias.title && incidencias.title.toLowerCase().includes(filterText.toLowerCase())
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
      cell: ( row,index) =><Col xs lg="2"> {index + 1} </Col>,
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
        selector: (row) => row.name,
      },
    {
      name: "Salon",
      cell: (row) => <div>{row.classroom.name}</div>,
      sortable: true,
      selector: (row) => row.name,
    },
    {
      name: "Docente",
      cell: (row) => <div>{row.docente.name}</div>,
      sortable: true,
      selector: (row) => row.name,
    },
    {
      name: "Estado",
      cell: (row) => <div>{row.status.name}</div>,
      sortable: true,
      selector: (row) => row.name,
      },
    {
      name: "Detalles",
      cell: (row) => (
        <>
            <ButtonCircle
              icon="tool"
              type={"btn btn-outline-primary btn-circle"}
              size={16}
              onClick={() => {
                setIsEditing(true);
              }}
            ></ButtonCircle>
        </>
      ), //fragment
    },
  ]);
  return (
    <>
    <Card>
      <Card.Header>
        <Row>
          <Col>Incidencias</Col>
          <Col>
          <DetallesIncidencia
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
              />
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
    </>
  )
}

export default IncidenciasPendientes;
