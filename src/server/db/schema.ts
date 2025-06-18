{
  /* server only represents that this files cannot be imported in the client component */
}

import "server-only";
import {
  int,
  text,
  index,
  singlestoreTableCreator,
  bigint,
  timestamp,
} from "drizzle-orm/singlestore-core";
import { relations } from "drizzle-orm";

export const createTable = singlestoreTableCreator(
  (name) => `StoreBox_${name}`,
);

export const users_table = createTable(
  "users_table",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    storageUsed: bigint("storage_used", { mode: "number" })
      .notNull()
      .default(0), // bytes used
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => {
    return [index("idx_users_email").on(t.email)];
  },
);
export type DB_UserType = typeof users_table.$inferSelect;

export const plans_table = createTable("plans_table", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  storageQuota: bigint("storage_quota", { mode: "number" }).notNull(), // bytes
  priceInCents: int("price_in_cents").notNull().default(0),
});
export type DB_PlanType = typeof plans_table.$inferSelect;

export const subscriptions_table = createTable(
  "subscriptions_table",
  {
    userId: text("user_id").notNull(),
    planId: text("plan_id").notNull().default("free"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeCustomerId: text("stripe_customer_id"),
    stripePriceId: text("stripe_price_id"),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => {
    return [
      index("idx_subs_plan").on(t.planId),
      index("idx_subs_price").on(t.stripePriceId),
      index("idx_subs_user").on(t.userId),
    ];
  },
);
export type DB_SubscriptionType = typeof subscriptions_table.$inferSelect;

export const files_table = createTable(
  "files_table",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    size: int("size").notNull(), // bytes
    url: text("url").notNull(),
    parent: bigint("parent", { mode: "number", unsigned: true }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => {
    return [
      index("idx_files_owner").on(t.ownerId),
      index("idx_files_parent").on(t.parent),
    ];
  },
);
export type DB_FileType = typeof files_table.$inferSelect;

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
  (t) => {
    return [
      index("idx_folders_owner").on(t.ownerId),
      index("idx_folders_parent").on(t.parent),
    ];
  },
);
export type DB_FolderType = typeof folders_table.$inferSelect;

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
