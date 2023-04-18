import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState, useContext } from "react";
import { db } from "./firebaseConfig ";
import Picker from "emoji-picker-react"; //este es para usar los emojis
import { BsFillEmojiSmileFill } from "react-icons/bs"; //este es un icono
import { IoSend } from "react-icons/io5"; //este es un icono
import { AiFillCloseCircle } from "react-icons/ai"; //este es un icono
import { AuthContext } from "../auth/authContext";
import "./chat.css";
const SendMessage = ({ scroll }) => {
  const { user } = useContext(AuthContext);

  const [input, setInput] = useState(""); //aqui se guarda lo que escribimos en el campo de texto
  const [open, setOpen] = useState("close"); //esto es para abiri o cerra los mensajes

  const sendMessage = async (e) => {
    //hacemos una llamada a la base (recibimos "e" el cual nos ayuda a no recargar toda la pagina , si no solo a recargar el componene)
    e.preventDefault(); //decimos que solo recarge el componente y no toda la pagina
    setOpen("close"); // cerramos la ventana de los emojis

    if (input === "") {
      //verificamos que el campo de texto no este vacio
      alert("Favor de enviar un mensaje valido"); //mensaje
      return;
    }
    const displayName = user.user.email ? user.user.email : "Usuario Anónimo";

    const  uid  = user.user.email; // obtenemos el identificador del del mensaje y el nombre del usuario logeadp
    console.log("Input:", input);
    console.log("displayName:", displayName);
    console.log("uid", uid)

    await addDoc(collection(db, "messages"), {
      text: input,
      name: displayName,
      uid,
      timestamp: serverTimestamp(),
    });

    setInput(""); //limpiamos el campo de texto
    scroll.current.scrollIntoView({ behavior: "smooth" }); //esto es para que el scroll baje
  };

  const emoji = () => {
    setOpen("open"); //actualizamos el estado de la ventana de los emojis para que se abra
  };
  const closeEmoji = () => {
    setOpen("close"); //actualizamos el estado de la ventana de los emojis para que se cierre
  };
  const onEmojiClick = (emojiObject) => {
    //recibimos la propiedad "emojiObject" la cual viene por defecto y tiene varios campos
    setInput(`${input}${emojiObject.emoji}`); // asignamos al campo que ya tenia mas el emoji
  };

  return (
    <form
      onSubmit={
        sendMessage
      } /*cada que se preiona el boton de enbiar llama a la funcion "sendMessage" (esta arriba)*/
    >
      <button //Abre los iconos
        type="button"
        className="btn-emoji" //le aignamos los estilos de "btn-emoji"
        onClick={emoji}
      >
        <BsFillEmojiSmileFill /*Este es un icono*/ />
      </button>
      <div
        className={
          open
        } /*ponemos loes estilos de la variable "open" (por defecto estan en close)*/
      >
        <button //cierra los iconos
          className="close-emoji" //le aignamos los estilos de un boton de cerre
          onClick={closeEmoji}
          type="button"
        >
          <AiFillCloseCircle
            style={{ color: "red" }} /* Este es un icono (lo pintamos de rojo)*/
          />
        </button>
        <Picker
          onEmojiClick={
            onEmojiClick
          } /* este es el menu de emojis (llama a la funcion para añadir el emoji al campo de texto)*/
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
  <input
    type="text"
    placeholder="Escribe tu mensaje aqui"
    onChange={(e) => setInput(e.target.value)}
    value={input}
  />
  <button type="submit">
    Enviar <IoSend /*Este es un icono */ />
  </button>
</div>

    </form>
  );
};

export default SendMessage;
