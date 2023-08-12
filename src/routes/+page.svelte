<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex gap-x-10">
	<a
		href="/play/armor"
		class="card w-72 bg-base-300 drop-shadow-sm hover:drop-shadow-lg cursor-pointer transition select-none"
	>
		<figure class="bg-base-200 p-4 h-[200px]">
			<img class="w-2/3" src="https://assets.tarkov.dev/5e4abb5086f77406975c9342-512.webp" alt="" />
		</figure>
		<div class="card-body">
			<h2 class="card-title">Armors</h2>
			<p>Guess the correct armor</p>
		</div>
	</a>
	<a
		href="/play/weapon"
		class="card w-72 bg-base-300 drop-shadow-sm hover:drop-shadow-lg cursor-pointer transition select-none"
	>
		<figure class="bg-base-200 p-4 h-[200px]">
			<img src="https://assets.tarkov.dev/62972a7d91492d1a34152fbe-512.webp" alt="" />
		</figure>
		<div class="card-body">
			<h2 class="card-title">Weapons</h2>
			<p>Guess the correct weapon</p>
		</div>
	</a>
</div>
