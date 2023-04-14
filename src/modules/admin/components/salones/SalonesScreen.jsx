import React, { useEffect, useState } from "react";
import { Card, Col, Row, Badge } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../../../shared/plugins/axios";
import { ButtonCircle } from "./../../../../shared/components/ButtonCircle";
import { Loading } from "./../../../../shared/components/Loading";
import { FilterComponent } from "./../../../../shared/components/FilterComponent";
import { SalonesForm } from "./components/SalonesForm";
import { EditSalonesForm } from "./components/EditSalonesForm";

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

const SalonesScreen = () => {
  const [salones, setSalones] = useState([]);
  const [selectedSalones, setSelectedSalones] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredSalones = salones.filter(
    (salon) =>
      salon.name && salon.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const getSalones = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: "/classroom/" });
     
      if (!data.error) setSalones(data.data);
    } catch (error) {
      //poner alerta de error
    } finally {
      setIsLoading(false);
    }
  };
  //Se ejecuta después del return
  useEffect(() => {
    getSalones();
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
            url: "/classroom/",
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
          getSalones();
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
      name: "Salon",
      cell: (row) => <div>{row.name}</div>,
      sortable: true,
      selector: (row) => row.name,
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
      name: "Area",
      cell: (row) => <div>{row.area.name}</div>,
      sortable: true,
      selector: (row) => row.name,
    },
    {
      name: "Tipo",
      cell: (row) => <div>{row.type.name}</div>,
      sortable: true,
      selector: (row) => row.name,
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
              setSelectedSalones(row);
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
          <Col>Salones</Col>
          <Col className="text-end">
            <ButtonCircle
              type={"btn btn-outline-success"}
              onClick={() => setIsOpen(true)}
              icon="plus"
              size={16}
            />
            <SalonesForm
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              setSalones={setSalones}
            />
            {selectedSalones && (
              <EditSalonesForm
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                setSalones={setSalones}
                salones={selectedSalones}
              />
            )}
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <DataTable
          columns={columns}
          data={filteredSalones}
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

export default SalonesScreen;
