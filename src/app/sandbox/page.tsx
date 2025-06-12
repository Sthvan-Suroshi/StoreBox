import { db } from "~/server/db";
import { mockFolders } from "~/lib/mock-data";
import { folders_table } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";

export default async function Sandbox() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-zinc-400">
      <h1 className="text-semibold text-3xl">Sandbox seed function</h1>
      <form
        action={async () => {
          "use server";
          const user = await auth();

          if (!user.userId) {
            throw new Error("Unauthorized");
          }

          const rootFolder = await db
            .insert(folders_table)
            .values({
              name: "root",
              ownerId: user.userId,
              parent: null,
            })
            .$returningId();

          const insertableFolders = mockFolders.map((folder) => ({
            name: folder.name,
            ownerId: user.userId,
            parent: rootFolder[0]!.id,
          }));

          const uploadedFolders = await db
            .insert(folders_table)
            .values(insertableFolders);

          console.log("uploaded folders ", uploadedFolders);
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
