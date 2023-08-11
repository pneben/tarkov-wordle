<script lang="ts">
	import { Confetti } from 'svelte-confetti';
	import { sound } from 'svelte-sound';
	import { enhance } from '$app/forms';
	import TarkovleResult from '$lib/components';
	import type { Armor } from '$lib/models/armor.js';
	import type { DataPoint, ResultData } from '$lib/types/tarkovle';
	import grenadeSound from '$lib/assets/tarkov-grenade.mp3';

	export let data;

	export let form: ResultData;
	$: if (form) addItem(form);

	let guesses: ResultData[] = [];
	let selectedId: string;
	let guessBlocked = false;
	let showWinBanner = false;
	let search: string;
	let totalGuesses = 0;

	let filteredArmor: Armor[] = data.armors.items.filter((x) =>
		search ? x.shortName.toLowerCase() === search.toLowerCase() : true
	);

	const onAlreadyWon = () => {
		if (showWinBanner) return;
		showWinBanner = true;
		console.log(data);
		totalGuesses = data.totalGuesses || 1;
		if (data.item && data.dataPoints) {
			guesses.push({
				dataPoints: data.dataPoints,
				item: data.item,
				totalGuesses: data.totalGuesses,
				won: data.isWon
			});
			guesses = guesses;
		}
	};

	if (data.isWon) {
		onAlreadyWon();
	}

	const searchUpdate = () => {
		const tmp = data.armors.items.filter((x) =>
			search ? x.shortName.toLowerCase() === search.toLowerCase() : true
		);
		filteredArmor = tmp;
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
</script>

<div class="rounded-md border border-gray-600 p-2 mt-8">
	{#each guesses as guess, index}
		<div class="mb-4">
			<TarkovleResult showLabel={index === 0} dataPoints={guess.dataPoints} itemData={guess.item} />
		</div>
	{/each}
	{#if showWinBanner}
		<div class="reveal-banner flex flex-col items-center justify-center my-8 select-none">
			<div
				class="flex justify-center"
				use:sound={{ src: grenadeSound, events: ['click'], options: { volume: 0.25 } }}
			>
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
	<div class="{showWinBanner ? 'hidden' : 'flex'} flex-col gap-y-4 justify-center items-center">
		<form method="POST" action="?/select" use:enhance>
			<div class="dropdown">
				<input
					type="text"
					placeholder="Armor..."
					tabindex="-1"
					class="input input-bordered"
					disabled={guessBlocked}
					bind:value={search}
					on:input={searchUpdate}
				/>
				<input name="id" type="text" value={selectedId} hidden />

				<ul
					tabindex="-1"
					class=" block dropdown-content max-h-[500px] overflow-y-scroll z-[1] menu p-2 mt-2 shadow bg-base-100 rounded-box w-52"
				>
					{#each filteredArmor as armor}
						<li>
							<button formaction="?/select" on:click={() => selectArmor(armor.id)}>
								<img src={armor.image512pxLink} alt="" />
								<div>
									{armor.shortName}
								</div>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</form>
	</div>
</div>

<style>
	@keyframes RevealBanner {
		0% {
			opacity: 0;
			transform: scale(0.3);
		}

		85% {
			opacity: 1;
			transform: scale(1.1);
		}

		100% {
			transform: scale(1);
		}
	}

	.reveal-banner {
		animation-name: RevealBanner;
		animation-duration: 0.5s;
		animation-timing-function: ease;
	}
</style>
