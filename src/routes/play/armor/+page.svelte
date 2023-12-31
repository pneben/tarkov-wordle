<script lang="ts">
	import { Confetti } from 'svelte-confetti';
	import { deserialize, enhance } from '$app/forms';
	import TarkovleResult from '$lib/components';
	import type { Armor } from '$lib/models/armor.js';
	import type { ResultData } from '$lib/types/tarkovle';
	import { ChevronDoubleUp, Icon } from 'svelte-hero-icons';
	import { invalidateAll } from '$app/navigation';
	import { title } from '$lib/stores/head';
	import { FuzzySearch } from '$lib/util/search.js';

	$title = 'Armor';

	export let data;

	const fuzzySearch = new FuzzySearch<Armor>(data.armors?.items || []);

	const untrackedData = Object.assign({}, data);

	export let form: ResultData;
	$: if (form) addItem(form);

	let streak = data.streak;
	let guesses: Partial<ResultData>[] = [];
	let selectedId: string;
	let guessBlocked = false;
	let showWinBanner = false;
	let armors: Armor[] = [];
	let search: string;
	$: {
		if (search) {
			armors = fuzzySearch.search(search, ['name']);
		} else {
			armors = data.armors?.items || [];
		}
	}

	let totalGuesses = 0;

	const onAlreadyWon = () => {
		if (showWinBanner) return;
		showWinBanner = true;
		totalGuesses = untrackedData.totalGuesses || 1;
		if (data.item && untrackedData.dataPoints && untrackedData.item) {
			guesses.push({
				dataPoints: untrackedData.dataPoints,
				item: untrackedData.item,
				totalGuesses: untrackedData.totalGuesses || 1,
				won: untrackedData.isWon || false
			});
			guesses = guesses;
		}
	};

	if (data.isWon) {
		onAlreadyWon();
	}

	const selectArmor = (id: string) => {
		(document.activeElement as HTMLElement)?.blur();
		selectedId = id;
	};

	const addItem = (form: ResultData) => {
		guesses.push(form);
		guesses = guesses;
		guessBlocked = true;
		setTimeout(() => {
			if (form.won) {
				showWinBanner = true;
				totalGuesses = form.totalGuesses;
				streak = form.streak;
			} else {
				guessBlocked = false;
			}
		}, 3000);
	};

	const getEmoji = () => {
		const emojis = ['🔥', '🚀', '🦉'] as const;

		return emojis[Math.floor(Math.random() * emojis.length)];
	};

	async function handleSubmit(this: HTMLFormElement, e: SubmitEvent) {
		const formData = new FormData(this);

		const response = await fetch(this.action, {
			method: 'POST',
			body: formData
		});

		const result = deserialize(await response.text()) as unknown as { data: ResultData };

		addItem(result.data);
	}

	async function handleRestart(this: HTMLFormElement, e: SubmitEvent) {
		const formData = new FormData(this);

		const response = await fetch(this.action, {
			method: 'POST',
			body: formData
		});

		invalidateAll();

		showWinBanner = false;
		guessBlocked = false;
		totalGuesses = data.totalGuesses || 0;
		guesses = [];
	}
</script>

<div class="flex flex-col h-2/3">
	<div class="{showWinBanner ? 'hidden' : 'flex'} flex-col gap-y-4 justify-center items-center">
		<form method="POST" action="?/select" on:submit|preventDefault={handleSubmit}>
			<div class="dropdown">
				<input
					type="text"
					placeholder="Armor..."
					tabindex="-1"
					class="input input-bordered input-primary w-[300px]"
					disabled={guessBlocked}
					bind:value={search}
				/>
				<input name="id" type="text" value={selectedId} hidden />

				<ul
					tabindex="-1"
					class="block dropdown-content w-[300px] max-h-[300px] overflow-y-scroll z-[1] menu p-2 mt-2 shadow bg-base-100 rounded-box"
				>
					{#each armors as armor}
						<li>
							<button class="flex" on:click={() => selectArmor(armor.id)}>
								<img class="w-[64px]" src={armor.image512pxLink} alt="" />
								<div class="text-arrowtown-400">
									{armor.name}
								</div>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</form>
	</div>
	<div
		class="flex flex-col-reverse rounded-md border border-gray-600 py-2 px-4 mt-8 w-full justify-end dark:bg-base-200 bg-base-100"
	>
		{#if !guesses.length}
			<div class="flex self-center gap-x-4">
				<Icon class="w-8  text-arrowtown-400 " src={ChevronDoubleUp} size={'86px'} />
				<div class="text-center text-3xl mt-6 mb-8 font-medium text-arrowtown-400">
					Select an Armor to begin
				</div>
				<Icon class="w-8 text-arrowtown-400 " src={ChevronDoubleUp} size={'86px'} />
			</div>
		{/if}
		{#each guesses as guess, index}
			<div class="mb-4">
				{#if guess.dataPoints?.length && guess.item}
					<TarkovleResult
						showLabel={index === guesses.length - 1}
						dataPoints={guess.dataPoints}
						itemData={guess.item}
					/>
				{/if}
			</div>
		{/each}
		{#if showWinBanner}
			<div class="reveal-banner flex flex-col items-center justify-center my-8 select-none">
				<div class="flex justify-center">
					<Confetti x={[-0.25, -0.5]} y={[0.25, 0.5]} xSpread={0} amount={100} delay={[0, 1500]} />
					<div
						class="text-3xl mx-2 p-4 text-green-500 dark:text-green-100 font-bold dark:bg-green-500 bg-green-100 rounded-md"
					>
						Correct! {getEmoji()}
					</div>
					<Confetti x={[0.25, 0.5]} y={[0.25, 0.5]} xSpread={0} amount={100} delay={[0, 1500]} />
				</div>
				<div class="mt-2">
					It took you {totalGuesses}
					{totalGuesses > 1 ? 'guesses' : 'guess'} to finish
				</div>
				<div class="mt-2 text-xl font-medium text-arrowtown-500">
					🔥 Streak {streak}
				</div>
				<form
					class="mt-4"
					method="POST"
					action="?/restart"
					on:submit|preventDefault={handleRestart}
				>
					<button class="btn btn-primary text-arrowtown-50" type="submit"> Play again </button>
				</form>
			</div>
		{/if}
	</div>
</div>
