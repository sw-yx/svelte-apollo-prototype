/** apollo.js */
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink, from, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { getMainDefinition } from "apollo-utilities";
import OneGraphAuth from "onegraph-auth";
import SubscriptionClient from "onegraph-subscription-client";
import ApolloClient from "apollo-client";


const APP_ID = "643ee0a8-f9ee-4217-a4b5-52ee1d2c4846"

export const auth = new OneGraphAuth({
  appId: APP_ID,oneGraphOrigin: 'https://serve.onegraph.io/'
});

const subscriptionClient = new SubscriptionClient(APP_ID, {
    oneGraphAuth: auth,
    reconnect: true,
    lazy: true,
    host: 'serve.onegraph.io'
  });


// Apollo client setup
const httpLink = new HttpLink({
  uri: `https://serve.onegraph.io/graphql?app_id=${APP_ID}`,
  fetch,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  /**
   * Add the authorization to the headers
   * over http for queries and mutation
   */
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...auth.authHeaders(),
    },
  }));

  return forward(operation);
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  subscriptionClient,
  from([authMiddleware, httpLink])
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    addTypename: true,
  }),
});

export function suggestCORSSetup(error) {
  if (
    error &&
    error.message &&
    (error.message.toLocaleLowerCase().match("cors origin") ||
      error.message.toLocaleLowerCase().match("not allowed"))
  ) {
    return `<span>
      Make sure <strong>${window.location.origin}</strong> is in your CORS origins on the
      <a href="https://www.onegraph.com/dashboard/app/${APP_ID}?add-cors-origin=${window.location.origin}" target="_blank">
        OneGraph dashboard for your app
      </a>.
    </span>`;
  } else {
    return JSON.stringify(error, null, 2);
  }
}