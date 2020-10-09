
<!-- PreviousMutation.svelte -->
<script>
 import { restore, mutate } from "svelte-apollo";
 import { auth, client, suggestCORSSetup } from "./apollo";
 import gql from "graphql-tag";
 
 const PREVIOUS_MUTATION = gql`
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
mutation Previous {
  spotify {
    skipPreviousTrack {
      player {
        ...SpotifyPlayerFragment
      }
    }
  }
}`;

  
  let result = {};

  async function PreviousMutation() {
    try {
      result = await mutate(client, {
        mutation: PREVIOUS_MUTATION,
        variables: {},
        errorPolicy: "all",
      });
      console.log("Ran PreviousMutation", result);
    } catch (error) {
      console.error("Error in PreviousMutation", error);
      result = { error: error };
    }
  }
  async function handleLogin(service) {
    await auth.login(service);
    const isLoggedIn = await auth.isLoggedIn(service);
    if (isLoggedIn) {
      PreviousMutation();
    }
  }

  $: needsLoginService = auth.findMissingAuthServices(result.errors)[0];
</script>

<div>
  <h2>PreviousMutation</h2>
  <pre>{JSON.stringify(result, null, 2)}</pre>
  <button on:click={PreviousMutation}>Run PreviousMutation</button>
  {#if needsLoginService}
    <button on:click={() => handleLogin(needsLoginService)}>Login to
      {needsLoginService}</button>
  {/if}
  {#if result.error}
    {@html suggestCORSSetup(result.error)}
  {/if}
</div>

