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

  if (loading) return <Spinner animation="border" />;

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h2>Community Advocate – Engagement Board</h2>
      <p className="text-muted">Support residents by monitoring issues and discussions.</p>

      {data.issues.map((issue) => (
        <Card key={issue.id} className="mb-3 shadow-sm">
          <Card.Body>
            <Card.Title>{issue.title}</Card.Title>
            <Card.Subtitle className="text-muted">
              {new Date(issue.createdAt).toLocaleString()}
            </Card.Subtitle>
            <Card.Text className="mt-2">{issue.description}</Card.Text>
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
      ))}
    </div>
  );
}
