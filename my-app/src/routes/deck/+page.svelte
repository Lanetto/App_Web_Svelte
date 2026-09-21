<script lang="ts">

	import {enhance} from '$app/forms'

    let {data}=$props()
</script>

<h1>Il Tuo Mazzo</h1>

<div class="flex flex-wrap gap-6 p-6">
	{#each data.deck as deckCard}	
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