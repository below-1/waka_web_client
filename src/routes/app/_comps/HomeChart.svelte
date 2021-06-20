<script>
  import { onMount } from 'svelte'
  import { format } from 'date-fns'
  import { id } from 'date-fns/locale'
  import rupiah from '../../../commons/rupiah'

  export let name;
  export let data = [];
  export let height = '400px';

  var ApexCharts = null;
  let chartElement;
  let chart;

  function drawInitialChart () {
    const baseOptions = {
      chart: {
        type: 'bar',
        height: '100%'
      },
      dataLabels: {
        enabled: false
      },
      series: [],
      yaxis: {
        labels: {
          formatter: x => rupiah(x)
        }
      }
    }

    console.log(chartElement)
    chart = new ApexCharts.default(chartElement, { ...baseOptions });
    chart.render();
  }

  $: {
    if (chart && data && data.length) {
      chart.updateSeries([{
        name,
        data
      }]);
    }
  };

  onMount(async () => {
    ApexCharts = await import('apexcharts');
    drawInitialChart();
  })
</script>

<div style="height: {height};">
  <div bind:this={chartElement}></div>
</div>