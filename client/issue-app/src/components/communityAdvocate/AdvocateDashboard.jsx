import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AdvocateDashboard({ currentUser }) {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", backgroundColor: "#0d0d0d", padding: "20px", minHeight: "100vh" }}>
      <h2 className="mb-3" style={{ color: "#ffffff", fontWeight: "bold" }}>Community Advocate Dashboard</h2>
      <p style={{ color: "#e0e0e0", fontSize: "1.1rem" }}>
        Support your community by monitoring issues and trends.
      </p>

      <Row className="g-4 mt-1">
        <Col md={6}>
          <Card className="shadow-sm" style={{ backgroundColor: "#1a1a1a", border: "2px solid #dc3545" }}>
            <Card.Body>
              <Card.Title style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.3rem" }}>💬 Community Board</Card.Title>
              <Card.Text style={{ color: "#e0e0e0", fontSize: "1rem" }}>View discussions, comments, and resident feedback.</Card.Text>
              <Button as={Link} to="/community" variant="primary" style={{ fontWeight: "bold" }}>Open Board</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm" style={{ backgroundColor: "#1a1a1a", border: "2px solid #28a745" }}>
            <Card.Body>
              <Card.Title style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.3rem" }}>📈 Trend Insights (AI)</Card.Title>
              <Card.Text style={{ color: "#e0e0e0", fontSize: "1rem" }}>Analyze issue patterns and neighborhood trends.</Card.Text>
              <Button as={Link} to="/trends" variant="success" style={{ fontWeight: "bold" }}>View Trends</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
