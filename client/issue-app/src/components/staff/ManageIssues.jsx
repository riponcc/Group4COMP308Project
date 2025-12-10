import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  Card,
  Button,
  Spinner,
  Form,
  Row,
  Col,
  Badge,
} from "react-bootstrap";

const GET_ALL_ISSUES = gql`
  query {
    issues {
      id
      title
      description
      status
      urgency
      category
      photoUrl
      createdAt
    }
  }
`;

const UPDATE_STATUS = gql`
  mutation UpdateStatus($id: ID!, $status: IssueStatus!) {
    updateIssueStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export default function ManageIssues() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_ISSUES);

  const [updateStatus] = useMutation(UPDATE_STATUS, {
    onCompleted: () => refetch()
  });

  if (loading) return <Spinner animation="border" variant="danger" />;
  if (error) return <p style={{ color: "#dc3545", textAlign: "center", marginTop: "20px" }}>{error.message}</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", backgroundColor: "#0d0d0d", padding: "20px", minHeight: "100vh" }}>
      <h2 className="mb-4" style={{ color: "#ffffff", fontWeight: "bold" }}>Municipal Staff – Issue Management</h2>

      {data.issues.map((issue) => (
        <Card key={issue.id} className="mb-3 shadow-sm" style={{ backgroundColor: "#1a1a1a", border: "2px solid #dc3545" }}>
          <Card.Body>
            <Card.Title style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.3rem" }}>
              {issue.title}{" "}
              <Badge bg="info" style={{ fontSize: "0.9rem" }}>{issue.category || "Uncategorized"}</Badge>
            </Card.Title>

            <Card.Subtitle style={{ color: "#aaa", marginTop: "8px" }}>
              {new Date(issue.createdAt).toLocaleString()}
            </Card.Subtitle>

            <Card.Text className="mt-2" style={{ color: "#e0e0e0", lineHeight: "1.6" }}>{issue.description}</Card.Text>
            <Card.Text className="mt-3">
                              {issue.photoUrl ? (
                                <a href={issue.photoUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#dc3545", fontWeight: "bold", textDecoration: "none" }}>
                                  📷 View Photo
                                </a>
                              ) : (
                                <span style={{ color: "#888" }}>No photo provided</span>
                              )}
                            </Card.Text>

            <Row className="mt-3">
              <Col md={6}>
                <Form.Select
                  value={issue.status}
                  onChange={(e) =>
                    updateStatus({ variables: { id: issue.id, status: e.target.value } })
                  }
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </Form.Select>
              </Col>

              <Col md={6} className="text-end">
                <Badge bg="danger">Urgency: {issue.urgency ?? "N/A"}</Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
