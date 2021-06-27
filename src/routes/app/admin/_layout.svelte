<script>
  import { onMount, getContext } from 'svelte'
  import Unauthorized from '../_comps/Unauthorized.svelte'
  import Loading from '../_comps/Loading.svelte'

  const { getRole } = getContext('user')
  let role = 'LOADING'

  onMount(() => {
    role = getRole()    
  })
</script>

{#if role == 'ADMIN'}
  <slot></slot>
{:else if role == 'LOADING'}
  <Loading />
{:else}
  <Unauthorized />
{/if}
