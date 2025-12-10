import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Card, Row, Col, Spinner } from "react-bootstrap";

const GET_ANALYTICS = gql`
  query Analytics {
    issues {
      id
      status
      urgency
      category
    }
  }
`;

const AI_TRENDS = gql`
  query {
    analyzeIssue(description: "summarize all issues") {
      summary
    }
  }
`;

export default function AnalyticsDashboard() {
  const { data, loading } = useQuery(GET_ANALYTICS);
  const aiInsights = useQuery(AI_TRENDS);

  if (loading) return <Spinner animation="border" variant="danger" />;

  const issues = data.issues;

  const count = (status) => issues.filter((i) => i.status === status).length;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", backgroundColor: "#0d0d0d", padding: "20px", minHeight: "100vh" }}>
      <h2 className="mb-4" style={{ color: "#ffffff", fontWeight: "bold" }}>Municipal Staff – Analytics Dashboard</h2>

      <Row className="mb-3">
        <Col md={3}>
          <Card className="text-center shadow-sm p-3" style={{ backgroundColor: "#1a1a1a", border: "2px solid #dc3545" }}>
            <h5 style={{ color: "#f8f9fa", fontWeight: "500" }}>Open</h5>
            <h2 style={{ color: "#dc3545", fontWeight: "bold" }}>{count("OPEN")}</h2>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm p-3" style={{ backgroundColor: "#1a1a1a", border: "2px solid #ffc107" }}>
            <h5 style={{ color: "#f8f9fa", fontWeight: "500" }}>In Progress</h5>
            <h2 style={{ color: "#ffc107", fontWeight: "bold" }}>{count("IN_PROGRESS")}</h2>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm p-3" style={{ backgroundColor: "#1a1a1a", border: "2px solid #28a745" }}>
            <h5 style={{ color: "#f8f9fa", fontWeight: "500" }}>Resolved</h5>
            <h2 style={{ color: "#28a745", fontWeight: "bold" }}>{count("RESOLVED")}</h2>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm p-3" style={{ backgroundColor: "#1a1a1a", border: "2px solid #6c757d" }}>
            <h5 style={{ color: "#f8f9fa", fontWeight: "500" }}>Closed</h5>
            <h2 style={{ color: "#6c757d", fontWeight: "bold" }}>{count("CLOSED")}</h2>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm mt-4 p-3" style={{ backgroundColor: "#1a1a1a", border: "2px solid #dc3545" }}>
        <h5 style={{ color: "#dc3545", fontWeight: "bold", fontSize: "1.3rem" }}>AI Trend Summary</h5>
        <p style={{ color: "#e0e0e0", fontSize: "1rem", lineHeight: "1.6" }}>
          {aiInsights.loading
            ? "Loading AI insights..."
            : aiInsights.data?.analyzeIssue.summary}
        </p>
      </Card>
    </div>
  );
}
