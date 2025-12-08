import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function IssueDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h2 className="mb-4">👋 Welcome, {user?.username || "Resident"}!</h2>
      <p className="text-muted mb-4">
        This is your community issue dashboard. You can report new issues or view the issues 
        you and others have posted.
      </p>

      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>📍 View Reported Issues</Card.Title>
              <Card.Text>
                Browse all issues in your neighbourhood — see status, urgency, and more.
              </Card.Text>
              <Button as={Link} to="/issues" variant="primary">
                View Issues
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>➕ Submit a New Issue</Card.Title>
              <Card.Text>
                Report potholes, broken lights, flooding, safety issues, and more.
              </Card.Text>
              <Button as={Link} to="/submit" variant="success">
                Create Issue
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
