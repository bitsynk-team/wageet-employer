import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { cn } from "cn";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <main id="main" className="flex flex-1 items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex">
          <Logo priority />
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>
              Use the work email for the workplace you manage. Account sign-in is the next piece to connect.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Work email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="h-10 bg-white"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="h-10 bg-white"
                />
                <FieldDescription>Sign-in does not check these fields yet.</FieldDescription>
              </Field>
              <Link href="/" className={cn(buttonVariants({ size: "lg" }), "h-10 w-full")}>
                Continue to the portal
              </Link>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
