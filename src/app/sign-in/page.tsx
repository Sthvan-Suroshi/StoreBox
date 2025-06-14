import { Button } from "~/components/ui/button";
import { SignInButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
      {/* CTA Section */}
      <div className="min-w-1/4 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-8">
          <h3 className="mb-4 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-xl font-semibold text-transparent">
            Login to StoreBox
          </h3>

          {/* Did not use clerks signout and signin button here directly coz
            its runs on server which might slow down the initial load of the
            page.*/}
          <div className="space-y-3">
            <SignInButton forceRedirectUrl={"/home"}>
              <Button
                className="w-full bg-gradient-to-r from-slate-100 to-slate-500 font-semibold text-slate-900 hover:from-slate-200 hover:to-slate-400"
                type="submit"
              >
                Create Free Account
              </Button>
            </SignInButton>
          </div>
        </div>
      </div>
    </div>
  );
}
