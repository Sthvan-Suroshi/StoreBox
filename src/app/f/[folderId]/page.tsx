import StoreBoxContents from "~/app/storebox-contents";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
  files as filesSchema,
  folders as foldersSchema,
} from "~/server/db/schema";

async function getAllParents(folderId: number) {
  const parents = [];
  let currentId: number | null = folderId;

  while (currentId !== null) {
    const folder = await db
      .selectDistinct() //distinct selects only unique values
      .from(foldersSchema)
      .where(eq(foldersSchema.id, currentId));

    if (!folder[0]) {
      throw new Error("Parent folder not found");
    }

    console.log("Printing folder only ", folder);
    console.log("Printing folder array ", folder[0]);

    parents.unshift(folder[0]);
    currentId = folder[0]?.parent;
  }

  return parents;
}

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params; //indicates the nextjs that this is dynamic route and not to serve static files from cache.
  const parsedFolderId = parseInt(params.folderId);

  if (isNaN(parsedFolderId))
    return (
      <div className="text-center text-2xl text-red-500">Invalid folder ID</div>
    );

  console.log(parsedFolderId);

  const foldersPromise = db
    .select()
    .from(foldersSchema)
    .where(eq(foldersSchema.parent, parsedFolderId));

  const filesPromise = db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, parsedFolderId));

  const parentsPromise = getAllParents(parsedFolderId);
  const [folders, files, parents] = await Promise.all([
    foldersPromise,
    filesPromise,
    parentsPromise,
  ]);

  {
    /* we had an issue where the breadcrumb were in reverse order, so we need to reverse them here to have proper order.

   our instinct would litreally reverse the array using parents.reverse(); but that would reverse the entire original array which might be slow, instead we can use parent.toReversed() which is new in JS. It does not modify the array but creates a new one which is also not a right way to do */
  }
  return <StoreBoxContents files={files} folders={folders} parents={parents} />;
}
