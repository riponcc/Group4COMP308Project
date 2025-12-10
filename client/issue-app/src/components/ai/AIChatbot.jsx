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
          <Card className="shadow-lg" style={{ backgroundColor: "#1a1a1a", border: "1px solid #dc3545" }}>
            <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: "#000000", borderBottom: "2px solid #dc3545" }}>
              <div>
                <strong style={{ color: "#dc3545", fontSize: "1.1rem" }}>AI Community Assistant</strong>
                <div style={{ fontSize: "0.8rem", color: "#888" }}>
                  Powered by LangGraph + Gemini + MongoDB
                </div>
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleReset}
                style={{ borderColor: "#dc3545", color: "#dc3545" }}
              >
                Reset Chat
              </Button>
            </Card.Header>

            <Card.Body
              ref={chatRef}
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                backgroundColor: "#0d0d0d",
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
                        m.sender === "user" ? "#dc3545" : "#1a1a1a",
                      color: m.sender === "user" ? "#fff" : "#e0e0e0",
                      border:
                        m.sender === "ai" ? "1px solid #dc3545" : "",
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
                          color: "#999",
                          borderTop: "1px dashed #444",
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
                  <Spinner animation="border" size="sm" style={{ color: "#dc3545" }} />
                  <span className="ms-2" style={{ color: "#e0e0e0" }}>Thinking...</span>
                </div>
              )}
            </Card.Body>

            <Card.Footer style={{ backgroundColor: "#000000", borderTop: "2px solid #dc3545" }}>
              {error && (
                <Alert variant="danger" className="mb-2" style={{ backgroundColor: "#dc3545", color: "#fff", border: "none" }}>
                  {error}
                </Alert>
              )}

              {followUps.length > 0 && (
                <div className="mb-3" style={{ 
                  backgroundColor: "#1a1a1a", 
                  padding: "12px", 
                  borderRadius: "8px",
                  border: "1px solid #dc3545"
                }}>
                  <div style={{ fontSize: "0.85rem", marginBottom: "8px", color: "#dc3545", fontWeight: "600" }}>
                    Suggested follow-up questions:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {followUps.map((q, idx) => (
                      <Badge
                        key={idx}
                        bg="dark"
                        style={{
                          cursor: "pointer",
                          padding: "8px 12px",
                          fontSize: "0.8rem",
                          backgroundColor: "#2a2a2a",
                          color: "#e0e0e0",
                          border: "1px solid #dc3545",
                          borderRadius: "6px",
                          whiteSpace: "normal",
                          textAlign: "left",
                          maxWidth: "100%",
                          wordWrap: "break-word"
                        }}
                        onClick={() => handleFollowUpClick(q)}
                      >
                        {q}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label style={{ color: "#e0e0e0" }}>
                    <strong>Ask a question:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="E.g., 'What issues are trending this week?'"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    disabled={loading}
                    style={{
                      backgroundColor: "#2a2a2a",
                      border: "1px solid #dc3545",
                      color: "#e0e0e0"
                    }}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button
                    type="submit"
                    disabled={loading || !userInput.trim()}
                    variant="danger"
                    style={{
                      backgroundColor: "#dc3545",
                      border: "none",
                      fontWeight: "600"
                    }}
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
