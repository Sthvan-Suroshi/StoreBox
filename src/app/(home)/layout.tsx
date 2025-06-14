import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Upload, FolderOpen, Shield, Zap } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function HomePage(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
      {/* CTA Section */}
      <div className="min-w-1/4 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-8">
          {props.children}
        </div>
      </div>
    </div>
  );
}
