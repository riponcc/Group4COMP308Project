import React from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Modal } from "react-bootstrap";

const SUMMARIZE_ISSUE = gql`
  mutation SummarizeIssue($issueId: ID!) {
    summarizeIssue(issueId: $issueId) {
      summary
      category
      urgency
      tags
    }
  }
`;

export default function IssueSummaryButton({ issueId }) {
  const [show, setShow] = React.useState(false);
  const [summaryData, setSummaryData] = React.useState(null);
  const [summarize, { loading }] = useMutation(SUMMARIZE_ISSUE, {
    onCompleted: (data) => {
      setSummaryData(data.summarizeIssue);
      setShow(true);
    },
    onError: (err) => {
      setSummaryData({ summary: "Failed to generate summary: " + err.message });
      setShow(true);
    },
  });

  const handleClick = () => summarize({ variables: { issueId } });

  return (
    <>
      <Button variant="outline-primary" onClick={handleClick} disabled={loading}>
        {loading ? "Summarizing..." : "Generate AI Summary"}
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>AI Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Summary:</strong> {summaryData?.summary}</p>
          <p><strong>Category:</strong> {summaryData?.category}</p>
          <p><strong>Urgency:</strong> {summaryData?.urgency}</p>
          <p><strong>Tags:</strong> {(summaryData?.tags || []).join(", ")}</p>
        </Modal.Body>
      </Modal>
    </>
  );
}
