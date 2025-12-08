

// export default App;

import React, { useState, useEffect, lazy, Suspense } from "react";
import { useQuery, gql } from "@apollo/client";
import "./App.css";

// Microfrontends
const UserApp = lazy(() => import("userApp/App"));      // login/register
const IssueApp = lazy(() => import("issueApp/App"));    // issue reporter

// Check logged-in user from Gateway
const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      username
    }
  }
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { loading, error, data, refetch } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    // 🔹 Handle login from UserApp
    const handleLoginSuccess = (event) => {
      setIsLoggedIn(true);
      refetch();
    };

    // 🔹 Handle logout from other apps
    const handleLogout = () => {
      setIsLoggedIn(false);
      refetch();
    };

    window.addEventListener("loginSuccess", handleLoginSuccess);
    window.addEventListener("logout", handleLogout);

    // 🔹 Initial check from GraphQL
    if (!loading && data?.currentUser) {
      setIsLoggedIn(true);
    }

    return () => {
      window.removeEventListener("loginSuccess", handleLoginSuccess);
      window.removeEventListener("logout", handleLogout);
    };
  }, [loading, data, refetch]);

  if (loading) return <div className="loader">Checking authentication...</div>;
  if (error) return <div className="error">⚠️ Error: {error.message}</div>;

  return (
    <div className="App">
      <Suspense fallback={<div className="loader">Loading Application...</div>}>
        
        {/* 🔥 If not logged in → Show User Login App */}
        {!isLoggedIn && <UserApp />}

        {/* 🔥 After login → Show Issue Management App */}
        {isLoggedIn && <IssueApp currentUser={data?.currentUser} />}
      
      </Suspense>
    </div>
  );
}

export default App;
