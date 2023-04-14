import React, { useState } from 'react';
import { Container, Row, Col, InputGroup, FormControl, Button, Card } from 'react-bootstrap';


const ChatSoporte = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { content: message, sender: 'user' }]);
      setMessage('');
    }
  };
  return (
      <Container>
      <Row>
        <Col md={{ span: 8, offset: 2 }} className="mb-3">
          <div className="chat-box phone-style">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                <span>{msg.content}</span>
              </div>
            ))}
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Type your message here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button type="submit">Send</Button>
            </InputGroup>
          </form>
        </Col>
      </Row>
    </Container>
  )
}

export default ChatSoporte;