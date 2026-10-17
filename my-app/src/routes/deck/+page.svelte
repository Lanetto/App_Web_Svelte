<script lang="ts">
	
	import {enhance} from '$app/forms';
	import {tick} from 'svelte'

	import {invalidateAll} from '$app/navigation';
	import { type Zone, EXTRA_DECK_TYPES, GROUP_LIMITS, ZONE_LABELS, groupOf } from '$lib/deckConfig';
	import type {SubmitFunction} from '@sveltejs/kit'

	const HAND_SIZE=5;

	let {data, form}=$props()

	let mainGroupCards=$derived(data.deck.filter((c)=>groupOf(c.zone)==='main'));

	let showDropError = $state(false);
	let dropErrorMessage = $state('');
    
	const countCards=(list: {quantity: number}[])=>
		list.reduce((sum, deckCard)=>sum+deckCard.quantity, 0);

	let drawnCards=$state<typeof data.deck>([]);
	let drawnSection: HTMLElement | undefined =$state();

	async function scrollToDrawn() {
		await tick();
		drawnSection?.scrollIntoView({behavior: 'smooth', block: 'start'});
	}

	const afterDrawn: SubmitFunction = () => async ({update}) =>{
		await update();
		await scrollToDrawn();
	}

	$effect(() => {
		if (form?.message) {
			showDropErrorToast(form.message);
		}
	})

	let draggedCard:{cardId: number; zone: Zone, type: string} | null=$state(null);

	function handleDragStart(cardId: number, zone: Zone, type: string){
		draggedCard={cardId, zone, type};
		startAutoScroll();
	}

	function isValidMove(cardType: string, toZone: Zone): boolean {
		const isExtraDeckCard=EXTRA_DECK_TYPES.includes(cardType);
		const toGroup=groupOf(toZone);

		if (toGroup==='main' && isExtraDeckCard) {
			return false;
		}

		if(toGroup==='extra' && !isExtraDeckCard) {
			return false;
		}

		return true;
	}

	async function handleDrop(toZone: Zone) {
		if (!draggedCard) return;

		if (draggedCard.zone===toZone){
			draggedCard=null;
			return;
		}

		if (!isValidMove(draggedCard.type, toZone)){
			showDropErrorToast('Questa carta non può essere spostata lì')
			draggedCard=null;
			return;
		}

		const formData=new FormData();
		formData.set('cardId', String(draggedCard.cardId));
		formData.set('fromZone', draggedCard.zone);
		formData.set('toZone', toZone);

		await fetch('?/moveCard', {method: 'POST', body: formData});
		await invalidateAll();

		draggedCard=null;
	}

	function showDropErrorToast(message: string){
		dropErrorMessage=message;
		showDropError= true;

		setTimeout(() => {
			showDropError = false;
		}, 2000);
	}

	let scrollDirection=0;
	let scrollTimer: ReturnType<typeof setInterval> | null=null;

	function startAutoScroll() {
		if(scrollTimer) return;

		scrollTimer=setInterval(()=> {
			if (scrollDirection!==0){
				window.scrollBy(0, scrollDirection*15);
			}
		}, 16);
	}

	function stopAutoScroll() {
		if(scrollTimer) clearInterval(scrollTimer);
		scrollTimer=null;
		scrollDirection=0;
	}

	function handleWindowDragOver(e: DragEvent){
		if(!draggedCard) return;

		const EDGE=120;

		if (e.clientY<EDGE) {
			scrollDirection=-1;
		}
		else if (window.innerHeight-e.clientY<EDGE){
			scrollDirection=1;
		}
		else {
			scrollDirection=0;
		}
	}

	function drawProbability(copies: number, deckSize: number, hand= HAND_SIZE): number {
		if (deckSize===0 || copies===0) {
			return 0;
		}

		const n=Math.min(hand, deckSize);
		let probNone=1;

		for ( let i=0; i<n; i++){
			const remaining=deckSize-copies-i;
			if (remaining<=0) {
				probNone=0;
				break;
			}
			probNone *= remaining/(deckSize-i);

		}

		return 1-probNone;
	}

</script>

{#snippet zoneSection(zone: Zone)}
	{@const list=data.deck.filter((c)=>c.zone===zone)}
	{@const limit=zone==='extra'||zone==='side' ? GROUP_LIMITS[zone] : undefined}
	{@const showOdds=zone!== 'main' && groupOf(zone)==='main'}
	{@const odds=drawProbability(countCards(list), countCards(mainGroupCards))}
	<div class="flex items-center gap-3 p-6 pb-2">
		<h2 class="text-xl font-bold">
			{ZONE_LABELS[zone]} ({countCards(list)}{limit ? `/${limit}` : ''})
		</h2>
		{#if showOdds}
			<span class="bg-indigo-100 text-indigo-700 text-sm font-medium px-2 py-1 rounded-full">
				{(odds*100).toFixed(1)}%
			</span>
		{/if}
	</div>
	<div 
		role="region"
		aria-label="{ZONE_LABELS[zone]}"
		class="border border-gray-300 rounded-lg p-4 mx-6 grid grid-cols-10 gap-2 min-h-32"

		ondragover={(e)=>e.preventDefault()}
		ondrop={()=>handleDrop(zone)}>
		{#each list as deckCard}
			{#each Array(deckCard.quantity) as _}
				<div class="flex flex-col items-center gap-2">
					<img 
						src={deckCard.imageUrl} 
						alt={deckCard.name} 
						class="w-full rounded-md shadow-sm"
						draggable="true" 
						ondragstart={()=>handleDragStart(deckCard.cardId, zone, deckCard.type)}
						/>
					<form method="POST" action="?/removeFromDeck" use:enhance>
						<input type="hidden" name="cardId" value={deckCard.cardId} />
						<input type="hidden" name="zone" value={zone} />
						<button type="submit" class="w-full bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 truncate">
							Rimuovi
						</button>
					</form>
				</div>
			{/each}
		{/each}
	</div>
{/snippet}

<h1 class="text-2xl font-bold p-6">Il Tuo Mazzo</h1>

{@render zoneSection('main')}
{@render zoneSection('extra')}
{@render zoneSection('side')}
{@render zoneSection('engine')}
{@render zoneSection('extender')}
{@render zoneSection('starter')}
{@render zoneSection('boardbreaker')}
{@render zoneSection('handtrap')}
{@render zoneSection('misc')}

<div class="p-6 ">
	<form method="POST" action="?/drawFive" use:enhance={afterDrawn}>
		<button class="bg-amber-300 text-black px-4 py-2 rounded-md font-medium hover:bg-amber-400">
		Pesca 5 Carte
		</button>
	</form>
	<form method="POST" action="?/drawOne" use:enhance={afterDrawn}>
		<button class="bg-amber-200 text-black px-4 py-2 rounded-md font-medium hover:bg-amber-300">
			Pesca 1 Carta
		</button>
	</form>
	
</div>

{#if data.hand.length>0}
	<div bind:this={drawnSection} class="pb-16">
		<h2 class="text-xl font-bold p-6 pb-2">Carte Pescate ({data.remaining} rimaste nel mazzo)</h2>
			<div class="border border-gray-300 rounded-lg p-4 pb-2 mx-6 grid grid-cols-10 gap-2">
				{#each data.hand as card}
					<img src={card.imageUrl} alt={card.name} class="w-full rounded-md shadow-sm" />	
				{/each}
			</div>
	</div>
	
{/if}

{#if showDropError}
	<div class="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg z-50">
		{dropErrorMessage}
	</div>
{/if}

<svelte:window
	ondragover={handleWindowDragOver}
	ondragend={stopAutoScroll}
	ondrop={stopAutoScroll}
/>