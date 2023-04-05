import React from "react";
import { TabView, TabPanel } from "primereact/tabview";
import SalonesScreen from "./salones/SalonesScreen";
import AreasScreen from "./area/AreasScreen";
import AcademiasScreen from "./academias/AcademiasScreen";
import TiposScreen from "./tipos/TiposScreen";

const Componentes = () => {

  /*Recibe una dependencia, si está vacío solo se renderiza una vez, si no, se ejecuta cada que haya un cambio en la dependencia*/

  return (
    <div>
      <div className="card">
        <TabView>
          <TabPanel header="Salones">
            <SalonesScreen />
          </TabPanel>
          <TabPanel header="Areas">
           <AreasScreen/>
          </TabPanel>
          <TabPanel header="Academias">
           <AcademiasScreen/>
          </TabPanel>
          <TabPanel header="Tipos de Area">
            <TiposScreen/>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default Componentes;
