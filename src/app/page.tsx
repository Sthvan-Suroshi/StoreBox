import { db } from "~/server/db";
import {
  files as filesSchema,
  folders as foldersSchema,
} from "~/server/db/schema";
import StoreBoxContents from "./storebox-contents";

export default async function HomePage() {
  return <div>Hello</div>;
}
