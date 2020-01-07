import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { resolvers, typeDefs } from "./resolvers/resolvers";

const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: 'https://us1.prisma.sh/public-ceruleanforger-651/todo-in-react-apollo/dev',
  cache,
  resolvers,
  typeDefs
});

cache.writeData({
  data: {
    isLogin: false,
    bgcolor: "pink"
  }
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
