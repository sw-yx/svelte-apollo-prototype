
<!-- NextMutation.svelte -->
<script>
 import { restore, mutate } from "svelte-apollo";
 import { auth, client, suggestCORSSetup } from "./apollo";
 import gql from "graphql-tag";
 
 const NEXT_MUTATION = gql`
fragment SpotifyPlayerFragment on SpotifyPlayer {
  isPlaying
  progressMs
  item {
    id
    isPlayable
    name
    uri
  }
}
mutation Next {
  spotify {
    skipNextTrack {
      player {
        ...SpotifyPlayerFragment
      }
    }
  }
}`;

  
  let result = {};

  async function NextMutation() {
    try {
      result = await mutate(client, {
        mutation: NEXT_MUTATION,
        variables: {},
        errorPolicy: "all",
      });
      console.log("Ran NextMutation", result);
    } catch (error) {
      console.error("Error in NextMutation", error);
      result = { error: error };
    }
  }
  async function handleLogin(service) {
    await auth.login(service);
    const isLoggedIn = await auth.isLoggedIn(service);
    if (isLoggedIn) {
      NextMutation();
    }
  }

  $: needsLoginService = auth.findMissingAuthServices(result.errors)[0];
</script>

<div>
  <h2>NextMutation</h2>
  <pre>{JSON.stringify(result, null, 2)}</pre>
  <button on:click={NextMutation}>Run NextMutation</button>
  {#if needsLoginService}
    <button on:click={() => handleLogin(needsLoginService)}>Login to
      {needsLoginService}</button>
  {/if}
  {#if result.error}
    {@html suggestCORSSetup(result.error)}
  {/if}
</div>

