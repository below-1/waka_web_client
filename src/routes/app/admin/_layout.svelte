<script>
  import { onMount, getContext } from 'svelte'
  import Unauthorized from '../_comps/Unauthorized.svelte'
  import Loading from '../_comps/Loading.svelte'

  const { role } = getContext('user')
</script>

{#if role == 'ADMIN'}
  <slot></slot>
{:else if role == 'LOADING'}
  <Loading />
{:else}
  <Unauthorized />
{/if}
