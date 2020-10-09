<!-- CheckLogin.svelte-->
<script>
import { auth, suggestCORSSetup } from "./apollo";

export let result

async function handleLogin(service) {
  await auth.login(service);
  const isLoggedIn = await auth.isLoggedIn(service);
  if (isLoggedIn) {
    PauseMutation();
  }
}
function needsLoginService(result) {
  return auth.findMissingAuthServices(result.errors)[0];
}
$: _needsLogin = needsLoginService(result)
</script>


<slot></slot>
{#if _needsLogin}
  <button on:click={() => handleLogin(_needsLogin)}>Login to
    {_needsLogin}</button>
{/if}
{#if result.error}
  {@html suggestCORSSetup(result.error)}
{/if}
