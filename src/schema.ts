import {pgTable, text} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: text().primaryKey(),
    enka_name: text()
})