import { useContext } from "react";
import { AuthContext } from "../auth/authContext";
import "./chat.css"
const Message = ({ message }) => {
   
    const { user } = useContext(AuthContext);
    const name = user ? user.user.email : "Name User";//Obtener el correo del usuario logeado (TOKEN)
    let newStyles = 'message';
        if (message.uid === user.user.email ) {//varificamos el correo de quien esta logeado con el correo de quien manda el mensaje  
            newStyles = 'my-message';            //asignamos los estilos que nosotros lo mandamos
        } 
    

    //---------------------Esto es para las fechas y horas---------------
    const date = new Date(message.timestamp?.seconds*1000);
    const options = { 
        month: 'long', 
        day: 'numeric' 
    };
    let h = date.getHours();
    let m = date.getMinutes();
    let time = h + ":" + m;
    const newDate = date.toLocaleDateString('en-US', options);
    //--------------------------------------------------------------------
    return ( 
        <article className={newStyles}>
            <div>
                <div className='text-message'>
                    {
                        name!=message.name ?  <p className="user" style={{color:"gray"}}>{message.name}</p>:"" 
                    }
                    <p className="text">{ message.text }</p>
                </div>
                <p className="user">{`${newDate} - ${time}`}</p>
            </div>
        </article>
     );

                }
export default Message;
/*----------------Explicacion---------------------------------
    Lineal 34: verificamos si el mensaje no es de nosotros, si no lo es imprimimos el nombre de quien lo mando 
            y si si lo es no imprimimos nada
    Linea 36: Imprimimos el mensaje
    Lina 38: Mostramos la fecha del mensaje (le ponemos los estilos de la letras de user xd)
*/