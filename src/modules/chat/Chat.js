import { useEffect, useState, useRef, useContext } from "react";
import { db } from "./firebaseConfig ";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { AuthContext } from "../auth/authContext";
import "./chat.css";

const Chat = () => {
  const { user } = useContext(AuthContext);

  const scroll = useRef();
  const name = user ? user.user.user.name : "Name User"; //obtener el correo del usuario logeado (con el token)

  const [messages, setMessages] = useState([]); //aqui se guardan los mensajes que devuelve la bd

  useEffect(() => {
    const newQuery = query(collection(db, "messages"), orderBy("timestamp")); //mandomos a traer los elemetos de la colection "messages"(asi se llama la coleccion en firebase)

    const unsubscribe = onSnapshot(newQuery, (querySpanshot) => {
      let currentMessages = []; //aqui se guardan (temporalmente) los mensajes que recibimos
      querySpanshot.forEach((item) => {
        // recibimos los datos en JSON (creo) y lo recorremos (elemento por elemento)
        currentMessages.push({ content: item.data(), id: item.id }); //guardamos los datos en el array temporal
      });
      setMessages(currentMessages); //guardamos todos  ("permanente" hasta que se actualice la base) los elementos recibidos al array local para poderlos visualizar
    });
    return unsubscribe;
  }, []);



  return (
    <>
      <section className="chat-content">
        {messages &&
          messages.map((item) => (
            <Message key={item.id} message={item.content} />
          ))}
        {user && <SendMessage scroll={scroll} />}
        <span ref={scroll}></span>
      </section>

    </>
  );
};
export default Chat;

//Liena 38: validamos s hay un usuario logeado, si es asi puede eniar mensajes (puedes quitar la validacion y dejar el componente <SendMessage/> )
