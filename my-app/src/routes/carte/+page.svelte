<script lang="ts">
    let {data}=  $props() ;
</script>

<h1>Ricerca Carte</h1>

<form>
    <input 
        type="text"
        name="fname"
        placeholder="Cerca una carta"
        value={data.filters.fname ?? ''}
    />

    <select name="type">
        <option value="">Tipo di carta</option>
        <option value="Normal Monster">Mostro Normale</option>
        <option value="Effect Monster">Mostro con Effetto</option>
        <option value="Ritual Monster">Mostro Rituale</option>
        <option value="Fusion Monster">Mostro Fusione</option>
        <option value="Synchro Monster">Mostro Synchro</option>
        <option value="XYZ Monster">Mostro XYZ</option>
        <option value="Pendolum Monster">Mostro Pendolum</option>
        <option value="Link Monster">Mostro Link</option>
        <option value="Spell Card">Magia</option>
        <option value="Trap Card">Trappola</option>
    </select>

    <input
        type="number" 
        name="level"
        placeholder="Livello (0-12)"
        min="0"
        max="12"
        value={data.filters.level}
    />

    <select name="attribute">
        <option value="">Attributo</option>
        <option value="DARK">Oscurità</option>
        <option value="DIVINE">Divinità</option>
        <option value="EARTH">Terra</option>
        <option value="FIRE">Fuoco</option>
        <option value="LIGHT">Luce</option>
        <option value="WATER">Acqua</option>
        <option value="WIND">Vento</option>
    </select>

    <select name="race">
        <option value="">Tipo</option>
        <option value="Aqua">Aqua</option>
        <option value="Beast">Bestia</option>
        <option value="Beast-Warrior">Guerriero-Bestia</option>
        <option value="Creator-God">Creator-God</option>
        <option value="Cyberse">Cyberso</option>
        <option value="Dinosaur">Dinosauro</option>
        <option value="Divine-Beast">Divinità-Bestia</option>
        <option value="Dragon">Drago</option>
        <option value="Fairy">Fata</option>
        <option value="Fiend">Demone</option>
        <option value="Fish">Pesce</option>
        <option value="Insect">Insetto</option>
        <option value="Machine">Macchina</option>
        <option value="Plant">Pianta</option>
        <option value="Psychic">Psichico</option>
        <option value="Pyro">Pyro</option>
        <option value="Reptile">Rettile</option>
        <option value="Rock">Roccia</option>
        <option value="Sea Serpent">Serpente Marino</option>
        <option value="Spellcaster">Incantatore</option>
        <option value="Thunder">Tuono</option>
        <option value="Warrior">Guerriero</option>
        <option value="Winged Beast">Bestia Alata</option>
        <option value="Wyrm">Wyrm</option>
        <option value="Zombie">Zombie</option>
        <option value="Normal">Magia Normale</option>
        <option value="Field">Magia Terreno</option>
        <option value="Equip">Magia Equipaggiamento</option>
        <option value="Continuous">Magia Continua</option>
        <option value="Quick-Play">Magia Rapida</option>
        <option value="Ritual">Magia Ritual</option>
        <option value="Normal">Trappola Normale</option>
        <option value="Continuous">Trappola Continuoua</option>
        <option value="Counter">Contro-Trappola</option>
    </select>
        

    <button type="submit">Cerca</button>
</form>

{#each data.cards as card}
    <div>
        <img src={card.card_images[0].image_url_small} alt={card.name}/>
        <p>{card.name}</p>
    </div>
{/each}