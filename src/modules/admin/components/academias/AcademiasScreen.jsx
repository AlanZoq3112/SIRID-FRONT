import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../../../shared/plugins/axios";
import { ButtonCircle } from "./../../../../shared/components/ButtonCircle";
import { Loading } from "./../../../../shared/components/Loading";
import { FilterComponent } from "./../../../../shared/components/FilterComponent";
import { AcademiasForm } from "./components/AcademiasForm";
import { EditAcademiasForm } from "./components/EditAcademiasForm";

export const AcademiasScreen = () => {
  const [academias, setAcademias] = useState([]);
  const [selectedAcademia, setSelectedAcademia] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredAcademias = academias.filter(
    (academia) =>
      academia.name &&
      academia.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const getAcademias = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: "/academic/" });
      if (!data.error) setAcademias(data.data);
    } catch (error) {
      //poner alerta de error
    } finally {
      setIsLoading(false);
    }
  };
  //Se ejecuta después del return
  useEffect(() => {
    getAcademias();
  }, []);
  /*Recibe una dependencia, si está vacío solo se renderiza una vez, si no, se ejecuta cada que haya un cambio en la dependencia*/

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

  const columns = React.useMemo(
    () => [
      {
        name: "#",
        cell: (row, index) => <div>{index + 1}</div>,
        sortable: true,
        width: "100px",
      },
      {
        name: "Nombre de la Academia",
        cell: (row) => <div>{row.name}</div>,
        sortable: true,
        selector: (row) => row.name,
      },
    ],
    []
  );
  return (
    <Card>
    <Card.Header>
      <Row>
        <Col sm={11} className="text-end"><center><b>Academias Universitarias</b></center></Col>
        <Col sm={1} className="text-end">
          <ButtonCircle
            type={"btn btn-outline-success"}
            onClick={() => setIsOpen(true)}
            icon="plus"
            size={16}
          />
          <AcademiasForm
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            setAcademias={setAcademias}
          />
          <EditAcademiasForm
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            setAcademias={setAcademias}
            academia={selectedAcademia}
          />
        </Col>
      </Row>
    </Card.Header>
    <Card.Body>
      <DataTable
        columns={columns}
        data={filteredAcademias}
        progressPending={isLoading}
        progressComponent={<Loading />}
        noDataComponent={"No hay academias registradas"}
        subHeader
        subHeaderComponent={headerComponent}
        persistTableHead
        striped={true}
        highlightOnHover={true}
        noHeader={true}
        style={{ display: "flex", justifyContent: "center", width: "100%", fontSize: "8rem" }}
      />
    </Card.Body>
  </Card>
  
  );
};
export default AcademiasScreen;
