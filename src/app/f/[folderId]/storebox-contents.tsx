"use client";

import { ChevronRight, Plus, PlusCircle } from "lucide-react";
import { FileRow, FolderRow } from "./file-row";
import type { files_table, folders_table } from "~/server/db/schema";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UploadButton, UploadDropzone } from "~/utils/uploadthing";
import { redirect, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { auth } from "@clerk/nextjs/server";
import { MUTATIONS } from "~/server/db/queries";
import { createFolder } from "~/server/action";

export default function StoreBoxContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;
}) {
  const navigate = useRouter();
  const [open, setOpen] = useState(false);

  const handleCreateFolder = () => {
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href={"/"} className="mr-2 text-gray-300 hover:text-black">
              My Drive
            </Link>
            {props.parents.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-gray-500" size={16} />
                <Link
                  href={`/f/${folder.id}`}
                  className="text-gray-300 hover:text-black"
                >
                  {folder.name}
                </Link>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button
              variant={"ghost"}
              className="border hover:bg-gray-700 hover:text-gray-100"
              onClick={handleCreateFolder}
            >
              Create Folder
              <Plus className="size-6 text-gray-400" />
            </Button>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Size</div>
              <div className="col-span-1"></div>
            </div>
          </div>
          <ul>
            {props.folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}

            {props.files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <UploadButton
            endpoint="driveUploader"
            onClientUploadComplete={() =>
              // refreshes the page and revalidates the data to show updated state,
              navigate.refresh()
            }
            input={{
              folderId: props.currentFolderId,
            }}
          />
        </div>
      </div>

      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add folder name</DialogTitle>
            </DialogHeader>
            <form
              action={async (formData) => {
                await createFolder(formData);
                setOpen(false);
              }}
            >
              <div className="grid flex-1 gap-2">
                <Label htmlFor="folderName" className="sr-only">
                  Folder Name
                </Label>
                <Input id="folderName" name="folderName" type="text" required />
                <input
                  type="hidden"
                  name="currentFolderId"
                  value={props.currentFolderId}
                />
              </div>
              <DialogFooter className="sm:justify-start">
                <div className="flex gap-3 pt-3">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" className="bg-[#163464]">
                    Add
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
