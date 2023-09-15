<script>
	import '../app.css';
	import logo from '$lib/assets/tarkovdle-logo.png';
	import { navigating } from '$app/stores';
	import Head from './Head.svelte';
</script>

<Head />

<div class="flex w-full min-h-screen dark:bg-base-100 bg-base-200">
	<a href="/" class="w-48 m-8 z-50 absolute top-0 left-0 select-none">
		<img src={logo} alt="" />
	</a>
	<div
		id="content-container"
		class="flex min-h-[calc(100vh - 96px)] mt-24 w-full items-center justify-center"
	>
		{#if $navigating}
			<span class="loading loading-bars loading-lg text-primary" />
		{:else}
			<slot />
		{/if}
	</div>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.black);
	}
</style>
