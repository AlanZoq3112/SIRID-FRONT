import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";

const AtenderIncidencia = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8090/api-sirid/incidence/")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);
  return (
    <div>
    {data.map((item) => (
      <Card style={{ width: "18rem" }} key={item.id}>
        <Card.Body>
          <Card.Title>{item.title}</Card.Title>
          <Card.Text>{item.description}</Card.Text>
          <Button variant="primary">Ver más</Button>
        </Card.Body>
      </Card>
    ))}
  </div>
  )
}

export default AtenderIncidencia
