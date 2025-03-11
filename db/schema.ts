import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    index,
    AnyPgColumn,
    text
} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";


// --- Users Table ---
export const users = pgTable("users", {
    id: varchar("id", { length: 255 }).primaryKey(), // Clerk user ID as string
    email: varchar("email", { length: 255 }).notNull(),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

// --- Folders Table ---
export const folders = pgTable(
    "folders",
    {
        id: uuid("id").primaryKey(),
        owner_id: varchar("owner_id", { length: 255 })
            .references(() => users.id)
            .notNull(),
        name: varchar("name", { length: 255 }).notNull(),
        // For a root folder, parent_id will be null.
        parent_id: uuid("parent_id")
            .references((): AnyPgColumn => folders.id, { onDelete: "cascade" }),
        path: text("path").notNull(),
        share_token: varchar("share_token", { length: 255 }),
        created_at: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
        updated_at: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
    },
    (folder) => ({
        ownerIdIndex: index("folders_owner_id_idx").on(folder.owner_id),
        parentIdIndex: index("folders_parent_id_idx").on(folder.parent_id),
    })
);

// --- Photos Table ---
export const photos = pgTable(
    "photos",
    {
        id: uuid("id").primaryKey(),
        owner_id: varchar("owner_id", { length: 255 })
            .references(() => users.id)
            .notNull(),
        folder_id: uuid("folder_id")
            .references(() => folders.id, { onDelete: "cascade" })
            .notNull(),
        name: varchar("name", { length: 255 }).notNull(),
        s3_key: varchar("s3_key", { length: 255 }).notNull(),
        share_token: varchar("share_token", { length: 255 }),
        created_at: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    },
    (photo) => ({
        folderIdIndex: index("photos_folder_id_idx").on(photo.folder_id),
    })
);

// --- Sharing Table ---
// Maps access control for photos or folders to users.
export const sharing = pgTable("sharing", {
    id: uuid("id").primaryKey(),
    resource_type: varchar("resource_type", { length: 50 }).notNull(), // e.g., "photo" or "folder"
    resource_id: uuid("resource_id").notNull(), // Logical reference to photos.id or folders.id.
    shared_with_user_id: varchar("shared_with_user_id", { length: 255 })
        .references(() => users.id)
        .notNull(),
    permission: varchar("permission", { length: 50 }).notNull(), // e.g., "read", "write", "delete"
    created_at: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
},
    (sharing) => ({
        resourceIdIndex: index("resource_id_idx").on(sharing.resource_id),
        sharedWithUserIdIndex: index("shared_with_user_idx").on(sharing.shared_with_user_id),
    })
);

export const userRelations = relations(users, ({ many }) => ({
    folders: many(folders),
    photos: many(photos),
    sharing: many(sharing),
}));

export const folderRelations = relations(folders, ({ one, many }) => ({
    owner: one(users, {
        fields: [folders.owner_id],
        references: [users.id],
    }),
    parent: one(folders, {
        fields: [folders.parent_id],
        references: [folders.id],
    }),
    children: many(folders, {
        fields: [folders.id],
        references: [folders.parent_id],
    } as any),
    photos: many(photos)
}));

// Relations for the Photos table
export const photoRelations = relations(photos, ({ one }) => ({
    owner: one(users, {
        fields: [photos.owner_id],
        references: [users.id],
    }),
    folder: one(folders, {
        fields: [photos.folder_id],
        references: [folders.id],
    }),
}));

export const sharingRelations = relations(sharing, ({ one }) => ({
    // Each sharing record links to the user with whom the resource is shared.
    sharedWithUser: one(users, {
        fields: [sharing.shared_with_user_id],
        references: [users.id],
    }),
}));

