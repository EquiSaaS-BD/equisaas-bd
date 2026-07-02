"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PUBLIC_COMMUNITY_LINKS } from "@/lib/urls";

export default function LoginPage() {
  const router = useRouter();
  const authState = useAuth();
  const { copy } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authState.loading && authState.user) {
      router.replace("/dashboard");
    }
  }, [authState.loading, authState.user, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await authState.login(email, password);
      router.replace("/dashboard");
    } catch (nextError) {
      setError(nextError.message || "Login failed.");
    }
  };

  return (
    <PublicShell showAuthActions={false}>
      <div className="mx-auto max-w-2xl py-12 sm:py-20">
        <div className="text-center space-y-6 mb-12" data-reveal="down">
          <Badge variant="outline" className="rounded-full px-4 py-1 border-primary/20 text-primary bg-primary/5">
            {copy("Workspace Login", "ওয়ার্কস্পেস লগ ইন")}
          </Badge>
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl text-editorial">
            {copy("Log in to your workspace", "আপনার ওয়ার্কস্পেসে লগ ইন করুন")}
          </h1>
          <p className="max-w-xl mx-auto text-lg leading-8 text-muted-foreground">
            {copy(
              "Continue learning, submitting proof, reviewing work, or managing your department in the EquiSaaS BD ecosystem.",
              "Learning, proof submit, review, বা department manage করতে আপনার EquiSaaS BD ওয়ার্কস্পেসে লগ ইন করুন।"
            )}
          </p>
        </div>

        <Card className="glass-premium rounded-[2.5rem] border border-border/70 shadow-elite overflow-hidden" data-reveal="up">
          <CardContent className="p-8 sm:p-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  {copy("Email Address", "ইমেইল অ্যাড্রেস")}
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="email"
                    type="email"
                    className="h-14 pl-12 rounded-2xl bg-background/50 border-border/60 focus:bg-background transition-all"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  {copy("Password", "পাসওয়ার্ড")}
                </Label>
                <div className="relative group">
                  <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="password"
                    type="password"
                    className="h-14 pl-12 rounded-2xl bg-background/50 border-border/60 focus:bg-background transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <Button className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95" type="submit">
                  {copy("Log in to Dashboard", "ড্যাশবোর্ডে লগ ইন করুন")}
                </Button>
                
                <div className="relative flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-border/60" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">OR</span>
                  <div className="h-px flex-1 bg-border/60" />
                </div>

                <Button
                  className="w-full h-14 rounded-2xl border-border/70 bg-background/50 hover:bg-background transition-all active:scale-95"
                  variant="outline"
                  type="button"
                  onClick={async () => {
                    setError("");
                    try {
                      await authState.loginWithGoogle();
                      router.replace("/dashboard");
                    } catch (err) {
                      setError(err.message || "Google sign-in failed.");
                    }
                  }}
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {copy("Continue with Google", "Google দিয়ে চালিয়ে যান")}
                </Button>
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-2xl bg-destructive/5 border-destructive/20 animate-in fade-in slide-in-from-top-1" role="alert">
                  <AlertTitle className="font-bold">{copy("Access Problem", "অ্যাক্সেস সমস্যা")}</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}
