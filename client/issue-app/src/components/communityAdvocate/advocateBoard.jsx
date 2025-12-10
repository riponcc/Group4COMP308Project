import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Card, Button, Form, Spinner } from "react-bootstrap";

const GET_POSTS = gql`
  query {
    issues {
      id
      title
      description
      category
      photoUrl
      createdAt
    }
  }
`;

export default function AdvocateBoard() {
  const { data, loading } = useQuery(GET_POSTS);

  if (loading) return <Spinner animation="border" variant="danger" />;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", backgroundColor: "#0d0d0d", padding: "20px", minHeight: "100vh" }}>
      <h2 style={{ color: "#ffffff", fontWeight: "bold", marginBottom: "15px" }}>Community Advocate – Engagement Board</h2>
      <p style={{ color: "#e0e0e0", fontSize: "1.1rem", marginBottom: "30px" }}>Support residents by monitoring issues and discussions.</p>

      {data.issues.map((issue) => (
        <Card key={issue.id} className="mb-3 shadow-sm" style={{ backgroundColor: "#1a1a1a", border: "2px solid #dc3545" }}>
          <Card.Body>
            <Card.Title style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.3rem" }}>{issue.title}</Card.Title>
            <Card.Subtitle style={{ color: "#aaa", fontSize: "0.95rem", marginTop: "8px" }}>
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
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
