<!-- PlayMoneyTreesMutation.svelte -->
<script>
  import { restore, mutate } from "svelte-apollo";
  import { auth, client, suggestCORSSetup } from "./apollo";
  import gql from "graphql-tag";
  import CheckLogin from './CheckLogin.svelte'
  const PLAY_MONEY_TREES_MUTATION = gql`
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
    mutation PlayMoneyTrees {
      spotify {
        playTrack(input: { trackIds: "2HbKqm4o0w5wEeEFXm2sD4" }) {
          player {
            ...SpotifyPlayerFragment
          }
        }
      }
    }
  `;

  let result = {};

  async function PlayMoneyTreesMutation() {
    try {
      result = await mutate(client, {
        mutation: PLAY_MONEY_TREES_MUTATION,
        variables: {},
        errorPolicy: "all",
      });
      console.log("Ran PlayMoneyTreesMutation", result);
    } catch (error) {
      console.error("Error in PlayMoneyTreesMutation", error);
      result = { error: error };
    }
  }
</script>

<div>
  <h2>PlayMoneyTreesMutation</h2>
  <pre>{JSON.stringify(result, null, 2)}</pre>
  <button on:click={PlayMoneyTreesMutation}>Run PlayMoneyTreesMutation</button>
  <CheckLogin {result} />
</div>
