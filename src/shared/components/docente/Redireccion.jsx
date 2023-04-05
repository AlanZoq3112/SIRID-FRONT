import React from 'react'
import { BrowserRouter , Route, Routes  } from 'react-router-dom';
import Sidebar from './Sidebar';
import Chat from './../../../modules/Docente/components/Chat'
import Incidencias from './../../../modules/Docente/components/Incidencias';
import Perfil from './../../../modules/Docente/components/Perfil';
import SolicitudCambios from './../../../modules/Docente/components/cambios/SolicitudCambios';

const Redireccion = () => {
  return (
    <div>
      <BrowserRouter>
 <Sidebar>
  <Routes>
    <Route path='/incidencias' element={<Incidencias/>}/>
    <Route path='/chat' element={<Chat/>}/>
    <Route path='/perfil' element={<Perfil/>}/>
    <Route path='/SolicituCambios' element={<SolicitudCambios/>}/>
  </Routes>
  </Sidebar>
 </BrowserRouter>
    </div>
  )
}

export default Redireccion
