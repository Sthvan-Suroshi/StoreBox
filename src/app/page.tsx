import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Upload, FolderOpen, Shield, Zap } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session.userId) {
    console.log(session.userId);
    redirect("/home");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-300">
            <FolderOpen className="h-8 w-8 text-slate-900" />
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Welcome to StoreBox
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-400">
            Your secure cloud storage solution for files and folders. Upload,
            organize, and access your data from anywhere.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mb-16 grid max-w-4xl gap-8 md:grid-cols-3">
          <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-200 to-slate-400">
                <Upload className="h-6 w-6 text-slate-900" />
              </div>
              <h3 className="mb-2 bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-lg font-semibold text-transparent">
                Easy Upload
              </h3>
              <p className="text-sm text-slate-400">
                Drag and drop files or folders directly into your storage space
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-200 to-slate-400">
                <Shield className="h-6 w-6 text-slate-900" />
              </div>
              <h3 className="mb-2 bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-lg font-semibold text-transparent">
                Secure Storage
              </h3>
              <p className="text-sm text-slate-400">
                Your files are encrypted and protected with enterprise-grade
                security
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-200 to-slate-400">
                <Zap className="h-6 w-6 text-slate-900" />
              </div>
              <h3 className="mb-2 bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-lg font-semibold text-transparent">
                Fast Access
              </h3>
              <p className="text-sm text-slate-400">
                Access your files instantly from any device, anywhere in the
                world
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Steps */}
        <div className="mx-auto mb-16 max-w-2xl">
          <h2 className="mb-8 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 bg-clip-text text-center text-2xl font-bold text-transparent">
            Get Started in 3 Simple Steps
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-sm font-semibold text-slate-900">
                1
              </div>
              <div>
                <h3 className="mb-1 bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text font-semibold text-transparent">
                  Create Your Account
                </h3>
                <p className="text-sm text-slate-400">
                  Sign up with your email and set up your secure storage space
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-sm font-semibold text-slate-900">
                2
              </div>
              <div>
                <h3 className="mb-1 bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text font-semibold text-transparent">
                  Upload Your Files
                </h3>
                <p className="text-sm text-slate-400">
                  Drag and drop files or folders to start building your digital
                  library
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-sm font-semibold text-slate-900">
                3
              </div>
              <div>
                <h3 className="mb-1 bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text font-semibold text-transparent">
                  Access Anywhere
                </h3>
                <p className="text-sm text-slate-400">
                  Your files are now available on all your devices, anytime
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="mx-auto max-w-md rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-8">
            <h3 className="mb-4 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-xl font-semibold text-transparent">
              Ready to get started?
            </h3>
            <p className="mb-6 text-sm text-slate-400">
              Join thousands of users who trust StoreBox with their files
            </p>
            {/* Did not use clerks signout and signin button here directly coz
            its runs on server which might slow down the initial load of the
            page.*/}
            <div className="space-y-3">
              <form
                action={async () => {
                  "use server";
                  const session = await auth();

                  if (!session.userId) {
                    redirect("/sign-in");
                  }

                  redirect("/home");
                }}
              >
                <Button
                  className="w-full bg-gradient-to-r from-slate-100 to-slate-500 font-semibold text-slate-900 hover:from-slate-200 hover:to-slate-400"
                  type="submit"
                >
                  Get Started
                </Button>
              </form>

              <Button
                variant="ghost"
                className="w-full border border-slate-600 text-slate-300 hover:bg-gray-800 hover:text-slate-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
