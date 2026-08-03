<script lang="ts">
    let {data}=  $props() ;

    let category = $state(''); // Rendo la variabile reattiva per il tipo di carta selezionato
    let monsterSybtype=$state(''); // Rendo la variabile reattiva per il sottotipo di mostro selezionato

    // Calcola se il tipo di carta selezionato è un mostro, una magia o una trappola e aggiorna le variabili sul momento
    let isMonster=$derived(category==='Monster');
    let isSpell=$derived(category==='Spell');
    let isTrap=$derived(category==='Trap');

    let finalType=$derived.by(() => {
        if (isMonster) {
            return monsterSybtype;
        } else if (isSpell) {
            return 'Spell Card';
        } else if (isTrap) {
            return 'Trap Card';
        } else {
            return '';
        }
    });

</script>

<h1>Ricerca Carte</h1>

<form>
    <input 
        type="text"
        name="name"
        placeholder="Cerca una carta"
        value={data.filters.name ?? ''}
    />

    <select bind:value={category}>
        <option value="">Tipo di carta</option>
        <option value="Monster">Mostro</option>
        <option value="Spell">Magia</option>
        <option value="Trap">Trappola</option>
    </select>

    {#if isMonster}

    <select bind:value={monsterSybtype}>
        <option value="">Tipo di Mostro</option>
        <option value="Normal Monster">Mostro Normale</option>
        <option value="Effect Monster">Mostro con Effetto</option>
        <option value="Ritual Monster">Mostro Rituale</option>
        <option value="Fusion Monster">Mostro Fusione</option>
        <option value="Synchro Monster">Mostro Synchro</option>
        <option value="XYZ Monster">Mostro XYZ</option>
        <option value="Pendolum Monster">Mostro Pendolum</option>
        <option value="Link Monster">Mostro Link</option>
    </select>

    <input
        type="number" 
        name="levelMin"
        placeholder="Livello Minimo (0-12)"
        min="0"
        max="12"
        value={data.filters.levelMin }
    />

    <input
        type="number" 
        name="levelMax"
        placeholder="Livello Massimo (0-12)"
        min="0"
        max="12"
        value={data.filters.levelMax }
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
    </select>

    <input
        type="number"
        name="atkMin"
        placeholder="ATK Minimo"
        min="0"
        value={data.filters.atkMin }
    />

    <input
        type="number"
        name="atkMax"
        placeholder="ATK Massimo"
        min="0"
        value={data.filters.atkMax }
    />

    <input
        type="number"
        name="defMin"
        placeholder="DEF Minima"
        min="0"
        value={data.filters.defMin }
    />

    <input
        type="number"
        name="defMax"
        placeholder="DEF Massima"
        min="0"
        value={data.filters.defMax }
    />

    {/if}

    {#if isSpell}
    <select name="race">
        <option value="">Tipo di Magia</option>
        <option value="Normal">Magia Normale</option>
        <option value="Field">Magia Terreno</option>
        <option value="Equip">Magia Equipaggiamento</option>
        <option value="Continuous">Magia Continua</option>
        <option value="Quick-Play">Magia Rapida</option>
        <option value="Ritual">Magia Rituale</option>
    </select>
        
    {/if}

    {#if isTrap}
    <select name="race">
        <option value="">Tipo di Trappola</option>
        <option value="Normal">Trappola Normale</option>
        <option value="Continuous">Trappola Continua</option>
        <option value="Counter">Contro-Trappola</option>
    </select>
    {/if}

    <input type="hidden" name ="type" value={finalType} />

    <button type="submit">Cerca</button>
</form>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
	{#each data.cards as card}
		<div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
			{#if card.imageUrl}
				<img src={card.imageUrl} alt={card.name} class="w-full h-48 object-contain bg-gray-100" />
			{/if}

			<div class="p-4 flex flex-col gap-2">
				<h2 class="text-lg font-bold text-gray-900">{card.name}</h2>
				<p class="text-sm text-gray-500">{card.type}</p>

				<div class="flex flex-wrap gap-2 text-xs">
					{#if card.attribute}
						<span class="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
							{card.attribute}
						</span>
					{/if}
					{#if card.race}
						<span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
							{card.race}
						</span>
					{/if}
					{#if card.level}
						<span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
							Lv. {card.level}
						</span>
					{/if}
				</div>

				{#if card.atk !== null || card.def !== null}
					<p class="text-sm font-mono text-gray-700">
						{#if card.atk !== null}ATK/{card.atk}{/if}
						{#if card.def !== null}&nbsp;DEF/{card.def}{/if}
					</p>
				{/if}

				<p class="text-sm text-gray-600 line-clamp-4">{card.desc}</p>
			</div>
		</div>
	{/each}
</div>
