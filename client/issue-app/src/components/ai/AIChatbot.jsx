// issue-app/src/components/AIChatbot.jsx
import React, { useEffect, useRef, useState } from "react";
import { sendAIQuery } from "../../api/aiClient";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Badge,
  Alert,
} from "react-bootstrap";

// Generate or reuse a sessionId per browser
function getOrCreateSessionId() {
  let id = localStorage.getItem("ai_session_id");
  if (!id) {
    id = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("ai_session_id", id);
  }
  return id;
}

export default function AIChatbot() {
  const [sessionId] = useState(getOrCreateSessionId);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "ai",
      text: "Hi! I’m your community issues assistant. Ask me about open, resolved, or trending issues in the city.",
    },
  ]);
  const [followUps, setFollowUps] = useState([]); // suggestions from AI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatRef = useRef(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = userInput.trim();
    if (!trimmed) return;

    // Push user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setError("");
    setLoading(true);
    setFollowUps([]);

    try {
      const result = await sendAIQuery(trimmed, sessionId);
      // result: { question, answer, followUp, summary? }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: result.answer || "(AI returned no answer)",
        summary: result.summary || "",
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (result.followUp) {
        const suggestions = result.followUp
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        setFollowUps(suggestions);
      }
    } catch (err) {
      console.error("AI error:", err);
      setError(err.message || "Something went wrong talking to the AI service.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUpClick = async (q) => {
    // auto-send follow-up question
    setUserInput(q);
    await handleSubmit({ preventDefault: () => {} });
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        text: "Hi! I’m your community issues assistant. Ask me about issues, alerts, and trends.",
      },
    ]);
    setFollowUps([]);
    setError("");
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <strong>AI Community Assistant</strong>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>
                  Powered by LangGraph + Gemini + MongoDB
                </div>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleReset}
              >
                Reset Chat
              </Button>
            </Card.Header>

            <Card.Body
              ref={chatRef}
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                backgroundColor: "#f8f9fa",
              }}
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`mb-3 d-flex ${
                    m.sender === "user"
                      ? "justify-content-end"
                      : "justify-content-start"
                  }`}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      borderRadius: "12px",
                      padding: "8px 12px",
                      backgroundColor:
                        m.sender === "user" ? "#0d6efd" : "#ffffff",
                      color: m.sender === "user" ? "#fff" : "#000",
                      border:
                        m.sender === "ai" ? "1px solid rgba(0,0,0,0.05)" : "",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        marginBottom: "4px",
                        opacity: 0.8,
                      }}
                    >
                      {m.sender === "user" ? "You" : "Assistant"}
                    </div>
                    <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
                    {m.summary && (
                      <div
                        style={{
                          marginTop: "6px",
                          fontSize: "0.8rem",
                          color: "#555",
                          borderTop: "1px dashed #ddd",
                          paddingTop: "4px",
                        }}
                      >
                        <strong>Summary:</strong> {m.summary}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="d-flex justify-content-center mt-2">
                  <Spinner animation="border" size="sm" />
                  <span className="ms-2">Thinking...</span>
                </div>
              )}
            </Card.Body>

            <Card.Footer>
              {error && (
                <Alert variant="danger" className="mb-2">
                  {error}
                </Alert>
              )}

              {followUps.length > 0 && (
                <div className="mb-2">
                  <div style={{ fontSize: "0.85rem", marginBottom: "4px" }}>
                    Suggested follow-up questions:
                  </div>
                  {followUps.map((q, idx) => (
                    <Badge
                      key={idx}
                      bg="secondary"
                      pill
                      style={{
                        cursor: "pointer",
                        marginRight: "4px",
                        marginBottom: "4px",
                      }}
                      onClick={() => handleFollowUpClick(q)}
                    >
                      {q}
                    </Badge>
                  ))}
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label>
                    <strong>Ask a question:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="E.g., 'What issues are trending this week?'"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    disabled={loading}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button
                    type="submit"
                    disabled={loading || !userInput.trim()}
                  >
                    {loading ? "Thinking..." : "Ask"}
                  </Button>
                </div>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
