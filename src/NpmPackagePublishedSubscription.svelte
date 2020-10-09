
<!-- NpmPackagePublishedSubscription.svelte -->
<script>
 import gql from "graphql-tag";
 import { auth, client, suggestCORSSetup } from "./apollo";
 import { subscribe } from "svelte-apollo";
 
 const NPM_PACKAGE_PUBLISHED_SUBSCRIPTION = gql`
subscription NpmPackagePublished {
  npm {
    allPublishActivity {
      package {
        id
        name
        description
      }
    }
  }
}`;

  

  const subscription = subscribe(client, {
    query: NPM_PACKAGE_PUBLISHED_SUBSCRIPTION,
    variables: {},
    errorPolicy: "all",
  });

  async function handleLogin(service) {
    await auth.login(service);
    const isLoggedIn = await auth.isLoggedIn(service);
    if (isLoggedIn) {
      console.log(
        `User logged into ${service}, restart NPM_PACKAGE_PUBLISHED_SUBSCRIPTION`
      );
    }
  }

  function needsLoginService(errors) {
    return auth.findMissingAuthServices(errors)[0];
  }
</script>

<div>
  <h2>NpmPackagePublishedSubscription</h2>
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

