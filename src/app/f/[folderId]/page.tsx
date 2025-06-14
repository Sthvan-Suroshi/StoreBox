//* Always try to separate the data layer from the react code and logic.

import { QUERIES } from "~/server/db/queries"; // queries can keep re-running and we don't care about, while mutations are only run once coz they mutate things.
import StoreBoxContents from "./storebox-contents";

export default async function StoreBox(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params; //indicates the nextjs that this is dynamic route and not to serve static files from cache.
  const parsedFolderId = parseInt(params.folderId);

  if (isNaN(parsedFolderId))
    return (
      <div className="text-center text-2xl text-red-500">Invalid folder ID</div>
    );

  const [folders, files, parents] = await Promise.all([
    QUERIES.getFolders(parsedFolderId),
    QUERIES.getFiles(parsedFolderId),
    QUERIES.getAllParentsForFolder(parsedFolderId),
  ]);

  {
    /* we had an issue where the breadcrumb were in reverse order, so we need to reverse them here to have proper order.

  our instinct would litreally reverse the array using parents.reverse(); but that would reverse the entire original array which might be slow, instead we can use parent.toReversed() which is new in JS. It does not modify the array but creates a new one which is also not a right way to do */
  }
  return (
    <StoreBoxContents
      files={files}
      folders={folders}
      parents={parents}
      currentFolderId={parsedFolderId}
    />
  );
}
