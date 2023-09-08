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

<div
	class="tarkovdle-result-wrapper flex gap-x-4 md:max-w-[800px] md:min-w-[800px] max-w-[900px] justify-center"
>
	<div class="reveal-fadein flex flex-col justify-end">
		<div
			class="bg-no-repeat bg-contain bg-center flex flex-col bg-[#161616] p-1 md:max-w-[110px] md:w-[110px] w-[80px] max-w-[80px] outline-2 outline-offset-2 outline outline-arrowtown-900 shadow-md text-black rounded-md aspect-square"
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
		<div class="reveal-grayscale flex flex-col gap-2">
			{#if showLabel}
				<div class="text-center">
					{point.label}
				</div>
			{/if}
			<div
				class="{variantStyle(
					point.variant
				)} flex p-3 md:max-w-[110px] md:w-[110px] w-[80px] max-w-[80px] outline outline-arrowtown-400 outline-offset-2 outline-2 shadow-md text-black rounded-md aspect-square"
			>
				<div class="flex flex-col relative w-full h-full align-middle">
					{#if point.variant === 'higher' || point.variant === 'lower'}
						<Icon
							class=" absolute text-black opacity-20 top-0 left-0"
							src={point.variant === 'higher' ? ChevronDoubleUp : ChevronDoubleDown}
							size={'100%'}
						/>
					{/if}
					<div class="text-white flex items-center justify-center relative p-1 w-full h-full">
						<div
							class="text-center {point.value.length >= 20
								? 'md:text-md text-xs'
								: 'md:text-xl text-md'}"
						>
							{point.value}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	@keyframes FadeInGrayScale {
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

	@keyframes FadeIn {
		0% {
			opacity: 0;
			transform: scale(0.5);
		}
		60% {
			opacity: 1;
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
			transform: rotateY(0deg);
		}
	}

	.reveal-fadein {
		animation: FadeIn 0.4s linear;
		animation-fill-mode: both;
	}

	.reveal-grayscale {
		animation: FadeInGrayScale 0.4s linear;
		animation-fill-mode: both;
	}

	.reveal-grayscale:nth-child(2) {
		animation-delay: 0.5s;
	}
	.reveal-grayscale:nth-child(3) {
		animation-delay: 1s;
	}
	.reveal-grayscale:nth-child(4) {
		animation-delay: 1.5s;
	}
	.reveal-grayscale:nth-child(5) {
		animation-delay: 2s;
	}
	.reveal-grayscale:nth-child(6) {
		animation-delay: 2.5s;
	}
</style>
