import {
  int,
  text,
  singlestoreTable,
  index,
  singlestoreTableCreator,
} from "drizzle-orm/singlestore-core";

export const createTable = singlestoreTableCreator(
  (name) => `StoreBox_${name}`,
);

export const files = createTable(
  "files_table",
  {
    id: int("id").primaryKey().autoincrement(),
    name: text("name"),
    size: int("size"),
    url: text("url"),
    parent: int("parent").notNull(),
  },
  (t) => {
    return [index("parent_index").on(t.parent)];
  },
);

export const folders = createTable(
  "folders_table",
  {
    id: int("id").primaryKey().autoincrement(),
    name: text("name").notNull(),
    parent: int("parent"),
  },
  (t) => {
    return [index("parent_index").on(t.parent)];
  },
);
