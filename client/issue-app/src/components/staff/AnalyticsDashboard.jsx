import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Card, Row, Col, Spinner } from "react-bootstrap";

const GET_ANALYTICS = gql`
  query Analytics {
    issues {
      id
      status
      urgency
      category
    }
  }
`;

const AI_TRENDS = gql`
  query {
    analyzeIssue(description: "summarize all issues") {
      summary
    }
  }
`;

export default function AnalyticsDashboard() {
  const { data, loading } = useQuery(GET_ANALYTICS);
  const aiInsights = useQuery(AI_TRENDS);

  if (loading) return <Spinner animation="border" />;

  const issues = data.issues;

  const count = (status) => issues.filter((i) => i.status === status).length;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 className="mb-4">Municipal Staff – Analytics Dashboard</h2>

      <Row className="mb-3">
        <Col md={3}>
          <Card className="text-center shadow-sm p-3">
            <h5>Open</h5>
            <h2>{count("OPEN")}</h2>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm p-3">
            <h5>In Progress</h5>
            <h2>{count("IN_PROGRESS")}</h2>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm p-3">
            <h5>Resolved</h5>
            <h2>{count("RESOLVED")}</h2>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm p-3">
            <h5>Closed</h5>
            <h2>{count("CLOSED")}</h2>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm mt-4 p-3">
        <h5>AI Trend Summary</h5>
        <p>
          {aiInsights.loading
            ? "Loading AI insights..."
            : aiInsights.data?.analyzeIssue.summary}
        </p>
      </Card>
    </div>
  );
}
