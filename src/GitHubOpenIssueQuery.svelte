<!-- GitHubOpenIssueQuery.svelte -->
<script context="module">
  import gql from "graphql-tag";
  import { auth, client } from "./apollo";

  const GIT_HUB_OPEN_ISSUE_QUERY = gql`
    query GitHubOpenIssue {
      gitHub {
        repository(name: "blog", owner: "sgrove") {
          issues(
            first: 10
            orderBy: { field: CREATED_AT, direction: DESC }
            states: OPEN
          ) {
            nodes {
              id
              number
              title
              url
              comments(first: 10) {
                edges {
                  node {
                    body
                    author {
                      login
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  export async function preload() {
    return {
      cache: await client.query({
        query: GIT_HUB_OPEN_ISSUE_QUERY,
        errorPolicy: "all",
      }),
    };
  }
</script>

<script>
  import { restore, query } from "svelte-apollo";
  import CheckLogin from './CheckLogin.svelte'

  export let cache;
  restore(client, GIT_HUB_OPEN_ISSUE_QUERY, cache.data);

  const request = query(client, {
    query: GIT_HUB_OPEN_ISSUE_QUERY,
    variables: {},
    errorPolicy: "all",
  });

  async function handleLogin(service) {
    await auth.login(service);
    const isLoggedIn = await auth.isLoggedIn(service);
    if (isLoggedIn) {
      request.refetch();
    }
  }
</script>

<div>
  <h2>GitHubOpenIssueQuery</h2>
  <ul>
    {#await $request}
      <li>Loading...</li>
    {:then result}
      <CheckLogin {result}>
        <pre>{JSON.stringify(result, null, 2)}</pre>
        <button on:click={() => request.refetch({ fetchPolicy: 'network-only' })}>
          Refetch
        </button>
      </CheckLogin>
    {:catch error}
      <li>Error loading articles: {error}</li>
      <button on:click={handleLogin}>Login</button>
    {/await}
  </ul>
</div>
