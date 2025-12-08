import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ResidentDashboard({ currentUser }) {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 className="mb-3">Welcome, {currentUser.username} 👋</h2>
      <p className="text-muted">Report and track issues in your neighbourhood.</p>

      <Row className="g-4 mt-1">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>📍 View My Issues</Card.Title>
              <Card.Text>Track all issues you've reported.</Card.Text>
              <Button as={Link} to="/issues" variant="primary">View Issues</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>➕ Submit New Issue</Card.Title>
              <Card.Text>Report a pothole, streetlight outage, or other problems.</Card.Text>
              <Button as={Link} to="/submit" variant="success">Submit Issue</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
