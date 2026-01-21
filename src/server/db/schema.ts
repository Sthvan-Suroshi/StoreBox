{
  /* server only represents that this files cannot be imported in the client component */
}

// import "server-only";
import {
  int,
  text,
  index,
  singlestoreTableCreator,
  bigint,
  timestamp,
} from "drizzle-orm/singlestore-core";
import { relations } from "drizzle-orm";

const createTable = singlestoreTableCreator((name) => `StoreBox_${name}`);

export const users_table = createTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    storageUsed: bigint("storage_used", { mode: "number" })
      .notNull()
      .default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("idx_users_email").on(t.email)],
);
export type DB_User = typeof users_table.$inferSelect;

export const plans_table = createTable(
  "plans",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    storageQuota: bigint("storage_quota", { mode: "number" }).notNull(),
    priceInCents: int("price_in_cents").notNull().default(0),
  },
  (t) => [index("idx_plans_name").on(t.name)],
);
export type DB_Plan = typeof plans_table.$inferSelect;

export const subscriptions_table = createTable(
  "subscriptions",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    userId: text("user_id").notNull(),
    planId: text("plan_id").notNull().default("free"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("idx_subs_user").on(t.userId),
    index("idx_subs_plan").on(t.planId),
  ],
);
export type DB_Subscription = typeof subscriptions_table.$inferSelect;

export const files_table = createTable(
  "files_table",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    size: int("size").notNull(),
    url: text("url").notNull(),
    parent: bigint("parent", { mode: "number", unsigned: true }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("idx_files_owner").on(t.ownerId),
    index("idx_files_parent").on(t.parent),
  ],
);
export type DB_File = typeof files_table.$inferSelect;

export const folders_table = createTable(
  "folders_table",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    parent: bigint("parent", { mode: "number", unsigned: true }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("idx_folders_owner").on(t.ownerId),
    index("idx_folders_parent").on(t.parent),
  ],
);
export type DB_Folder = typeof folders_table.$inferSelect;

export const userRelations = relations(users_table, ({ one }) => ({
  subscription: one(subscriptions_table, {
    fields: [users_table.id],
    references: [subscriptions_table.userId],
  }),
}));

export const subscriptionRelations = relations(
  subscriptions_table,
  ({ one }) => ({
    user: one(users_table, {
      fields: [subscriptions_table.userId],
      references: [users_table.id],
    }),
    plan: one(plans_table, {
      fields: [subscriptions_table.planId],
      references: [plans_table.id],
    }),
  }),
);
