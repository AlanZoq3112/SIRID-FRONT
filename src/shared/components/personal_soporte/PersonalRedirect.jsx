import React from 'react'
import { BrowserRouter , Route, Routes  } from 'react-router-dom';
import SoporteSidebar from './SoporteSidebar';
import IncidenciasPendientes from '../../../modules/personal_soporte/components/IncidenciasPendientes';
import PerfilSoporte from '../../../modules/personal_soporte/components/PerfilSoporte';
import AtenderIncidencia from '../../../modules/personal_soporte/components/AtenderIncidencia';
import ChatSoporte from '../../../modules/personal_soporte/components/ChatSoporte';
import IncidenciaEnCurso from '../../../modules/personal_soporte/components/IncidenciaEnCurso';
import SolicitudCambios from '../../../modules/Docente/components/cambios/SolicitudCambios';

const PersonalRedirect = () => {
  return (
    <BrowserRouter>
 <SoporteSidebar>
  <Routes>
  <Route path='/' element={<IncidenciasPendientes/>}/>
    <Route path='/IncidenciasPen' element={<IncidenciasPendientes/>}/>
    <Route path='/AtenderIncidencia' element={<AtenderIncidencia/>}/>
    <Route path='/PerfilSoporte' element={<PerfilSoporte/>}/>
    <Route path='/ChatSoporte' element={<ChatSoporte/>}/>
    <Route path='/IncidenciaEnCurso' element={<IncidenciaEnCurso/>}/>
    <Route path='/SolicituCambios' element={<SolicitudCambios/>}/>
  </Routes>
  </SoporteSidebar>
 </BrowserRouter>
  )
}

export default PersonalRedirect
