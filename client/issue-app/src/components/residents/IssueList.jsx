
// src/IssueList.jsx
import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Card,
  Badge,
  Spinner,
  Alert,
  Form,
  Row,
  Col,
  Button,
} from "react-bootstrap";

const GET_ISSUES = gql`
  query GetIssues($filter: IssueFilterInput) {
    issues(filter: $filter) {
      id
      title
      description
      category
      urgency
      status
      photoUrl
      createdAt
    }
  }
`;

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
];

function statusVariant(status) {
  switch (status) {
    case "OPEN":
      return "danger";
    case "IN_PROGRESS":
      return "warning";
    case "RESOLVED":
      return "success";
    case "CLOSED":
      return "secondary";
    default:
      return "primary";
  }
}

function urgencyVariant(urgency) {
  if (urgency >= 4) return "danger";
  if (urgency === 3) return "warning";
  if (urgency > 0) return "success";
  return "secondary";
}

export default function IssueList() {
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_ISSUES, {
    variables: {
      filter: {
        status: status || null,
        category: category.trim() || null,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    refetch({
      filter: {
        status: status || null,
        category: category.trim() || null,
      },
    });
  };

  if (loading && !data) {
    return (
      <div style={{ backgroundColor: "#0d0d0d", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Spinner animation="border" variant="danger" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: "#0d0d0d", minHeight: "100vh", padding: "20px" }}>
        <Alert variant="danger" className="mt-3 text-center">
          {error.message}
        </Alert>
      </div>
    );
  }

  const issues = data?.issues ?? [];

  return (
    <div style={{ backgroundColor: "#0d0d0d", padding: "20px", minHeight: "100vh" }}>
      <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
        {/* Filter Section */}
        <Card className="mb-4 shadow-sm" style={{ backgroundColor: "#1a1a1a", border: "2px solid #dc3545" }}>
          <Card.Body>
            <Card.Title className="text-center" style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.5rem" }}>Reported Issues</Card.Title>

            <Form onSubmit={handleFilterSubmit} className="mt-3">
              <Row className="g-2">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: "#ffffff", fontWeight: "500" }}>Status</Form.Label>
                    <Form.Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value || "ALL"} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: "#ffffff", fontWeight: "500" }}>Category</Form.Label>
                    <Form.Control
                      placeholder="road, lighting, flooding"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="mt-3 text-center">
                <Button type="submit" className="me-2" style={{ fontWeight: "bold" }}>
                  Apply Filters
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setStatus("");
                    setCategory("");
                    refetch({ filter: {} });
                  }}
                >
                  Clear
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* No Results */}
        {issues.length === 0 ? (
          <Alert variant="info" className="text-center" style={{ backgroundColor: "#1a1a1a", color: "#ffffff", border: "1px solid #0dcaf0" }}>
            No issues found for the selected filters.
          </Alert>
        ) : (
          issues.map((issue) => (
            <Card key={issue.id} className="mb-3 shadow-sm" style={{ backgroundColor: "#1a1a1a", border: "2px solid #28a745" }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Card.Title className="mb-1" style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.3rem" }}>
                      {issue.title}{" "}
                      <Badge bg={statusVariant(issue.status)} style={{ fontSize: "0.9rem", padding: "8px 12px" }}>
                        {issue.status}
                      </Badge>
                    </Card.Title>
                    <Card.Subtitle className="mb-2" style={{ color: "#aaa" }}>
                      {new Date(issue.createdAt).toLocaleString()}
                    </Card.Subtitle>
                  </div>

                  <div className="text-end">
                    <div className="mb-1">
                      <span style={{ color: "#ffffff", fontWeight: "bold" }}>Category:</span>{" "}
                      <Badge bg="info" style={{ fontSize: "0.9rem", padding: "6px 10px" }}>
                        {issue.category || "Uncategorized"}
                      </Badge>
                    </div>
                    <div>
                      <span style={{ color: "#ffffff", fontWeight: "bold" }}>Urgency:</span>{" "}
                      <Badge bg={urgencyVariant(issue.urgency)} style={{ fontSize: "0.9rem", padding: "6px 10px" }}>
                        {issue.urgency ?? "N/A"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Card.Text className="mt-3" style={{ color: "#e0e0e0", lineHeight: "1.6" }}>
                  {issue.description}
                </Card.Text>
                <Card.Text className="mt-3">
                  {issue.photoUrl ? (
                    <a href={issue.photoUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#dc3545", fontWeight: "bold", textDecoration: "none" }}>
                      📷 View Photo
                    </a>
                  ) : (
                    <span style={{ color: "#888" }}>No photo provided</span>
                  )}
                </Card.Text>

                
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export { GET_ISSUES };
