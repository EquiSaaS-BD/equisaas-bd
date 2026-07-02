"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LockKeyhole, Mail, UserPlus2 } from "lucide-react";
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

export default function RegisterPage() {
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
      await authState.register(email, password);
      router.replace("/dashboard");
    } catch (nextError) {
      setError(nextError.message || "Registration failed.");
    }
  };

  return (
    <PublicShell showAuthActions={false}>
      <div className="mx-auto max-w-2xl py-12 sm:py-20">
        <div className="text-center space-y-6 mb-12" data-reveal="down">
          <Badge variant="outline" className="rounded-full px-4 py-1 border-primary/20 text-primary bg-primary/5">
            {copy("Co-builder Registration", "কো-বিল্ডার রেজিস্ট্রেশন")}
          </Badge>
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl text-editorial">
            {copy("Join the Ecosystem", "ইকোসিস্টেমে যোগ দিন")}
          </h1>
          <p className="max-w-xl mx-auto text-lg leading-8 text-muted-foreground">
            {copy(
              "Start your journey as a co-builder. Create an account to access department learning, tasks, and ownership records.",
              "আপনার কো-বিল্ডার যাত্রা শুরু করুন। লার্নিং, টাস্ক এবং মালিকানা রেকর্ড অ্যাক্সেস করতে অ্যাকাউন্ট তৈরি করুন।"
            )}
          </p>
        </div>

        <Card className="glass-premium rounded-[2.5rem] border border-border/70 shadow-elite overflow-hidden" data-reveal="up">
          <CardContent className="p-8 sm:p-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <Label htmlFor="register-email" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  {copy("Email Address", "ইমেইল অ্যাড্রেস")}
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="register-email"
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
                <Label htmlFor="register-password" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  {copy("Create Password", "পাসওয়ার্ড তৈরি করুন")}
                </Label>
                <div className="relative group">
                  <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="register-password"
                    type="password"
                    className="h-14 pl-12 rounded-2xl bg-background/50 border-border/60 focus:bg-background transition-all"
                    placeholder="••••••••"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <Button className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95" type="submit">
                  <UserPlus2 className="mr-2 h-5 w-5" />
                  {copy("Create Co-builder Account", "কো-বিল্ডার অ্যাকাউন্ট তৈরি করুন")}
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
                  <AlertTitle className="font-bold">{copy("Registration Problem", "রেজিস্ট্রেশন সমস্যা")}</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>

            <div className="mt-10 pt-8 border-t border-border/60 text-center">
              <p className="text-base text-muted-foreground">
                {copy("Already have an account?", "আগেই অ্যাকাউন্ট আছে?")}{" "}
                <Link className="font-bold text-primary hover:underline underline-offset-4" href="/login">
                  {copy("Log in here", "এখানে লগ ইন করুন")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 space-y-6" data-reveal="up">
          <div className="glass-premium rounded-[2rem] p-8 border border-border/60">
            <h2 className="text-2xl font-black tracking-tight mb-6">{copy("Next Steps after Joining", "যোগদানের পরের ধাপ")}</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { step: copy("Step 1", "ধাপ ১"), desc: copy("Verify your identity via email or Google.", "ইমেইল বা Google দিয়ে পরিচয় নিশ্চিত করুন।") },
                { step: copy("Step 2", "ধাপ ২"), desc: copy("Select your department learning track.", "আপনার ডিপার্টমেন্ট লার্নিং ট্র্যাক বেছে নিন।") },
                { step: copy("Step 3", "ধাপ ৩"), desc: copy("Complete Week 1 and submit your first proof.", "Week 1 শেষ করে প্রথম প্রুফ জমা দিন।") },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-widest text-primary">{item.step}</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
