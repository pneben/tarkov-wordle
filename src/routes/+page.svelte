<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data.weapons.items);
</script>

{#each data.weapons.items as weapon}
	<button class="btn btn-primary">{weapon.name}</button>
	{#each weapon.properties.fireModes as firemode}
		<div>{firemode}</div>
	{/each}
{/each}
