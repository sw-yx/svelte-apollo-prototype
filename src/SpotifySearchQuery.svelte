
<!-- SpotifySearchQuery.svelte -->
<script context="module">
 import gql from "graphql-tag";
 import { auth, client } from "./apollo";
 
 const SPOTIFY_SEARCH_QUERY = gql`
fragment SpotifyTrackFragment on SpotifyTrack {
  isPlayable
  id
  name
  artists {
    id
    name
    images {
      height
      url
      width
    }
  }
}
query SpotifySearch($search: String = "win win win") {
  spotify {
    search(data: {query: $search}) {
      tracks {
        ...SpotifyTrackFragment
      }
    }
  }
}`;

  export async function preload() {
    return {
      cache: await client.query({
        query: SPOTIFY_SEARCH_QUERY,
        errorPolicy: "all",
      }),
    };
  }
</script>

<script>
  import { restore, query } from "svelte-apollo";

  export let cache, search;
  restore(client, SPOTIFY_SEARCH_QUERY, cache.data);

  const request = query(client, {
    query: SPOTIFY_SEARCH_QUERY,
    variables: {"search": search},
    errorPolicy: "all",
  });

  async function handleLogin(service) {
    await auth.login(service);
    const isLoggedIn = await auth.isLoggedIn(service);
    if (isLoggedIn) {
      request.refetch();
    }
  }

  function needsLoginService(result) {
    return auth.findMissingAuthServices(result.errors)[0];
  }
</script>

<div>
  <h2>SpotifySearchQuery</h2>
  <ul>
    {#await $request}
      <li>Loading...</li>
    {:then result}
      <pre>{JSON.stringify(result, null, 2)}</pre>
      <button on:click={() => request.refetch({fetchPolicy: 'network-only'})}>
        Refetch
      </button>
  
      {#if needsLoginService(result)}
        <button on:click={() => handleLogin(needsLoginService(result))}>
          Login to {needsLoginService(result)}
        </button>
      {/if}
    {:catch error}
      <li>Error loading articles: {error}</li>
      <button on:click={handleLogin}>Login</button>
    {/await}
  </ul>
</div>
