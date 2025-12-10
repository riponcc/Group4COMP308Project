import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ResidentDashboard({ currentUser }) {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", backgroundColor: "#0d0d0d", padding: "20px", minHeight: "100vh" }}>
      <h2 className="mb-3" style={{ color: "#ffffff", fontWeight: "bold" }}>Welcome, {currentUser.username} 👋</h2>
      <p style={{ color: "#e0e0e0", fontSize: "1.1rem" }}>Report and track issues in your neighbourhood.</p>

      <Row className="g-4 mt-1">
        <Col md={6}>
          <Card className="shadow-sm" style={{ backgroundColor: "#1a1a1a", border: "2px solid #dc3545" }}>
            <Card.Body>
              <Card.Title style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.3rem" }}>📍 View My Issues</Card.Title>
              <Card.Text style={{ color: "#e0e0e0", fontSize: "1rem" }}>Track all issues you've reported.</Card.Text>
              <Button as={Link} to="/issues" variant="primary" style={{ fontWeight: "bold" }}>View Issues</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm" style={{ backgroundColor: "#1a1a1a", border: "2px solid #28a745" }}>
            <Card.Body>
              <Card.Title style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.3rem" }}>➕ Submit New Issue</Card.Title>
              <Card.Text style={{ color: "#e0e0e0", fontSize: "1rem" }}>Report a pothole, streetlight outage, or other problems.</Card.Text>
              <Button as={Link} to="/submit" variant="success" style={{ fontWeight: "bold" }}>Submit Issue</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
