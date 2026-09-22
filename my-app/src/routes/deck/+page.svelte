<script lang="ts">
	
	import {enhance} from '$app/forms'

	let {data, form}=$props()

	const extraDeckTypes=['Fusion Monster', 'Synchro Monster', 'XYZ Monster', 'Link Monster'];

	let mainDeck=$derived(data.deck.filter((deckCard) => !extraDeckTypes.includes(deckCard.type)));

	let extraDeck=$derived(data.deck.filter((deckCard)=> extraDeckTypes.includes(deckCard.type)));

    
</script>

<h1>Il Tuo Mazzo</h1>

<h2 class="text-xl font-bold p-6 pb-2">Main Deck ({mainDeck.reduce((sum, c) => sum+c.quantity, 0)})</h2>
<div class="border border-gray-300 rounded-lg p-4 mx-6 flex flex-wrap gap-4">
	{#each mainDeck as deckCard}	
		{#each Array(deckCard.quantity) as _}
			<div class="flex flex-col items-center gap-2">		
				<img
					src={deckCard.imageUrl}
					alt={deckCard.name}
					class="w-24 rounded-md shadow-sm"
				/>
				<form method="POST" action="?/removeFromDeck" use:enhance>
					<input type="hidden" name="cardId" value={deckCard.cardId} />
					<button type="submit" class="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700">Rimuovi</button>
				</form>
			</div>
		{/each}
	{/each}
</div>

<h2 class="text-xl font-bold p-6 pb-2">Extra Deck ({extraDeck.reduce((sum, c) => sum+c.quantity, 0)})</h2>
<div class="border border-gray-300 rounded-lg p-4 mx-6 flex flex-wrap gap-4">
	{#each extraDeck as deckCard}	
		{#each Array(deckCard.quantity) as _}
			<div class="flex flex-col items-center gap-2">		
				<img
					src={deckCard.imageUrl}
					alt={deckCard.name}
					class="w-24 rounded-md shadow-sm"
				/>
				<form method="POST" action="?/removeFromDeck" use:enhance>
					<input type="hidden" name="cardId" value={deckCard.cardId} />
					<button type="submit" class="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700">Rimuovi</button>
				</form>
			</div>
		{/each}
	{/each}
</div>
