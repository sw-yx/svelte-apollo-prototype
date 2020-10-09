
<!-- AddCommentMutation.svelte -->
<script>
 import { restore, mutate } from "svelte-apollo";
 import { auth, client, suggestCORSSetup } from "./apollo";
 import gql from "graphql-tag";
 
 const ADD_COMMENT_MUTATION = gql`
mutation AddComment($body: String!) {
  gitHub {
    addComment(input: {subjectId: "MDU6SXNzdWU3MTc4NjkyMTg=", body: $body}) {
      subject {
        id
      }
      commentEdge {
        node {
          id
        }
      }
    }
  }
}`;

   // Props to be passed in
  export let body;
  let result = {};

  async function AddCommentMutation() {
    try {
      result = await mutate(client, {
        mutation: ADD_COMMENT_MUTATION,
        variables: {"body": body},
        errorPolicy: "all",
      });
      console.log("Ran AddCommentMutation", result);
    } catch (error) {
      console.error("Error in AddCommentMutation", error);
      result = { error: error };
    }
  }
  async function handleLogin(service) {
    await auth.login(service);
    const isLoggedIn = await auth.isLoggedIn(service);
    if (isLoggedIn) {
      AddCommentMutation();
    }
  }

  $: needsLoginService = auth.findMissingAuthServices(result.errors)[0];
</script>

<div>
  <h2>AddCommentMutation</h2>
  <pre>{JSON.stringify(result, null, 2)}</pre>
  <button on:click={AddCommentMutation}>Run AddCommentMutation</button>
  {#if needsLoginService}
    <button on:click={() => handleLogin(needsLoginService)}>Login to
      {needsLoginService}</button>
  {/if}
  {#if result.error}
    {@html suggestCORSSetup(result.error)}
  {/if}
</div>

