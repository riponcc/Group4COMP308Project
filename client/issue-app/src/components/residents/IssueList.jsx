
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
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3 text-center">
        {error.message}
      </Alert>
    );
  }

  const issues = data?.issues ?? [];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div style={{ width: "100%", maxWidth: "700px" }}>
        {/* Filter Section */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title className="text-center">Reported Issues</Card.Title>

            <Form onSubmit={handleFilterSubmit} className="mt-3">
              <Row className="g-2">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
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
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      placeholder="road, lighting, flooding"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="mt-3 text-center">
                <Button type="submit" className="me-2">
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
          <Alert variant="info" className="text-center">
            No issues found for the selected filters.
          </Alert>
        ) : (
          issues.map((issue) => (
            <Card key={issue.id} className="mb-3 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Card.Title className="mb-1">
                      {issue.title}{" "}
                      <Badge bg={statusVariant(issue.status)}>
                        {issue.status}
                      </Badge>
                    </Card.Title>
                    <Card.Subtitle className="text-muted mb-2">
                      {new Date(issue.createdAt).toLocaleString()}
                    </Card.Subtitle>
                  </div>

                  <div className="text-end">
                    <div className="mb-1">
                      <span className="fw-bold">Category:</span>{" "}
                      <Badge bg="info">
                        {issue.category || "Uncategorized"}
                      </Badge>
                    </div>
                    <div>
                      <span className="fw-bold">Urgency:</span>{" "}
                      <Badge bg={urgencyVariant(issue.urgency)}>
                        {issue.urgency ?? "N/A"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Card.Text className="mt-3">
                  {issue.description}
                </Card.Text>
                <Card.Text className="mt-3">
                  {issue.photoUrl ? (
                    <a href={issue.photoUrl} target="_blank" rel="noopener noreferrer">
                      View Photo
                    </a>
                  ) : (
                    "No photo provided"
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
