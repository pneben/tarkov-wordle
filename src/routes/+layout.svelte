<script>
	import '../app.css';
	import logo from '$lib/assets/tarkovdle-logo.png';
</script>

<div class="flex w-full min-h-screen h-screen dark:bg-base-100 bg-base-200">
	<a href="/" class="w-48 m-8 absolute top-0 left-0 select-none">
		<img src={logo} alt="" />
	</a>
	<div id="content-container" class="flex w-full h-full max-h-screen items-center justify-center">
		<slot />
	</div>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.black);
	}
</style>
