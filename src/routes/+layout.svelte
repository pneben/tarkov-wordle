<script>
	import '../app.css';

	let screenSize;
</script>

<slot />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.black);
	}
</style>
