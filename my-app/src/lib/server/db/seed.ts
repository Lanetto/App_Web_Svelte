import {db} from './index';
import {cards} from './schema';

const BASE_URL='https://db.ygoprodeck.com/api/v7/';

async function seed() {
    console.log('Scarico tutte le carte da YGOProDeck...');

    const res=await fetch(`${BASE_URL}cardinfo.php`);
    if (!res.ok) {
        throw new Error(`Errore durante il download delle carte`);
    }

    const data=await res.json();
    const allCards=data.data ?? [];

    console.log(`Scaricate ${allCards.length} carte. Inserimento nel database...`);

    for (const card of allCards) {
        await db.insert(cards).values({
            id: card.id,
            name: card.name,
            type: card.type,
            desc: card.desc,
            race: card.race ?? null,
            attribute: card.attribute ?? null,
            atk: card.atk ?? null,
            def: card.def ?? null,
            level: card.level ?? null,
            imageUrl: card.card_images?.[0]?.image_url_small ?? null
        });
    }

    console.log('Inserimento completato.');
}

seed().catch((err) => {
    console.error('Errore durante il seeding del database:', err);
    process.exit(1);
}); 