<script lang="ts">
    let {data}=  $props() ;
</script>

<h1>Catalogo Carte</h1>
<p>Qui mostreremo il catalogo delle carte</p>

{#each data.cards as card}
    <div>
        <img src={card.card_images[0].image_url_small} alt={card.name}/>
        <p>{card.name}</p>
    </div>
{/each}