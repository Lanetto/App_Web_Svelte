<script lang="ts">
	
	import {enhance} from '$app/forms'


	let {data}=$props()

	let mainDeck=$derived(data.deck.filter((deckCard) => deckCard.zone==='main'));

	let extraDeck=$derived(data.deck.filter((deckCard)=>deckCard.zone==='extra'));

	let sideDeck=$derived(data.deck.filter((deckCard)=>deckCard.zone==='side'));
    
	const countCards=(list: {quantity: number}[])=>
		list.reduce((sum, deckCard)=>sum+deckCard.quantity, 0);

</script>

{#snippet zoneSection(title: string, list: typeof data.deck, limit: number, zone: string)}
	<h2 class="text-xl font-bold p-6 pb-2">{title} ({countCards(list)}/{limit})</h2>
	<div class="border border-gray-300 rounded-lg p-4 mx-6 flex flex-wrap gap-4 min-h-32">
		{#each list as deckCard}
			{#each Array(deckCard.quantity) as _}
				<div class="flex flex-col items-center gap-2">
					<img src={deckCard.imageUrl} alt={deckCard.name} class="w-24 rounded-md shadow-sm" />
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