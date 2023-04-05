import React ,{ useState } from 'react'
import Modal from 'react-modal';

const NewIncidencia = ({ isOpen, onClose }) => {
    
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Se ha enviado el formulario con los siguientes datos: ${nombre}, ${apellido}, ${email}`);
    onClose();
  }
  return (

     <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>Formulario</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" value={nombre} onChange={(event) => setNombre(event.target.value)} />
        </label>
        <label>
          Apellido:
          <input type="text" value={apellido} onChange={(event) => setApellido(event.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <button type="submit">Enviar</button>
      </form>
    </Modal>
  )
}

export default NewIncidencia
