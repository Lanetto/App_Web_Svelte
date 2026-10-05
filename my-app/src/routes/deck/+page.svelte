<script lang="ts">
	
	import {enhance} from '$app/forms';

	import {invalidateAll} from '$app/navigation';
	import type { Zone } from '$lib/server/db/deckService.js';


	let {data}=$props()

	let mainDeck=$derived(data.deck.filter((deckCard) => deckCard.zone==='main'));

	let extraDeck=$derived(data.deck.filter((deckCard)=>deckCard.zone==='extra'));

	let sideDeck=$derived(data.deck.filter((deckCard)=>deckCard.zone==='side'));

	let showDropError = $state(false);
	let dropErrorMessage = $state('');
    
	const countCards=(list: {quantity: number}[])=>
		list.reduce((sum, deckCard)=>sum+deckCard.quantity, 0);

	function expandDeck(deck: typeof data.deck){
		const expanded: typeof data.deck = [];
		for (const card of deck){
			for (let i=0; i<card.quantity; i++){
				expanded.push(card);
			}
		}

		return expanded;
	}

	function shuffle<T>(array: T[]): T[] {
		const copy = [...array];
		for ( let i=copy.length-1; i>0; i--){
			const j= Math.floor(Math.random()* (i+1));
			[copy[i], copy[j]]=[copy[j], copy[i]];
		}

		return copy;
	}

	let drawnCards=$state<typeof data.deck>([]);

	function drawFive(){
		const expanded=expandDeck(mainDeck);
		drawnCards=shuffle(expanded).slice(0, 5);
	}

	let draggedCard:{cardId: number; zone: Zone, type: string} | null=$state(null);

	function handleDragStart(cardId: number, zone: Zone, type: string){
		draggedCard={cardId, zone, type};
	}

	function isValidMove(cardType: string, toZone: Zone): boolean {
		const isExtraDeckCard=['Fusion Monster', 'Synchro Monster', 'XYZ Monster', 'Link Monster'].includes(cardType);

		if (toZone==='main' && isExtraDeckCard) {
			return false;
		}

		if(toZone==='extra' && !isExtraDeckCard) {
			return false;
		}

		return true;
	}

	async function handleDrop(toZone: Zone) {
		if (!draggedCard) return;

		if (draggedCard.zone===toZone || !isValidMove(draggedCard.type, toZone)){
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

</script>

{#snippet zoneSection(title: string, list: typeof data.deck, limit: number, zone: Zone)}
	<h2 class="text-xl font-bold p-6 pb-2">{title} ({countCards(list)}/{limit})</h2>
	<div 
		role="region"
		aria-label="Zona drop carte"
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
						<button type="submit" class="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700">
							Rimuovi
						</button>
					</form>
				</div>
			{/each}
		{/each}
	</div>
{/snippet}

<h1 class="text-2xl font-bold p-6">Il Tuo Mazzo</h1>

{@render zoneSection('Main Deck', mainDeck, 60, 'main')}
{@render zoneSection('Extra Deck', extraDeck, 15, 'extra')}
{@render zoneSection('Side Deck', sideDeck, 15, 'side')}

<div class="p-6 ">
	<button onclick={drawFive} class="bg-amber-300 text-black px-4 py-2 rounded-md font-medium hover:bg-amber-400">
		Pesca 5 Carte
	</button>
</div>

{#if drawnCards.length>0}
	<h2 class="text-xl font-bold p-6 pb-2">Carte Pescate</h2>
	<div class="border border-gray-300 rounded-lg p-4 mx-6 grid grid-cols-10 gap-2">
		{#each drawnCards as card}
			<img src={card.imageUrl} alt={card.name} class="w-full rounded-md shadow-sm" />	
		{/each}
	</div>
{/if}

{#if showDropError}
	<div class="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg z-50">
		{dropErrorMessage}
	</div>
{/if}