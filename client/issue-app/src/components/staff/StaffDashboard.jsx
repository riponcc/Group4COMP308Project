import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function StaffDashboard({ currentUser }) {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 className="mb-3">Municipal Staff Dashboard</h2>
      <p className="text-muted">
        Manage city service requests, triage issues, and review analytics.
      </p>

      <Row className="g-4 mt-1">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>🛠 Manage Issues</Card.Title>
              <Card.Text>Assign, update, and close community issues.</Card.Text>
              <Button as={Link} to="/manage" variant="primary">Open Manager</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>📊 Analytics & AI Insights</Card.Title>
              <Card.Text>View heatmaps, trends, and backlog analytics.</Card.Text>
              <Button as={Link} to="/analytics" variant="success">View Analytics</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
