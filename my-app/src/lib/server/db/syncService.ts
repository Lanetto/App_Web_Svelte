import {db} from './index'
import {cards, syncState} from './schema'
import {getTableColumns, eq, sql} from 'drizzle-orm'

const BASE_URL='https://db.ygoprodeck.com/api/v7';
const CHUNK_SIZE=500;

let running=false;

export async function getSyncState() {
    const rows=await db
        .select()
        .from(syncState)
        .where(eq(syncState.id, 1));
    
    return rows[0] ?? null;
}

async function saveState(values: Partial<typeof syncState.$inferInsert>) {
    await db
        .insert(syncState)
        .values({id:1, ...values})
        .onConflictDoUpdate({target: syncState.id, set: values});
}

const updateSet = Object.fromEntries(
    Object.entries(getTableColumns(cards))
        .filter(([key]) => key !== 'id')
        .map(([key, column]) => [key, sql.raw(`excluded."${column.name}"`)])
);

export async function syncCards({force=false} = {}) {
    if (running) {
        return {success: false, message: 'Sincronizzazione già in corso'};
    }

    running=true;


    try {
        const state=await getSyncState();

        let remoteVersion: string | null=null;

        try {
            const verRes=await fetch(`${BASE_URL}/checkDBVer.php`);
            const verData=await verRes.json();
            remoteVersion=verData?.[0]?.database_version ?? null;
        } catch {
            
        }

        if (!force && remoteVersion && state?.dbVersion===remoteVersion) {
            await saveState({lastSyncAt: new Date(), lastError: null});
            return{success: true, skipped: true, message: 'Database già aggiornato' };
        }

        const res= await fetch(`${BASE_URL}/cardinfo.php`);
        if (!res.ok) {
            throw new Error(`Errore API: ${res.status}`);
        }

        const data=await res.json();
        const rows=(data.data ?? []).map((card: any) => ({
            id: card.id,
			name: card.name,
			type: card.type,
			desc: card.desc,
			race: card.race ?? null,
			attribute: card.attribute ?? null,
			level: card.level ?? null,
			atk: card.atk ?? null,
			def: card.def ?? null,
			imageUrl: card.card_images?.[0]?.image_url_small ?? null
		}));

        db.transaction((tx) => {
            for (let i=0; i < rows.length; i += CHUNK_SIZE){
                tx.insert(cards)
                    .values(rows.slice(i, i + CHUNK_SIZE))
                    .onConflictDoUpdate({
                        target: cards.id,
                        set: updateSet
                    })
                    .run();
            }
        });

        await saveState({
            lastSyncAt: new Date(),
            dbVersion: remoteVersion, 
            cardCount: rows.length,
            lastError: null
        });

        return { success: true, message: `Sincronizzate ${rows.length} carte` };

    } catch (error) {
        const message= error instanceof Error ? error.message: 'Errore sconosciuto';
        await saveState({lastError: message});
        return {success: false, message};
    } finally {
        running=false;
    }
}