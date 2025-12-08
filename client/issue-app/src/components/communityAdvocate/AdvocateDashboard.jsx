import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AdvocateDashboard({ currentUser }) {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 className="mb-3">Community Advocate Dashboard</h2>
      <p className="text-muted">
        Support your community by monitoring issues and trends.
      </p>

      <Row className="g-4 mt-1">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>💬 Community Board</Card.Title>
              <Card.Text>View discussions, comments, and resident feedback.</Card.Text>
              <Button as={Link} to="/community" variant="primary">Open Board</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>📈 Trend Insights (AI)</Card.Title>
              <Card.Text>Analyze issue patterns and neighborhood trends.</Card.Text>
              <Button as={Link} to="/trends" variant="success">View Trends</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
