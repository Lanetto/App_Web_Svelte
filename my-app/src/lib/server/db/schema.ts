import {sqliteTable, integer, text} from "drizzle-orm/sqlite-core";
import {ZONES} from '../../deckConfig';

export const cards=sqliteTable("cards", {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    desc: text("desc").notNull(),
    race: text("race"),
    attribute: text("attribute"),
    atk: integer("atk"),
    def: integer("def"),
    level: integer("level"),
    imageUrl: text("imageUrl")
});

export const deckCards= sqliteTable('deck_cards', {
    id: integer('id').primaryKey({autoIncrement:true}),
    sessionId:text('session_id').notNull().default(''),
    cardId: integer('card_id').notNull().references(()=>cards.id),
    quantity: integer('quantity').notNull().default(1),
    zone:text('zone', {enum:ZONES}).notNull().default('main')
});

export const drawStates=sqliteTable('draw_states', {
    sessionId:text('session_id').primaryKey(),
    hand:text('hand', {mode: 'json'}).$type<number[]>().notNull(),
    library:text('library', {mode: 'json'}).$type<number[]>().notNull()
})

export const syncState=sqliteTable('sync_state', {
    id: integer('id').primaryKey(),
    lastSyncAt: integer('last_sync_at', {mode: 'timestamp'}),
    dbVersion: text('db_version'),
    cardCount: integer('card_count'),
    lastError: text('last_error')
});