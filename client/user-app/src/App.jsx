// client/user-app/src/App.jsx
import UserComponent from './UserComponent';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';

// Set up Apollo Client with HttpLink
const httpLink = new HttpLink({
  uri: 'http://localhost:4001/graphql',
  credentials: 'include'
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});


// Set up Apollo Client for the gateway
// const client = new ApolloClient({
//   uri: 'http://localhost:4000/graphql', 
//   cache: new InMemoryCache(),
//   credentials: 'include'
// });


function App() {

  return (
    <div className='App'>
      <ApolloProvider client={client}>
      
      <UserComponent  />
      </ApolloProvider>
    </div>
  );
}

export default App;

