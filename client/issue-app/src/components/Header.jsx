// issue-app/src/Header.jsx
import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

const httpLink = new HttpLink({
  uri: "http://localhost:4001/graphql",
  credentials: "include",
});

const authClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default function Header() {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const handleLogout = async () => {
    try {
      await authClient.mutate({ mutation: LOGOUT_MUTATION });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.dispatchEvent(new CustomEvent("logout"));

      alert("Logged out successfully!");
    } catch (err) {
      console.error("Logout Error:", err);
      alert("Logout failed");
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Issue Management
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">

            {/* ---------------- RESIDENT MENU ---------------- */}
            {user?.role === "Resident" && (
              <>
                <Nav.Link as={Link} to="/">Resident Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/issues">My Issues</Nav.Link>
                <Nav.Link as={Link} to="/submit">Submit Issue</Nav.Link>
                <Nav.Link as={Link} to="/resident-ai">AI Assistant</Nav.Link>

              </>
            )}

            {/* ---------------- STAFF MENU ---------------- */}
            {user?.role === "Staff" && (
              <>
                <Nav.Link as={Link} to="/">Staff Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/manage">Manage Issues</Nav.Link>
                <Nav.Link as={Link} to="/analytics">Analytics</Nav.Link>
                <Nav.Link as={Link} to="/staff-ai">AI Assistant</Nav.Link>

              </>
            )}

            {/* ---------------- ADVOCATE MENU ---------------- */}
            {user?.role === "Advocate" && (
              <>
                <Nav.Link as={Link} to="/">Advocate Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/community">Community Board</Nav.Link>
                <Nav.Link as={Link} to="/trends">Trend Insights</Nav.Link>
                <Nav.Link as={Link} to="/advocate-ai">AI Assistant</Nav.Link>

              </>
            )}

          </Nav>

          <div className="d-flex align-items-center">
            {user && (
              <Navbar.Text className="text-light me-3">
                👋 {user.username} <small>({user.role})</small>
              </Navbar.Text>
            )}
            <Button onClick={handleLogout} size="sm" variant="outline-danger">
              Logout
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
