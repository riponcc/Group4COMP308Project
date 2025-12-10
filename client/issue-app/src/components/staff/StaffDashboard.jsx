import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function StaffDashboard({ currentUser }) {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", backgroundColor: "#0d0d0d", padding: "20px", minHeight: "100vh" }}>
      <h2 className="mb-3" style={{ color: "#ffffff", fontWeight: "bold" }}>Municipal Staff Dashboard</h2>
      <p style={{ color: "#e0e0e0", fontSize: "1.1rem" }}>
        Manage city service requests, triage issues, and review analytics.
      </p>

      <Row className="g-4 mt-1">
        <Col md={6}>
          <Card className="shadow-sm" style={{ backgroundColor: "#1a1a1a", border: "2px solid #dc3545" }}>
            <Card.Body>
              <Card.Title style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.3rem" }}>🛠 Manage Issues</Card.Title>
              <Card.Text style={{ color: "#e0e0e0", fontSize: "1rem" }}>Assign, update, and close community issues.</Card.Text>
              <Button as={Link} to="/manage" variant="primary" style={{ fontWeight: "bold" }}>Open Manager</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm" style={{ backgroundColor: "#1a1a1a", border: "2px solid #28a745" }}>
            <Card.Body>
              <Card.Title style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.3rem" }}>📊 Analytics & AI Insights</Card.Title>
              <Card.Text style={{ color: "#e0e0e0", fontSize: "1rem" }}>View heatmaps, trends, and backlog analytics.</Card.Text>
              <Button as={Link} to="/analytics" variant="success" style={{ fontWeight: "bold" }}>View Analytics</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
