
// src/IssueForm.jsx
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";

const CREATE_ISSUE = gql`
  mutation CreateIssue($input: CreateIssueInput!) {
    createIssue(input: $input) {
      id
      title
      description
      category
      urgency
      status
      createdAt
    }
  }
`;

// Used for refetching after create
const GET_ISSUES = gql`
  query GetIssues($filter: IssueFilterInput) {
    issues(filter: $filter) {
      id
      title
      description
      category
      urgency
      status
      createdAt
    }
  }
`;

export default function IssueForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
    photoUrl: "",
  });

  const [successMsg, setSuccessMsg] = useState("");

  const [createIssue, { loading, error }] = useMutation(CREATE_ISSUE, {
    refetchQueries: [{ query: GET_ISSUES, variables: { filter: {} } }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      setSuccessMsg(`Issue "${data.createIssue.title}" submitted successfully!`);
    },
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccessMsg("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const input = {
      title: form.title.trim(),
      description: form.description.trim(),
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      photoUrl: form.photoUrl || null,
    };

    try {
      await createIssue({ variables: { input } });
      setForm({
        title: "",
        description: "",
        latitude: "",
        longitude: "",
        photoUrl: "",
      });
    } catch (err) {
      // handled by Apollo error state
      console.error("Create issue error:", err);
    }
  };

  return (
    <div style={{ backgroundColor: "#0d0d0d", padding: "20px", minHeight: "100vh" }}>
    <Card className="shadow-sm" style={{ backgroundColor: "#1a1a1a", border: "2px solid #dc3545", maxWidth: "800px", margin: "0 auto" }}>
      <Card.Body>
        <Card.Title className="mb-3" style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.5rem" }}>Report a Community Issue</Card.Title>
        <Card.Text className="mb-3" style={{ color: "#e0e0e0", fontSize: "1rem" }}>
          Describe what's happening in your neighbourhood. Our AI will
          automatically categorize the issue and assign an urgency level
          (1–5) for city staff.
        </Card.Text>

        {successMsg && (
          <Alert
            variant="success"
            onClose={() => setSuccessMsg("")}
            dismissible
          >
            {successMsg}
          </Alert>
        )}

        {error && (
          <Alert variant="danger">
            {error.message || "Failed to submit issue."}
          </Alert>
        )}

        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="issueTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              placeholder="e.g., Large pothole on Main Street"
              value={form.title}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="issueDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              placeholder="Provide details such as location, severity, and impact on residents."
              value={form.description}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="latitude">
                <Form.Label>Latitude (optional)</Form.Label>
                <Form.Control
                  name="latitude"
                  type="number"
                  step="0.000001"
                  placeholder="43.123456"
                  value={form.latitude}
                  onChange={onChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="longitude">
                <Form.Label>Longitude (optional)</Form.Label>
                <Form.Control
                  name="longitude"
                  type="number"
                  step="0.000001"
                  placeholder="-79.987654"
                  value={form.longitude}
                  onChange={onChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="photoUrl">
            <Form.Label>Photo URL (optional)</Form.Label>
            <Form.Control
              name="photoUrl"
              placeholder="https://example.com/photo.jpg"
              value={form.photoUrl}
              onChange={onChange}
            />
            <Form.Text className="text-muted">
              You can upload a photo to cloud storage (e.g., Imgur, Cloudinary)
              and paste the link here.
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Issue"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
    </div>
  );
}
