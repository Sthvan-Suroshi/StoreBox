"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table } from "./db/schema";
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

  const deletedFile = await db
    .delete(files_table)
    .where(eq(files_table.id, fileId));

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
    const folderId = await MUTATIONS.createFolder({
      folderName,
      parentId: currentFolderId,
      userId: session.userId,
    });
    console.log(folderId);
  }

  revalidatePath(`/f/${currentFolderId}`);
}
