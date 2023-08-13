<script lang="ts">
	import { deserialize } from '$app/forms';
	import type { Item } from '$lib/types/graphql.js';
	import type { ResultDataItem } from '$lib/types/tarkovle.js';
	import { FuzzySearch } from '$lib/util/search';
	import { Confetti } from 'svelte-confetti';
	export let data;

	const fuzzySearch = new FuzzySearch<Item<null>>(data.items.items);

	let items: Item<null>[] = [];

	let selectId: string;

	let imgSrc: string = data.imgSrc;

	let showWinBanner = false;

	let totalGuesses = 1;

	let search: string = '';
	$: {
		if (search) {
			items = fuzzySearch.search(search, ['name']);
		} else {
			items = data.items.items;
		}
	}

	const selectItem = (id: string) => {
		(document.activeElement as HTMLElement)?.blur();
		selectId = id;
	};

	async function handleSubmit(this: HTMLFormElement, e: SubmitEvent) {
		const formData = new FormData(this);

		const response = await fetch(this.action, {
			method: 'POST',
			body: formData
		});

		const result = deserialize(await response.text()) as unknown as { data: ResultDataItem };

		imgSrc = result.data.imgSrc;
		showWinBanner = result.data.won;
		totalGuesses = result.data.totalGuesses;
	}
</script>

<div class="flex-col gap-y-4 justify-center items-center">
	<div class="flex justify-center mb-8">
		<img class="outline outline-primary" src={imgSrc} alt="Item" />
	</div>
	{#if showWinBanner}
		<div class="reveal-banner flex flex-col items-center justify-center my-8 select-none">
			<div class="flex justify-center">
				<Confetti x={[-0.25, -0.5]} y={[0.25, 0.5]} xSpread={0} amount={100} delay={[0, 1500]} />
				<div
					class="text-3xl mx-2 p-4 text-green-500 dark:text-green-100 font-bold dark:bg-green-500 bg-green-100 rounded-md"
				>
					Correct!
				</div>
				<Confetti x={[0.25, 0.5]} y={[0.25, 0.5]} xSpread={0} amount={100} delay={[0, 1500]} />
			</div>
			<div class="mt-2">
				It took you {totalGuesses}
				{totalGuesses > 1 ? 'guesses' : 'guess'} to finish
			</div>
		</div>
	{:else}
		<form method="POST" action="?/select" on:submit|preventDefault={handleSubmit}>
			<div class="dropdown w-full flex justify-center">
				<input
					type="text"
					placeholder="Barter Item..."
					tabindex="-1"
					class="input input-bordered input-primary w-[300px]"
					bind:value={search}
				/>
				<input name="id" type="text" value={selectId} hidden />

				<ul
					tabindex="-1"
					class="block dropdown-content w-[300px] max-h-[300px] overflow-y-scroll z-[1] menu p-2 mt-14 shadow bg-base-100 rounded-box"
				>
					{#each items as item}
						<li>
							<button class="flex" on:click={() => selectItem(item.id)}>
								<div class="font-medium">
									{item.shortName}
								</div>
								<div class="text-arrowtown-400">
									{item.name}
								</div>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</form>
	{/if}
</div>
