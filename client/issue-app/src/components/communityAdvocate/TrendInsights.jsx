import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { Card, Spinner, Badge, Accordion, Row, Col } from "react-bootstrap";

const GET_ALL_ISSUES = gql`
  query {
    issues {
      id
      title
      description
      category
      urgency
      status
      createdAt
    }
  }
`;

export default function TrendInsights() {
  const { data, loading } = useQuery(GET_ALL_ISSUES);
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [trendSummary, setTrendSummary] = useState("");

  useEffect(() => {
    // Fetch chat history from analytics-ai service
    fetch("http://localhost:5005/ai/chat-history")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setChatHistory(data.history);
        }
        setLoadingHistory(false);
      })
      .catch((err) => {
        console.error("Error fetching chat history:", err);
        setLoadingHistory(false);
      });
  }, []);

  useEffect(() => {
    // Generate AI summary when issues are loaded
    if (data?.issues && data.issues.length > 0) {
      generateTrendSummary(data.issues);
    }
  }, [data]);

  const generateTrendSummary = async (issues) => {
    try {
      const summaryText = `Analyze these ${issues.length} community issues and provide insights on:
1. Most common issue categories
2. Areas needing urgent attention (urgency >= 4)
3. Current status distribution
4. Emerging patterns or clusters
5. Recommended actions for advocates

Issues: ${issues.map(i => `${i.title} (${i.category}, urgency: ${i.urgency}, status: ${i.status})`).join('; ')}`;

      const response = await fetch("http://localhost:5005/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: summaryText, sessionId: "advocate-trends" }),
      });

      const result = await response.json();
      if (result.answer) {
        setTrendSummary(result.answer);
      }
    } catch (err) {
      console.error("Error generating trend summary:", err);
      setTrendSummary("Unable to generate AI summary at this time.");
    }
  };

  const calculateStats = () => {
    if (!data?.issues) return null;

    const issues = data.issues;
    const total = issues.length;
    const open = issues.filter(i => i.status === "OPEN").length;
    const inProgress = issues.filter(i => i.status === "IN_PROGRESS").length;
    const resolved = issues.filter(i => i.status === "RESOLVED").length;
    const urgent = issues.filter(i => i.urgency >= 4).length;

    const categories = {};
    issues.forEach(i => {
      const cat = i.category || "Uncategorized";
      categories[cat] = (categories[cat] || 0) + 1;
    });

    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];

    return { total, open, inProgress, resolved, urgent, topCategory, categories };
  };

  const stats = calculateStats();

  if (loading || loadingHistory) return <Spinner animation="border" />;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", backgroundColor: "#0d0d0d", padding: "20px", minHeight: "100vh" }}>
      <h2 className="mb-4" style={{ color: "#f8f9fa" }}>Community Trend Insights</h2>

      {/* Quick Stats */}
      {stats && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center p-3" style={{ backgroundColor: "#1a1a1a", border: "2px solid #dc3545" }}>
              <h3 style={{ color: "#dc3545", fontWeight: "bold" }}>{stats.total}</h3>
              <small style={{ color: "#f8f9fa", fontWeight: "500" }}>Total Issues</small>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center p-3" style={{ backgroundColor: "#1a1a1a", border: "2px solid #ffc107" }}>
              <h3 style={{ color: "#ffc107", fontWeight: "bold" }}>{stats.open}</h3>
              <small style={{ color: "#f8f9fa", fontWeight: "500" }}>Open</small>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center p-3" style={{ backgroundColor: "#1a1a1a", border: "2px solid #17a2b8" }}>
              <h3 style={{ color: "#17a2b8", fontWeight: "bold" }}>{stats.inProgress}</h3>
              <small style={{ color: "#f8f9fa", fontWeight: "500" }}>In Progress</small>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center p-3" style={{ backgroundColor: "#1a1a1a", border: "2px solid #ff4757" }}>
              <h3 style={{ color: "#ff4757", fontWeight: "bold" }}>{stats.urgent}</h3>
              <small style={{ color: "#f8f9fa", fontWeight: "500" }}>Urgent</small>
            </Card>
          </Col>
        </Row>
      )}

      {/* AI Summary of Trends */}
      <Card className="shadow-sm p-4 mb-4" style={{ backgroundColor: "#1a1a1a", border: "2px solid #dc3545" }}>
        <h5 style={{ color: "#dc3545", marginBottom: "20px", fontWeight: "bold", fontSize: "1.3rem" }}>
          📊 AI-Generated Trend Analysis
        </h5>
        
        {trendSummary ? (
          <div style={{ 
            color: "#ffffff", 
            lineHeight: "1.8",
            whiteSpace: "pre-wrap",
            backgroundColor: "#0d0d0d",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #444",
            fontSize: "1rem"
          }}>
            {trendSummary}
          </div>
        ) : (
          <div className="text-center py-4" style={{ backgroundColor: "#0d0d0d", borderRadius: "8px" }}>
            <Spinner animation="border" variant="danger" size="sm" />
            <p style={{ color: "#f8f9fa", marginTop: "10px" }}>Analyzing community issues...</p>
          </div>
        )}

        {stats && stats.topCategory && (
          <div className="mt-4">
            <Badge bg="danger" style={{ fontSize: "0.9rem", padding: "8px 12px", marginRight: "10px" }}>
              Top Category: {stats.topCategory[0]} ({stats.topCategory[1]} issues)
            </Badge>
            <Badge bg="warning" text="dark" style={{ fontSize: "0.9rem", padding: "8px 12px" }}>
              Resolved Rate: {Math.round((stats.resolved / stats.total) * 100)}%
            </Badge>
          </div>
        )}
      </Card>

      {/* Chat History */}
      <Card className="shadow-sm p-3" style={{ backgroundColor: "#1a1a1a", border: "2px solid #dc3545" }}>
        <h5 style={{ color: "#dc3545", fontWeight: "bold", fontSize: "1.3rem" }}>💬 AI Chatbot Query History</h5>
        <p style={{ color: "#e0e0e0", marginBottom: "15px" }}>
          Recent questions asked by residents and staff to the AI assistant
        </p>

        {chatHistory.length === 0 ? (
          <p style={{ color: "#f8f9fa", textAlign: "center", padding: "20px", backgroundColor: "#0d0d0d", borderRadius: "8px" }}>
            No chat history available yet
          </p>
        ) : (
          <Accordion>
            {chatHistory.map((item, index) => (
              <Accordion.Item 
                key={index} 
                eventKey={index.toString()}
                style={{ backgroundColor: "#0d0d0d", border: "1px solid #555", marginBottom: "10px", borderRadius: "4px" }}
              >
                <Accordion.Header style={{ backgroundColor: "#0d0d0d" }}>
                  <div style={{ width: "100%" }}>
                    <Badge bg="secondary" className="me-2" style={{ fontSize: "0.85rem", padding: "6px 10px" }}>
                      {new Date(item.timestamp).toLocaleString()}
                    </Badge>
                    <span style={{ color: "#ffffff", fontWeight: "500" }}>
                      {item.question.substring(0, 60)}
                      {item.question.length > 60 ? "..." : ""}
                    </span>
                  </div>
                </Accordion.Header>
                <Accordion.Body style={{ backgroundColor: "#0d0d0d", color: "#ffffff", border: "none" }}>
                  <div className="mb-3" style={{ padding: "10px", backgroundColor: "#1a1a1a", borderRadius: "6px" }}>
                    <strong style={{ color: "#dc3545", fontSize: "1rem" }}>Question:</strong>
                    <p className="mt-2" style={{ color: "#ffffff", lineHeight: "1.6" }}>{item.question}</p>
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "#1a1a1a", borderRadius: "6px" }}>
                    <strong style={{ color: "#28a745", fontSize: "1rem" }}>AI Response:</strong>
                    <p className="mt-2" style={{ color: "#ffffff", lineHeight: "1.6" }}>{item.answer}</p>
                  </div>
                  <div className="mt-3">
                    <Badge bg="info" style={{ fontSize: "0.85rem", padding: "6px 10px" }}>
                      Session: {item.sessionId}
                    </Badge>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Card>
    </div>
  );
}
