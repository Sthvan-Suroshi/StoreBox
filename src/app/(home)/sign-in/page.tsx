import { Button } from "~/components/ui/button";
import { SignInButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <>
      <h3 className="mb-4 bg-linear-to-r from-slate-100 to-slate-300 bg-clip-text text-xl font-semibold text-transparent">
        Login to StoreBox
      </h3>

      {/* Did not use clerks signout and signin button here directly coz
            its runs on server which might slow down the initial load of the
            page.*/}
      <div className="space-y-3">
        <SignInButton forceRedirectUrl={"/home"}>
          <Button
            className="w-full bg-linear-to-r from-slate-100 to-slate-500 font-semibold text-slate-900 hover:from-slate-200 hover:to-slate-400"
            type="submit"
          >
            Create Free Account
          </Button>
        </SignInButton>
      </div>
    </>
  );
}
