<script>
  import FaSpinner from 'svelte-icons/fa/FaSpinner.svelte'
</script>

<style>
  .spinner {
    animation: spinner_spin 3s infinite;
    animation-timing-function: cubic-bezier(0.68, -0.55, 0.256, 1.55);
  }

  @keyframes spinner_spin {
     from {
      transform: rotate(0deg);
     }
     to {
      transform: rotate(360deg);
     }
  }
</style>

<section class="bg-gray-200 p-12 flex flex-col justify-center items-center">
  <h1 class="text-gray-500 font-bold mb-4">Loading</h1>
  <a 
    href="/app"
    class="spinner w-24 h-24 text-green-500">
    <FaSpinner />
  </a>
</section>