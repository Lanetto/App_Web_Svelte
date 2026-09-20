<script lang="ts">
    let {data}=$props()
</script>

<h1>Il Tuo Mazzo</h1>

<div class="flex flex-wrap gap-2 p-6">
	{#each data.deck as deckCard}
		{#each Array(deckCard.quantity) as _}
			<img
				src={deckCard.imageUrl}
				alt={deckCard.name}
				class="w-24 rounded-md shadow-sm"
			/>
		{/each}
		<form method="POST" action="?/removeFromDeck">
			<input type="hidden" name="cardId" value={deckCard.cardId} />
			<button type="submit">Rimuovi</button>
		</form>
	{/each}
</div>