import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

export default async function Home() {
  const session = await auth();

  if (!session.userId) {
    return redirect("/sign-in");
  }

  const rootFolder = await QUERIES.getRootFolderForUser(session.userId);

  if (!rootFolder) {
    return (
      <form
        action={async () => {
          "use server";

          const session = await auth();

          if (!session.userId) {
            redirect("/sign-in");
          }

          const rootFolderId = await MUTATIONS.onboardUser(session.userId);

          redirect(`/f/${rootFolderId}`);
        }}
      >
        <p className="mb-4 text-gray-300">
          New to StoreBox? Start now by creating a new drive
        </p>

        <Button className="w-full bg-gradient-to-r from-slate-100 to-slate-500 font-semibold text-slate-900 hover:from-slate-200 hover:to-slate-400">
          Create New Drive
        </Button>
      </form>
    );
  }
  return redirect(`/f/${rootFolder.id}`);
}
