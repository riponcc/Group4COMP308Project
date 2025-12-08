// export default UserComponent;
import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Alert, Button, Form, Nav, Spinner, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Auth.css";

// GraphQL Mutations
const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      role
      token
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $role: String!) {
    register(username: $username, email: $email, password: $password, role: $role) {
      id
      username
      email
      role
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

function UserComponent() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Resident",
  });

  const [activeTab, setActiveTab] = useState("login");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const user = data.login;
      if (user?.token) {
        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new CustomEvent("loginSuccess", { detail: { isLoggedIn: true } }));
      }
    },
    onError: (error) => setAuthError(error.message),
  });

  const [register] = useMutation(REGISTER_MUTATION, {
    onCompleted: () => {
      alert("Registration successful! Please log in.");
      setActiveTab("login");
    },
    onError: (error) => setAuthError(error.message),
  });

  const [logout] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new CustomEvent("logout", { detail: { isLoggedIn: false } }));
    },
  });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);

    const { username, email, password, role } = formData;

    try {
      if (activeTab === "login") {
        await login({ variables: { username, password } });
      } else {
        await register({ variables: { username, email, password, role } });
      }
    } catch (err) {
      setAuthError(err.message);
    }

    setIsSubmitting(false);
  };

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="auth-wrapper d-flex align-items-center justify-content-center">
      <Card className="auth-card shadow-lg p-4">
        <h3 className="text-center mb-3 text-primary fw-bold">
          {activeTab === "login" ? "Login to Your Account" : "Create Your Account"}
        </h3>

        {!loggedInUser ? (
          <>
            <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Nav.Item>
                <Nav.Link eventKey="login">Login</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="signup">Sign Up</Nav.Link>
              </Nav.Item>
            </Nav>

            <Form className="mt-3" onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {activeTab === "signup" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select name="role" value={formData.role} onChange={handleChange}>
                      <option value="Resident">Resident</option>
                      <option value="Staff">Municipal Staff</option>
                      <option value="Advocate">Community Advocate</option>
                    </Form.Select>
                  </Form.Group>
                </>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {authError && <Alert variant="danger">{authError}</Alert>}

              <Button type="submit" variant="primary" className="w-100 fw-bold" disabled={isSubmitting}>
                {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : activeTab === "login" ? "Login" : "Sign Up"}
              </Button>
            </Form>
          </>
        ) : (
          <div className="text-center">
            <h5 className="mb-3">Welcome, {loggedInUser.username}!</h5>
            <Button variant="danger" onClick={() => logout()} className="fw-bold w-100">
              Logout
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default UserComponent;
