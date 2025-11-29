import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useQuery, gql } from '@apollo/client';
import './App.css';


// Lazy-load federated microfrontends
const UserApp = lazy(() => import('userApp/App'));        


// GraphQL query to check current logged-in user
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
    fetchPolicy: 'network-only', // always verify with gateway
  });

  useEffect(() => {
    //Handle login success from UserApp
    const handleLoginSuccess = (event) => {
      setIsLoggedIn(event.detail.isLoggedIn);
      refetch();
    };

    // Handle logout from CommunityApp
    const handleLogout = () => {
      setIsLoggedIn(false);
      refetch();
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);
    window.addEventListener('logout', handleLogout);

    // Sync initial query result
    if (!loading && !error && data?.currentUser) {
      setIsLoggedIn(true);
    }

    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
      window.removeEventListener('logout', handleLogout);
    };
  }, [loading, error, data, refetch]);

  // UI states
  if (loading) return <div className="loader">Checking authentication...</div>;
  if (error) return <div className="error">⚠️ Error: {error.message}</div>;

  return (
    <div className="App">
      <Suspense fallback={<div className="loader">Loading User Application...</div>}>
        <UserApp isLoggedIn={isLoggedIn} currentUser={data?.currentUser} />
      </Suspense>
    </div>
  );
}

export default App;

