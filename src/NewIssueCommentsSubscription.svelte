
<!-- NewIssueCommentsSubscription.svelte -->
<script>
 import gql from "graphql-tag";
 import { auth, client, suggestCORSSetup } from "./apollo";
 import { subscribe } from "svelte-apollo";
 
 const NEW_ISSUE_COMMENTS_SUBSCRIPTION = gql`
subscription NewIssueCommentsSubscription($repoName: String!) {
  github {
    issueCommentEvent(input: {repoOwner: "sgrove", repoName: $repoName}) {
      comment {
        body
        id
        url
      }
      action
    }
  }
}`;

  // Props to be passed in
  export let repoName;

  const subscription = subscribe(client, {
    query: NEW_ISSUE_COMMENTS_SUBSCRIPTION,
    variables: {"repoName": repoName},
    errorPolicy: "all",
  });

  async function handleLogin(service) {
    await auth.login(service);
    const isLoggedIn = await auth.isLoggedIn(service);
    if (isLoggedIn) {
      console.log(
        `User logged into ${service}, restart NEW_ISSUE_COMMENTS_SUBSCRIPTION`
      );
    }
  }

  function needsLoginService(errors) {
    return auth.findMissingAuthServices(errors)[0];
  }
</script>

<div>
  <h2>NewIssueCommentsSubscription</h2>
  <ul>
    {#await $subscription}
      <li>Loading...</li>
    {:then results}
      <li>
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </li>
    {:catch error}
      <li>
        Error loading:
        {JSON.stringify(error, null, 2)}
      </li>
      {#if needsLoginService(error)}
        <button on:click={() => handleLogin(needsLoginService(error))}>
          Login to {needsLoginService(error)}
        </button>
      {/if}
  
      {@html suggestCORSSetup(error)}
    {/await}
  </ul>
</div>

