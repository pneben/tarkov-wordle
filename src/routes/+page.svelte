<script lang="ts">
	import githubWhite from '$lib/assets/github-mark-white.svg';
	import githubDefault from '$lib/assets/github-mark.svg';
	import pixelatedRoaster from '$lib/assets/pixelated-roaster.jpeg';
	import TarkovleResult from '$lib/components/TarkovleResult.svelte';

	const gamemodes = [
		{
			title: 'Armors',
			subtitle: 'Guess the correct armor',
			imgSrc: 'https://assets.tarkov.dev/5e4abb5086f77406975c9342-512.webp',
			to: '/play/armor'
		},
		{
			title: 'Weapons',
			subtitle: 'Guess the correct weapon',
			imgSrc: 'https://assets.tarkov.dev/62972a7d91492d1a34152fbe-512.webp',
			to: '/play/weapon'
		},
		{
			title: 'Barter Items',
			subtitle: 'Guess the Barter Item in an pixelated image',
			imgSrc: pixelatedRoaster,
			to: '/play/item'
		}
	];
</script>

<div class="flex flex-col justify-center items-center gap-y-6">
	<div class="flex gap-10 flex-wrap items-center justify-center">
		{#each gamemodes as mode}
			<a
				href={mode.to}
				class="card w-72 bg-base-300 drop-shadow-md hover:drop-shadow-xl cursor-pointer transition select-none"
			>
				<figure
					class="dark:bg-base-200 bg-base-300 border-b dark:border-transparent border-gray-400 p-4 h-[200px]"
				>
					<img class="h-4/5 rounded-lg" src={mode.imgSrc} alt="" />
				</figure>
				<div class="card-body">
					<h2 class="card-title">{mode.title}</h2>
					<p>{mode.subtitle}</p>
				</div>
			</a>
		{/each}
	</div>
	<div class="self-start w-10 text-arrowtown-400 m-8">
		<a href="https://github.com/pneben/tarkov-wordle" target="_blank">
			<img class="dark:hidden block" src={githubDefault} alt="" />
			<img class="dark:block hidden" src={githubWhite} alt="" />
		</a>
	</div>
</div>
