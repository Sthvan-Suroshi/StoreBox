import { db } from "~/server/db";
import {
  files_table as filesSchema,
  folders_table as foldersSchema,
} from "~/server/db/schema";

export default async function HomePage() {
  return <div>Hello</div>;
}
