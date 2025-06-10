import { eq } from "drizzle-orm";
import StoreBoxContents from "~/app/storebox-contents";
import { db } from "~/server/db";
import {
  files as filesSchema,
  folders as foldersSchema,
} from "~/server/db/schema";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;
  const parsedFolderId = parseInt(params.folderId);

  if (isNaN(parsedFolderId))
    return (
      <div className="text-center text-2xl text-red-500">Invalid folder ID</div>
    );

  console.log(parsedFolderId);

  const folders = await db
    .select()
    .from(foldersSchema)
    .where(eq(foldersSchema.parent, parsedFolderId));

  const files = await db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, parsedFolderId));

  return <StoreBoxContents files={files} folders={folders} />;
}
