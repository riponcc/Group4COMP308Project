import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Card, Spinner } from "react-bootstrap";

const AI_TRENDS_QUERY = gql`
  query {
    analyzeIssue(description: "trend analysis of all issues") {
      summary
      category
      urgency
    }
  }
`;

export default function TrendInsights() {
  const { data, loading } = useQuery(AI_TRENDS_QUERY);

  if (loading) return <Spinner animation="border" />;

  return (
    <div style={{ maxWidth: "750px", margin: "0 auto" }}>
      <h2 className="mb-4">Community Trend Insights</h2>

      <Card className="shadow-sm p-3">
        <h5>AI Summary of Trends</h5>
        <p>{data?.analyzeIssue?.summary}</p>
      </Card>
    </div>
  );
}
