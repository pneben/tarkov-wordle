<script lang="ts">
	import { Icon, ChevronDoubleDown, ChevronDoubleUp } from 'svelte-hero-icons';
	import type { DataPoint, ResultItemData, ResultPointVariant } from '$lib/types/tarkovle';

	export let itemData: ResultItemData;

	export let dataPoints: DataPoint[];

	export let showLabel = true;

	const variantStyle = (variant: ResultPointVariant) => {
		switch (variant) {
			case 'false':
				return 'bg-red-600';
			case 'true':
				return 'bg-green-600';
			case 'partial-true':
				return 'bg-yellow-600';
			case 'higher':
				return 'bg-red-600';
			case 'lower':
				return 'bg-red-600';
			default:
				return 'bg-arrowtown-600';
		}
	};
</script>

<div class="flex gap-x-4 max-w-[800px] min-w-[800px] justify-center">
	<div class="flex flex-col justify-end">
		<div
			class="bg-no-repeat bg-contain bg-center flex flex-col bg-[#161616] p-1 max-w-[110px] w-[110px] outline-2 outline-offset-2 outline outline-arrowtown-900 shadow-md text-black rounded-md aspect-square"
			style="background-image: url(https://assets.tarkov.dev/{itemData.id}-512.webp);"
		>
			<div
				class="max-w-fit overflow-hidden whitespace-nowrap text-ellipsis text-white drop-shadow-[0_1.2px_1.2px_rgba(255,255,255,0.5)] z-10 text-xs"
			>
				{itemData.name}
			</div>
		</div>
	</div>
	{#each dataPoints as point}
		<div class="reveal flex flex-col gap-2">
			{#if showLabel}
				<div class="text-center">
					{point.label}
				</div>
			{/if}
			<div
				class="{variantStyle(
					point.variant
				)} flex p-3 max-w-[110px] w-[110px] outline outline-arrowtown-400 outline-offset-2 outline-2 shadow-md text-black rounded-md aspect-square"
			>
				<div class="flex flex-col relative w-full h-full align-middle">
					{#if point.variant === 'higher' || point.variant === 'lower'}
						<Icon
							class=" absolute text-black opacity-20 top-0 left-0"
							src={point.variant === 'higher' ? ChevronDoubleUp : ChevronDoubleDown}
							size={'86px'}
						/>
					{/if}
					<div class="text-white flex items-center justify-center relative w-full h-full">
						<div class="text-center {point.value.length >= 20 ? 'text-md' : 'text-xl'}">
							{point.value}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	@keyframes FadeIn {
		0% {
			opacity: 0;
			transform: scale(0.5);
			filter: grayscale(100%);
		}
		60% {
			opacity: 1;
			transform: scale(1.05);
			filter: grayscale(100%);
		}
		100% {
			transform: scale(1);
			transform: rotateY(0deg);
			filter: grayscale(0%);
		}
	}

	.reveal {
		animation: FadeIn 0.4s linear;
		animation-fill-mode: both;
	}

	.reveal:nth-child(2) {
		animation-delay: 0.5s;
	}
	.reveal:nth-child(3) {
		animation-delay: 1s;
	}
	.reveal:nth-child(4) {
		animation-delay: 1.5s;
	}
	.reveal:nth-child(5) {
		animation-delay: 2s;
	}
	.reveal:nth-child(6) {
		animation-delay: 2.5s;
	}
</style>