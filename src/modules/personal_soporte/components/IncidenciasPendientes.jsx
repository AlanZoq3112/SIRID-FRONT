import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../../shared/plugins/axios";
import { ButtonCircle } from "./../../../shared/components/ButtonCircle";
import { Loading } from "./../../../shared/components/Loading";
import { FilterComponent } from "./../../../shared/components/FilterComponent";
import { AiOutlineInfoCircle , AiOutlineCheckCircle} from "react-icons/ai";
import { BsAlarm } from "react-icons/bs";
import EditIncidenciasScreen from "../../Docente/Incidencias/components/EditIncidenciasScreen";

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
  const [setIsOpen] = useState(false);

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
          <Col className="text-end">
            <ButtonCircle
              type={"btn btn-outline-success"}
              onClick={() => setIsOpen(true)}
              icon="plus"
              size={16}
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
    </>
  )
}

export default IncidenciasPendientes;
