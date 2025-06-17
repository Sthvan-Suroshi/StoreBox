"use server";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "./db";
import { files_table, folders_table, type DB_FolderType } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MUTATIONS } from "./db/queries";
import { revalidatePath } from "next/cache";

{
  //* whenever we see use server on top of the component, use it with caution. When we import this, it means nextjs is treating them as REST APIs points that can be hit by users on different page
  //* Every export in here is a endpoint. TREAT IT CAREFULLY
}

const utapi = new UTApi();

export async function deleteFile(fileId: number) {
  const session = await auth();

  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    );

  if (!file) {
    throw new Error("File not found");
  }

  const utapiResult = await utapi.deleteFiles([
    file.url?.replace("https://c81ms6pp71.ufs.sh/f/", "")!,
  ]);

  console.log(utapiResult);

  await db.delete(files_table).where(eq(files_table.id, fileId));

  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random())); //* Most easy way to revalidate the page on the client. It will force the page to revalidate and get the data from the server in a single call.

  return { succes: true };
}

export async function createFolder(formData: FormData) {
  const session = await auth();

  if (!session.userId) {
    redirect("/sign-in");
  }

  const folderName = formData.get("folderName") as string;
  const currentFolderId = Number(formData.get("currentFolderId"));

  if (folderName) {
    await MUTATIONS.createFolder({
      folderName,
      parentId: currentFolderId,
      userId: session.userId,
    });
  }

  revalidatePath(`/f/${currentFolderId}`);

  return { success: true };
}

export async function deleteFolder(folderId: number) {
  const session = await auth();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  // 1. Fetch all folders for the user at once to avoid N+1 queries.
  // We also fetch the target folder here to verify ownership in one go.
  const allUserFolders = await db
    .select()
    .from(folders_table)
    .where(eq(folders_table.ownerId, session.userId));

  // 2. Find the starting folder and verify it exists in the user's folders.
  const startFolder = allUserFolders.find((f) => f.id === folderId);
  if (!startFolder) {
    throw new Error("Folder not found or you don't have permission");
  }

  // 3. Build the full descendant list in-memory. This is very fast.
  const allFolderIdsToDelete: number[] = [];
  const foldersToProcess: DB_FolderType[] = [startFolder]; // Queue for traversal

  while (foldersToProcess.length > 0) {
    const currentFolder = foldersToProcess.shift()!;
    allFolderIdsToDelete.push(currentFolder.id);

    // Find direct children from the already-fetched list (no DB call here)
    for (const folder of allUserFolders) {
      if (folder.parent === currentFolder.id) {
        foldersToProcess.push(folder);
      }
    }
  }

  // 4. Get all files within the entire folder hierarchy (one DB call)
  const allFilesToDelete = await db
    .select()
    .from(files_table)
    .where(inArray(files_table.parent, allFolderIdsToDelete));

  // 5. Delete files from the external storage (utapi)
  if (allFilesToDelete.length > 0) {
    const fileKeys = allFilesToDelete
      .map((file) => file.url?.replace("https://c81ms6pp71.ufs.sh/f/", ""))
      .filter((key): key is string => !!key);

    if (fileKeys.length > 0) {
      const utapiResult = await utapi.deleteFiles(fileKeys);
      console.log("UTAPI Deletion Result:", utapiResult);
    }
  }

  // 6. Delete all files and folders from the database in a transaction
  await db.transaction(async (tx) => {
    if (allFolderIdsToDelete.length > 0) {
      await tx
        .delete(files_table)
        .where(inArray(files_table.parent, allFolderIdsToDelete));
      await tx
        .delete(folders_table)
        .where(inArray(folders_table.id, allFolderIdsToDelete));
    }
  });

  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}
