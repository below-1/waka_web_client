<script>
	import { onMount, setContext } from 'svelte'
	import tippy from 'tippy.js';
	import 'tippy.js/dist/tippy.css';
	import TiChartBar from 'svelte-icons/ti/TiChartBar.svelte'
	import FaBars from 'svelte-icons/fa/FaBars.svelte'
	import FaMoneyCheck from 'svelte-icons/fa/FaMoneyCheck.svelte'
	import FaSignOutAlt from 'svelte-icons/fa/FaSignOutAlt.svelte'
	import FaTachometerAlt from 'svelte-icons/fa/FaTachometerAlt.svelte'
	import FaUsers from 'svelte-icons/fa/FaUsers.svelte'
	import FaUserLock from 'svelte-icons/fa/FaUserLock.svelte'
	import FaUserTie from 'svelte-icons/fa/FaUserTie.svelte'
	import FaTruckMoving from 'svelte-icons/fa/FaTruckMoving.svelte'
	import FaHandHoldingUsd from 'svelte-icons/fa/FaHandHoldingUsd.svelte'
	import FaHandHoldingHeart from 'svelte-icons/fa/FaHandHoldingHeart.svelte'
	import FaBoxes from 'svelte-icons/fa/FaBoxes.svelte'
	import FaLandmark from 'svelte-icons/fa/FaLandmark.svelte'
	import FaListOl from 'svelte-icons/fa/FaListOl.svelte'
	import FaPowerOff from 'svelte-icons/fa/FaPowerOff.svelte'
	import FaFileAlt from 'svelte-icons/fa/FaFileAlt.svelte'
	import TiDownloadOutline from 'svelte-icons/ti/TiDownloadOutline.svelte'
	import TiUploadOutline from 'svelte-icons/ti/TiUploadOutline.svelte'
	import TiCogOutline from 'svelte-icons/ti/TiCogOutline.svelte'
	import { fade } from 'svelte/transition';
	import { del_confirm } from './store'
	import { get } from '../../commons/api'

	export let segment;

	const logo_size = 24;
	const menu_slim_size = 12;
	const menu_full_size = 64;

	let is_slim = true;
	let user = {}
	function calcRole (user) {
		if (!user || !user.role) {
			return 'LOADING'
		} else {
			return user.role
		}
	}
	$: role = calcRole(user)

	setContext('user', {
		getUser: () => user,
		getRole: () => calcRole(user)
	})

	const baseMenus = [
		{ path: '/app', label: 'dashboard', icon: FaTachometerAlt },
		{ path: '/app/category', label: 'kategori barang', desc: 'pengolahan data kategori barang', icon: FaListOl },
		{ path: '/app/optype', label: 'kategori BU', desc: 'pengolahan data kategori beban usaha', icon: FaListOl },
		{ path: '/app/customer', label: 'pelanggan', desc: 'pengolahan data pelanggan', icon: FaUsers },
		{ path: '/app/supplier', label: 'supplier', desc: 'pengolahan data supplier', icon: FaTruckMoving },
		{ path: '/app/product', label: 'gudang', desc: 'pengolahan data barang', icon: FaBoxes },
		{ path: '/app/purchase', label: 'pembelian', desc: 'pengolahan data pembelian', icon: FaHandHoldingUsd },
		{ path: '/app/sale', label: 'penjualan', desc: 'pengolahan data penjualan', icon: FaHandHoldingHeart },
		{ path: '/app/opex', label: 'beban usaha', desc: 'pengolahan data beban usaha', icon: TiCogOutline },
		{ path: '/app/ar', label: 'piutang', desc: 'pengolahan data piutang', icon: TiDownloadOutline },
		{ path: '/app/ap', label: 'hutang', desc: 'pengolahan data hutang', icon: TiUploadOutline }
	]
	function filterMenus (menus, role) {
		if (role == 'ADMIN') {
			return [
				...baseMenus,
				{ path: '/app/employee', label: 'pegawai', desc: 'data pegawai', icon: FaUserLock },
				{ path: '/app/admin', label: 'admin', desc: 'data admin', icon: FaUserTie },
				{ path: '/app/report', label: 'laporan', desc: 'laporan keuangan', icon: FaFileAlt }
			]
		}
		return menus
	}
	$: menus = filterMenus(baseMenus, role)

	async function logout () {
		localStorage.removeItem('waka.token')
		window.location = '/login'
	}

	async function get_about_me () {
		try {
			user = await get({ url: '/auth/me' })
		} catch (err) {
			console.log(err)
			alert('anda belum login')
			window.location = '/login'
		}
	}

	onMount(async () => {
		tippy('[data-tippy-content]')
		await get_about_me()
	})
</script>

<nav 
	class="top-nav fixed top-0 left-0 right-0 h-12 flex items-center px-6 bg-white"
	style={`left: ${is_slim ? '3.5' : '16' }rem;`}
>
	<div class="flex-grow"></div>
	<button on:click={logout} class="apperance-none flex items-center">
		<div class="mr-2 text-sm font-bold">{user.username}</div>
		<div class="h-4 w-4">
			<FaPowerOff/>
		</div>
	</button>
</nav>

<nav 
	class="sidenav fixed bottom-0 left-0 top-0 bg-gray-900 text-gray-200"
	class:w-64="{!is_slim}"
	class:w-14="{is_slim}"
>
	<!-- <div class="flex items-center justify-center py-5">
		<img class="logo mr-2" alt="Success Kid" height="32" width="32" src="/setting.svg">
		<div class="font-bold my-2 text-lg">cendana</div>
	</div> -->
	<ul class="overflow-hidden">
		<li 
			on:click={() => {
				is_slim = !is_slim
			}}
			class="bg-indigo-900 hover:bg-gray-700 flex items-center h-12"
		>
			<div 
				class="w-14 flex items-center justify-center"
			>
				<img class="logo" alt="Success Kid" height="24" width="24" src="/setting.svg">
			</div>
			{#if !is_slim}
				<div class="font-bold my-2 text-lg">cendana</div>
			{/if}
		</li>
		{#each menus as menu}
			{#if menu.group}
				{#if !is_slim}
					<li class="py-3 pl-6 font-semibold">
						{menu.label}
					</li>
				{:else}
					<li class="w-14 h-6"></li>
				{/if}
			{:else}
			<li class="hover:bg-gray-700" data-tippy-content={menu.desc}>
				<a 
					href={menu.path} 
					class="flex items-center"
				>
					<div
						class="w-14 py-3 flex items-center justify-center text-gray-400"
					>
						<div class="w-4 h-4">
							<svelte:component this={menu.icon} />
						</div>
					</div>
					{#if !is_slim}
						<div class="text-gray-300 text-sm font-light hover:font-semibold">{menu.label}</div>
					{/if}
				</a>
			</li>
			{/if}
		{/each}
	</ul>
</nav>

<main class="pt-20 mx-6 flex flex-col"
	class:pl-14="{is_slim}"
	class:pl-64="{!is_slim}"
	style="min-height: 100vh;"
>
	<slot></slot>
</main>

{#if $del_confirm.value}
	<div
		class="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center"
		style="z-index: 100; background: rgb(250, 250, 250, 0.8);"
		transition:fade
	>
		<div class="p-6 bg-white rounded shadow-xl">
			<div 
				class="font-bold text-gray-600 text-lg"
				style="max-width: 500px;" 
			>Anda yakin akan menghapus data {$del_confirm.entity} #{$del_confirm.id}?</div>
			<div class="flex items-center mt-2">
				<button 
					on:click={$del_confirm.on_yes}
					class="apperance-none bg-red-600 text-white px-6 py-1 font-bold mr-2 rounded">ya</button>
				<button 
					class="apperance-none bg-green-600 text-white px-6 py-1 font-bold mr-2 rounded"
					on:click={() => {
						del_confirm.hide()
					}}
				>tidak</button>
			</div>
		</div>
	</div>
{/if}