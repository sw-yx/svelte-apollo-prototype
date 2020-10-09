
<!-- PauseMutation.svelte -->
<script>
 import { restore, mutate } from "svelte-apollo";
 import { auth, client, suggestCORSSetup } from "./apollo";
 import gql from "graphql-tag";
 
 const PAUSE_MUTATION = gql`
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
mutation Pause {
  spotify {
    pausePlayer {
      player {
        ...SpotifyPlayerFragment
      }
    }
  }
}`;

  
  let result = {};

  async function PauseMutation() {
    try {
      result = await mutate(client, {
        mutation: PAUSE_MUTATION,
        variables: {},
        errorPolicy: "all",
      });
      console.log("Ran PauseMutation", result);
    } catch (error) {
      console.error("Error in PauseMutation", error);
      result = { error: error };
    }
  }
  async function handleLogin(service) {
    await auth.login(service);
    const isLoggedIn = await auth.isLoggedIn(service);
    if (isLoggedIn) {
      PauseMutation();
    }
  }

  $: needsLoginService = auth.findMissingAuthServices(result.errors)[0];
</script>

<div>
  <h2>PauseMutation</h2>
  <pre>{JSON.stringify(result, null, 2)}</pre>
  <button on:click={PauseMutation}>Run PauseMutation</button>
  {#if needsLoginService}
    <button on:click={() => handleLogin(needsLoginService)}>Login to
      {needsLoginService}</button>
  {/if}
  {#if result.error}
    {@html suggestCORSSetup(result.error)}
  {/if}
</div>

