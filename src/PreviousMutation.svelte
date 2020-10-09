<!-- PreviousMutation.svelte -->
<script>
  import { restore, mutate } from "svelte-apollo";
  import { auth, client, suggestCORSSetup } from "./apollo";
  import gql from "graphql-tag";
  import CheckLogin from './CheckLogin.svelte'
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
    }
  `;

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
</script>

<div>
  <h2>PreviousMutation</h2>
  <pre>{JSON.stringify(result, null, 2)}</pre>
  <button on:click={PreviousMutation}>Run PreviousMutation</button>
  <CheckLogin {result} />
</div>
