import React from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Card, Form, Button, ListGroup } from "react-bootstrap";

const ISSUE_CHATBOT = gql`
  query IssueChatbot($input: String!) {
    issueChatbot(input: $input) {
      text
      suggestedQuestions
      retrievedIssues {
        id
        title
        description
        status
      }
    }
  }
`;

export default function IssueChatbot() {
  const [input, setInput] = React.useState("");
  const [runQuery, { called, loading, data, error }] = useLazyQuery(ISSUE_CHATBOT, {
    fetchPolicy: "no-cache",
  });

  const submit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    runQuery({ variables: { input } });
  };

  return (
    <Card className="p-3">
      <h5>Community Chatbot</h5>
      <Form onSubmit={submit}>
        <Form.Control
          placeholder="Ask about local issues, trends, or request help..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="mt-2 text-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </Button>
        </div>
      </Form>

      <div className="mt-3">
        {error && <div className="text-danger">{error.message}</div>}
        {called && loading && <div>Loading...</div>}
        {data && (
          <>
            <Card className="mt-2 p-2">
              <div style={{ whiteSpace: "pre-wrap" }}>{data.issueChatbot.text}</div>
            </Card>

            {data.issueChatbot.suggestedQuestions?.length > 0 && (
              <ListGroup className="mt-2">
                {data.issueChatbot.suggestedQuestions.map((q, i) => (
                  <ListGroup.Item key={i}>
                    <Button variant="link" size="sm" onClick={() => setInput(q)}>{q}</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}

            {data.issueChatbot.retrievedIssues?.length > 0 && (
              <>
                <h6 className="mt-3">Related issues</h6>
                <ListGroup>
                  {data.issueChatbot.retrievedIssues.map((iss) => (
                    <ListGroup.Item key={iss.id}>
                      <strong>{iss.title}</strong> — {iss.status}
                      <div className="small text-muted">{iss.description}</div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
