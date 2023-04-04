import React, {useState} from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';


const Chat = () => {
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages([...messages, { sender: 'me', recipient, content: message }]);
    setMessage('');
  };

  const filterMessages = (msgs) => {
    return msgs.filter((msg) => msg.recipient === '' || msg.recipient === recipient);
  };
  return (
    <Container className="my-5">
    <Row className="chat-header">
      <Col>
        <h1>Chat</h1>
      </Col>
      <Col>
        <Form.Control
          type="text"
          placeholder="Recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="form-input"
        />
      </Col>
    </Row>
    <Row className="chat-messages">
      <Col>
        {filterMessages(messages).map((msg, i) => (
          <div key={i} className={msg.sender === 'me' ? 'message me' : 'message'}>
            {msg.content}
          </div>
        ))}
      </Col>
    </Row>
    <Row className="chat-form">
      <Col>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="message">
            <Form.Control
              type="text"
              placeholder="Enter message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-input"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="form-submit">
            Send
          </Button>
        </Form>
      </Col>
    </Row>
  </Container>
  )
}

export default Chat