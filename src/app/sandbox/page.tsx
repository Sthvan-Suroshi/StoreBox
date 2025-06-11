import { db } from "~/server/db";
import { mockFiles, mockFolders } from "~/lib/mock-data";
import { files_table, folders_table } from "~/server/db/schema";

export default function Sandbox() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-zinc-400">
      <h1>Sandbox seed function</h1>
      <form
        action={async () => {
          "use server";

          const folderInsert = await db.insert(folders_table).values(
            mockFolders.map((folder, index) => ({
              id: index + 1,
              name: folder.name,
              parent: index !== 0 ? 1 : null,
            })),
          );

          const fileInsert = await db.insert(files_table).values(
            mockFiles.map((file, index) => ({
              id: index + 1,
              name: file.name,
              size: 5000,
              url: file.url,
              parent: (index % 3) + 1,
            })),
          );

          console.log("folderInsert\n", folderInsert);
          console.log("fileInsert", fileInsert);
        }}
      >
        <button
          type="submit"
          className="rounded-full bg-blue-300 p-4 outline-2 outline-blue-200 active:outline-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
