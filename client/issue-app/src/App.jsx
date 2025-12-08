
// issue-app/src/App.jsx
import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// ---------------- COMPONENTS ----------------
import Header from "./components/Header.jsx";

// Resident
import IssueForm from "./components/residents/IssueForm.jsx";
import IssueList from "./components/residents/IssueList.jsx";
import ResidentDashboard from "./components/residents/ResidentDashboard.jsx";

// Staff
import ManageIssues from "./components/staff/ManageIssues.jsx";
import AnalyticsDashboard from "./components/staff/AnalyticsDashboard.jsx";
import StaffDashboard from "./components/staff/StaffDashboard.jsx";

// Advocate
import CommunityBoard from "./components/communityAdvocate/advocateBoard.jsx";
import TrendInsights from "./components/communityAdvocate/TrendInsights.jsx";
import AdvocateDashboard from "./components/communityAdvocate/AdvocateDashboard.jsx";

// ---------------- Apollo Client Setup ----------------
const httpLink = createHttpLink({
  uri: "http://localhost:4002/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const issueClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// ---------------- Helpers ----------------
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

// ⭐ CHOOSE DASHBOARD BASED ON ROLE
function getHomePage(role, user) {
  if (role === "Staff")
    return <StaffDashboard currentUser={user} />;

  if (role === "Advocate")
    return <AdvocateDashboard currentUser={user} />;

  // default → resident
  return <ResidentDashboard currentUser={user} />;
}

// ⭐ Protect Routes by Role
function ProtectedRoute({ role, element }) {
  const user = getUser();
  if (!user)
    return <h3 className="text-center mt-5">Please log in</h3>;

  if (user.role !== role)
    return <h3 className="text-center mt-5 text-danger">Access Denied</h3>;

  return element;
}

// ---------------- MAIN APP ----------------
export default function App() {
  const user = getUser();

  return (
    <ApolloProvider client={issueClient}>
      <BrowserRouter>
        <Header />

        <Container className="mt-4 mb-4">
          <Routes>
            {/* HOME PAGE (role-based) */}
            <Route path="/" element={getHomePage(user?.role, user)} />

            {/* RESIDENT ROUTES */}
            <Route path="/issues" element={<IssueList />} />
            <Route path="/submit" element={<IssueForm />} />

            {/* STAFF ROUTES (protected) */}
            <Route
              path="/manage"
              element={
                <ProtectedRoute
                  role="Staff"
                  element={<ManageIssues />}
                />
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute
                  role="Staff"
                  element={<AnalyticsDashboard />}
                />
              }
            />

            {/* ADVOCATE ROUTES (protected) */}
            <Route
              path="/community"
              element={
                <ProtectedRoute
                  role="Advocate"
                  element={<CommunityBoard />}
                />
              }
            />
            <Route
              path="/trends"
              element={
                <ProtectedRoute
                  role="Advocate"
                  element={<TrendInsights />}
                />
              }
            />
          </Routes>
        </Container>
      </BrowserRouter>
    </ApolloProvider>
  );
}
