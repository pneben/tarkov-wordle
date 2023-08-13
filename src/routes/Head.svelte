<script lang="ts">
	import { title } from '$lib/stores/head';
</script>

<svelte:head>
	<title>{$title} {$title ? '-' : ''} Tarkovdle</title>
</svelte:head>
