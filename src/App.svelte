<!-- App.svelte -->
<script>
  import { client, suggestCORSSetup } from "./apollo";
  import { setClient } from "svelte-apollo";
  import GitHubOpenIssueQuery, {
    preload as preloadGitHubOpenIssueQuery,
  } from "./GitHubOpenIssueQuery.svelte";
  import SpotifySearchQuery, {
    preload as preloadSpotifySearchQuery,
  } from "./SpotifySearchQuery.svelte";
  import AddCommentMutation from "./AddCommentMutation.svelte";
  import PauseMutation from "./PauseMutation.svelte";
  import NextMutation from "./NextMutation.svelte";
  import PreviousMutation from "./PreviousMutation.svelte";
  import PlayMoneyTreesMutation from "./PlayMoneyTreesMutation.svelte";
  import NewIssueCommentsSubscription from "./NewIssueCommentsSubscription.svelte";
  import NpmPackagePublishedSubscription from "./NpmPackagePublishedSubscription.svelte";

  const GitHubOpenIssueQueryPreloading = preloadGitHubOpenIssueQuery();

  const SpotifySearchQueryPreloading = preloadSpotifySearchQuery();
  setClient(client);
</script>

<section>
  {#await GitHubOpenIssueQueryPreloading}
    <p>Preloading GitHubOpenIssueQuery....</p>
  {:then preloaded}
    <GitHubOpenIssueQuery {...preloaded} />
  {:catch error}
    <p>
      Error preloading GitHubOpenIssueQuery:
      {@html suggestCORSSetup(error)}
    </p>
  {/await}
  <hr />
  {#await SpotifySearchQueryPreloading}
    <p>Preloading SpotifySearchQuery....</p>
  {:then preloaded}
    <SpotifySearchQuery {...preloaded} search={'you and i dash berlin'} />
  {:catch error}
    <p>
      Error preloading SpotifySearchQuery:
      {@html suggestCORSSetup(error)}
    </p>
  {/await}
  <hr />
  <AddCommentMutation body={'Wow, so fast, so slim!'} />
  <hr />
  <PauseMutation />
  <hr />
  <NextMutation />
  <hr />
  <PreviousMutation />
  <hr />
  <PlayMoneyTreesMutation />
  <hr />
  <NewIssueCommentsSubscription repoName={'blog'} />
  <hr />
  <NpmPackagePublishedSubscription />
</section>
