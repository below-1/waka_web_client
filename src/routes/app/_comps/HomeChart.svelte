<script>
  import Bar from "svelte-chartjs/src/Bar.svelte"
  import { onMount } from 'svelte'
  import { format } from 'date-fns'
  import { id } from 'date-fns/locale'
  import rupiah from '../../../commons/rupiah'

  function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
  }

  export let name;
  export let data = {};
  export let height = 350;
  export let color = '#60A5FA';
  let inBrowser = false;

  $: chartData = calculateChartData(data);

  function calculateChartData (data) {
    const labels = data.map(it => it.x)
    const datasets = [
      {
        label: name,
        data: data.map(it => it.y),
        backgroundColor: color
      }
    ]
    const result = {
      labels,
      datasets,
      height
    }
    console.log('result')
    console.log(result)
    return result
  }

  onMount(() => {
    inBrowser = true;
  })
</script>

{#if inBrowser}
  <Bar data={chartData} options={{
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          callback: function (value, index, values) {
            return kFormatter(value)
          }
        }
      }]
    }
  }} />
{/if}