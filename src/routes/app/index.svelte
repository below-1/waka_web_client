<script>
  import { onMount } from 'svelte'
  import { format, formatDistanceToNow } from 'date-fns'
  import { id } from 'date-fns/locale'
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import FaCogs from 'svelte-icons/fa/FaCogs.svelte'
  import IoMdRefresh from 'svelte-icons/io/IoMdRefresh.svelte'
  import { get } from '../../commons/api'
  import rupiah from '../../commons/rupiah'
  import fdate from '../../commons/fdate'
  import '../../styles/jo-table.css'
  import HomeChart from './_comps/HomeChart.svelte';

  let ars = [];
  let aps = [];
  let sales = [];
  let purchases = [];

  function createFilter () {
    const monthIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    return {
      month: today.getMonth(),
      year: today.getFullYear(),
      monthOptions: monthIndices.map(i => {
        return {
          label: format(new Date(2010, i, 1), 'MMMM', { locale: id }),
          value: i
        }
      })
    }
  }

  const today = new Date();
  let saleFilter = createFilter();
  let purchaseFilter = createFilter();

  async function getTopAR () {
    if (!process.browser) return;
    const url = '/api/v1/ar'
    try {
      const result = await get({
        url,
        params: {
          limit: 10
        }
      })
      ars = result.items.map(it => {
        const paid = it.paid ? parseInt(it.paid) : 0
        const total = it.total ? parseInt(it.total) : 0
        const left = total - paid
        const due_date = new Date(it.due_date)
        const now = new Date()
        const daysLeft = formatDistanceToNow(due_date, { locale: id })
        const formattedDueDate = format(due_date, 'dd, MMMM yyyy', { locale: id })
        return {
          ...it,
          formattedDueDate,
          daysLeft,
          paid,
          total,
          left
        }
      });
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data piutang')
    }
  }

  async function getTopAP () {
    if (!process.browser) return;
    const url = '/api/v1/ap'
    try {
      const result = await get({
        url,
        params: {
          limit: 10
        }
      })
      aps = result.items.map(it => {
        const paid = it.paid ? parseInt(it.paid) : 0
        const total = it.total ? parseInt(it.total) : 0
        const left = total - paid
        const due_date = new Date(it.due_date)
        const now = new Date()
        const daysLeft = formatDistanceToNow(due_date, { locale: id })
        const formattedDueDate = format(due_date, 'dd, MMMM yyyy', { locale: id })
        return {
          ...it,
          formattedDueDate,
          daysLeft,
          paid,
          total,
          left
        }
      });
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data hutang')
    }
  }

  async function getSaleData () {
    const url = '/api/v1/report/sale/monthly_summary'
    try {
      const result = await get({
        url,
        params: {
          month: saleFilter.month,
          year: saleFilter.year
        }
      })
      sales = result.map(it => ({
        x: format(new Date(it.day), 'dd', { locale: id }),
        y: parseInt(it.total)
      }))
      console.log(sales)
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data pembelian')
    }
  }

  async function getPurchaseData () {
    const url = '/api/v1/report/purchase/monthly_summary'
    try {
      const result = await get({
        url,
        params: {
          month: purchaseFilter.month,
          year: purchaseFilter.year
        }
      })
      purchases = result.map(it => ({
        x: format(new Date(it.day), 'dd', { locale: id }),
        y: parseInt(it.total)
      }))
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data penjualan')
    }
  }

  onMount(async () => {
    await getTopAR();
    await getTopAP();
    await getSaleData();
    await getPurchaseData();
  })
</script>

<div class="cont">
  
  <section class="bg-white px-6 py-2">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-bold border-b-1 border-gray-300">
        Data Piutang Terbaru
      </h1>
      <a href="/app/ar" class="px-6 py-1 bg-blue-600 text-white font-bold rounded shadow">selengkapnya</a>
    </div>
    <table class="jo-table">
      <thead>
        <tr>
          <th>Nota</th>
          <th>pelanggan</th>
          <th>pegawai</th>
          <th>jumlah</th>
          <th>sudah dibayar</th>
          <th>Tersisa</th>
          <th>Jatuh Tempo</th>
        </tr>
      </thead>
      <tbody>
        {#each ars as item, i}
          <tr>
            <td>
              <a href={`/app/sale/${item.order_id}/detail`} class="just-link">#{item.order_id}</a>
            </td>
            <td>
              <a href={`/app/customer/${item.customer_id}/edit`} class="just-link">{item.customer}</a>
            </td>
            <td>
              {item.empl_name}
            </td>
            <td>{rupiah(item.total)}</td>
            <td>{rupiah(item.paid)}</td>
            <td>{rupiah(item.total - item.paid)}</td>
            <td>{ item.formattedDueDate }, { item.daysLeft }</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>

  <section class="bg-white px-6 py-2">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-bold border-b-1 border-gray-300">
        Data Hutang Terbaru
      </h1>
      <a href="/app/ap" class="px-6 py-1 bg-blue-600 text-white font-bold rounded shadow">selengkapnya</a>
    </div>
    <table class="jo-table">
      <thead>
        <tr class="capitalize">
          <th>nota</th>
          <th>Pelanggan</th>
          <th>Pegawai</th>
          <th>Jumlah</th>
          <th>Sudah Dibayar</th>
          <th>Tersisa</th>
          <th>Jatuh Tempo</th>
        </tr>
      </thead>
      <tbody>
        {#each aps as item, i}
          <tr>
            <td><a href={`/app/sale/${item.order_id}/detail`} class="just-link">#{item.order_id}</a></td>
            <td><a href={`/app/customer/${item.customer_id}/edit`} class="just-link">{item.customer}</a></td>
            <td>{item.empl_name}</td>
            <td>{rupiah(item.total)}</td>
            <td>{rupiah(item.paid)}</td>
            <td>{rupiah(item.total - item.paid)}</td>
            <td>{ item.formattedDueDate }, { item.daysLeft }</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>

  <section class="chart-container bg-white">
    <div class="flex items-center justify-between p-4">
      <h1 class="text-lg font-semibold border-b-1 border-gray-300">
        Grafik Penjualan Bulan Januari 2021
      </h1>
      <div class="flex gap-4">
        <div class="flex flex-col">
          <label class="text-xs text-gray-700">bulan</label>
          <select bind:value={saleFilter.month} class="border border-gray-300 rounded px-2 py-1 text-sm">
            {#each saleFilter.monthOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>
        <div class="flex flex-col">
          <label class="text-xs text-gray-700">Tahun</label>
          <input 
            type="number" 
            bind:value={saleFilter.year} 
            class="border border-gray-300 rounded px-2 py-1 text-sm" />
        </div>
        <button 
          on:click={async () => {
            try {
              await getSaleData();
              // updateSaleChart();
            } catch (err) {
              console.log(err)
              alert('gagal mengambil data pembelian')
            }
          }}
          class="bg-blue-500 text-white rounded border border-gray-200 px-2">
          <div class="w-6 h-6">
            <IoMdRefresh/>
          </div>
        </button>
      </div>
    </div>
    <HomeChart
      name="sales"
      data={sales}
    />
  </section>

  <section class="chart-container bg-white pa-4">
    <div class="flex items-center justify-between p-4">
      <h1 class="text-lg font-semibold border-b-1 border-gray-300">
        Grafik Pembelian Bulan Januari 2021
      </h1>
      <div class="flex gap-4">
        <div class="flex flex-col">
          <label class="text-xs text-gray-700">Bulan</label>
          <select bind:value={purchaseFilter.month} class="border border-gray-300 rounded px-2 py-1 text-sm">
            {#each purchaseFilter.monthOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>
        <div class="flex flex-col">
          <label class="text-xs text-gray-700">Tahun</label>
          <input 
            type="number" 
            bind:value={purchaseFilter.year} 
            class="border border-gray-300 rounded px-2 py-1 text-sm" />
        </div>
        <button 
          on:click={async () => {
            try {
              await getPurchaseData();
            } catch (err) {
              console.log(err)
              alert('gagal mengambil data pembelian')
            }
          }}
          class="bg-blue-500 text-white rounded border border-gray-200 px-2">
          <div class="w-6 h-6">
            <IoMdRefresh/>
          </div>
        </button>
      </div>
    </div>
    <HomeChart
      name="purchases"
      data={purchases}
    />
  </section>
</div>