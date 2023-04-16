import React, { useEffect, useState, useContext } from "react";
import { Card, Col, Row, Badge } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../../shared/plugins/axios";
import { ButtonCircle } from "./../../../shared/components/ButtonCircle";
import { Loading } from "./../../../shared/components/Loading";
import { FilterComponent } from "./../../../shared/components/FilterComponent";
import {EditIncidenciasScreen} from './components/EditIncidenciasScreen'
import { AiOutlineInfoCircle , AiOutlineCheckCircle} from "react-icons/ai";
import { BsAlarm } from "react-icons/bs";

import { AuthContext } from "./../../auth/authContext";

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
  const [filterText, setFilterText] = useState(""
  );
  const [isOpen, setIsOpen] = useState(false);

  //Datos del usuario logueado
  const { user } = useContext(AuthContext);

  const filteredIncidencias = incidencias.filter(
    (incidencias) => incidencias.docente.id === user.user.user.id
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

  return (
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
  );
};

export default IncidenciasScreen;
