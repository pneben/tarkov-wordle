<script lang="ts">
	import { Confetti } from 'svelte-confetti';
	import { deserialize, enhance } from '$app/forms';
	import TarkovleResult from '$lib/components';
	import type { Armor } from '$lib/models/armor.js';
	import type { ResultData } from '$lib/types/tarkovle';
	import { ChevronDoubleUp, Icon } from 'svelte-hero-icons';
	import type { Weapon } from '$lib/models/weapon.js';
	import { title } from '$lib/stores/head.js';

	$title = 'Weapon';

	export let data;

	const untrackedData = Object.assign({}, data);

	export let form: ResultData;
	$: if (form) addItem(form);

	let guesses: ResultData[] = [];
	let selectedId: string;
	let guessBlocked = false;
	let showWinBanner = false;
	let search: string;
	let totalGuesses = 0;
	let filteredWeapons: Weapon[] = untrackedData.weapons.items;

	const onAlreadyWon = () => {
		if (showWinBanner) return;
		showWinBanner = true;
		totalGuesses = untrackedData.totalGuesses || 1;
		if (data.item && untrackedData.dataPoints) {
			guesses.push({
				dataPoints: untrackedData.dataPoints,
				item: untrackedData.item,
				totalGuesses: untrackedData.totalGuesses,
				won: untrackedData.isWon
			});
			guesses = guesses;
		}
	};

	if (data.isWon) {
		onAlreadyWon();
	}

	const searchUpdate = () => {
		const tmp = untrackedData.weapons.items.filter((x) =>
			search ? x.shortName.toLowerCase() === search.toLowerCase() : true
		);
		filteredWeapons = tmp;
	};

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
</script>

<div class="flex flex-col h-2/3">
	<div class="{showWinBanner ? 'hidden' : 'flex'} flex-col gap-y-4 justify-center items-center">
		<form method="POST" action="?/select" on:submit|preventDefault={handleSubmit}>
			<div class="dropdown">
				<input
					type="text"
					placeholder="Weapon..."
					tabindex="-1"
					class="input input-bordered input-primary w-[300px]"
					disabled={guessBlocked}
					bind:value={search}
					on:input={searchUpdate}
				/>
				<input name="id" type="text" value={selectedId} hidden />

				<ul
					tabindex="-1"
					class="block dropdown-content w-[300px] max-h-[300px] overflow-y-scroll z-[1] menu p-2 mt-2 shadow bg-base-100 rounded-box"
				>
					{#each filteredWeapons as weapon}
						<li>
							<button class="flex" on:click={() => selectArmor(weapon.id)}>
								<img
									class="w-[64px]"
									src={weapon.properties?.defaultPreset?.image512pxLink || weapon.image512pxLink}
									alt=""
								/>
								<div class="text-arrowtown-400">
									{weapon.shortName}
								</div>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</form>
	</div>
	<div
		class="flex flex-col-reverse rounded-md border border-gray-600 p-2 mt-8 w-[818px] justify-end dark:bg-base-200 bg-base-100"
	>
		{#if !guesses.length}
			<div class="flex self-center gap-x-4">
				<Icon class="w-8  text-arrowtown-400 " src={ChevronDoubleUp} size={'86px'} />
				<div class="text-center text-3xl mt-6 mb-8 font-medium text-arrowtown-400">
					Select a Weapon to begin
				</div>
				<Icon class="w-8 text-arrowtown-400 " src={ChevronDoubleUp} size={'86px'} />
			</div>
		{/if}
		{#each guesses as guess, index}
			<div class="mb-4">
				<TarkovleResult
					showLabel={index === guesses.length - 1}
					dataPoints={guess.dataPoints}
					itemData={guess.item}
				/>
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
			</div>
		{/if}
	</div>
</div>
