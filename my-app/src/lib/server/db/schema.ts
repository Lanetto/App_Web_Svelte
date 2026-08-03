import {sqliteTable, integer, text} from "drizzle-orm/sqlite-core";

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