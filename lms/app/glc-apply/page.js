"use client";

import { useState } from "react";
import { CheckCircle2, GraduationCap, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { submitGlcApplication } from "@/lib/firestore/lms";
import { PublicShell } from "@/components/layout/public-shell";
import { useLocale } from "@/components/providers/locale-provider";

export default function GlcApplyPage() {
  const [form, setForm] = useState({ fullName: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { copy } = useLocale();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email) return;

    setLoading(true);
    setError("");
    try {
      await submitGlcApplication({
        fullName: form.fullName,
        email: form.email,
        glcTitle: "Professional Communication & Spoken English Certification",
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <PublicShell showAuthActions={false}>
        <div className="mx-auto max-w-md py-12 sm:py-20">
          <Card className="w-full border-border/50 text-center shadow-lg glass-premium rounded-[2.5rem]">
            <CardHeader className="p-8 sm:p-12 pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <CardTitle className="text-2xl font-black">{copy("Application Received", "আবেদনপত্র গৃহীত হয়েছে")}</CardTitle>
              <CardDescription className="text-base mt-2">
                {copy(
                  `Thank you, ${form.fullName}! Your application for the GLC Spoken English Certification has been submitted.`,
                  `ধন্যবাদ, ${form.fullName}! জিএলসি স্পোকেন ইংলিশ সার্টিফিকেটের জন্য আপনার আবেদনটি সফলভাবে জমা হয়েছে।`
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 sm:p-12 pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {copy(
                  "Our team will verify your participation and active engagement. Once approved, you will receive an email with your official credential.",
                  "আমাদের টিম আপনার অংশগ্রহণ এবং সক্রিয় কার্যক্রম যাচাই করবে। এটি অনুমোদিত হলে, আপনার অফিসিয়াল সার্টিফিকেটটি ইমেইলের মাধ্যমে পাঠিয়ে দেওয়া হবে।"
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell showAuthActions={false}>
      <div className="mx-auto max-w-2xl py-12 sm:py-20">
        <div className="text-center space-y-6 mb-12" data-reveal="down">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl text-editorial">
            {copy("Get Certified", "সার্টিফিকেট অর্জন করুন")}
          </h1>
          <p className="max-w-xl mx-auto text-lg leading-8 text-muted-foreground">
            {copy(
              "Apply for your GLC Professional Communication & Spoken English Certification",
              "জিএলসি প্রফেশনাল কমিউনিকেশন ও স্পোকেন ইংলিশ সার্টিফিকেটের জন্য আবেদন করুন"
            )}
          </p>
        </div>

        <Card className="glass-premium rounded-[2.5rem] border border-border/70 shadow-elite overflow-hidden" data-reveal="up">
          <CardContent className="p-8 sm:p-12">
            {error && (
              <Alert variant="destructive" className="mb-6 rounded-2xl bg-destructive/5 border-destructive/20 animate-in fade-in slide-in-from-top-1" role="alert">
                <AlertTitle className="font-bold">{copy("Application failed", "আবেদন ব্যর্থ হয়েছে")}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="fullName" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  {copy("Full Legal Name", "পূর্ণ আইনি নাম")}
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="fullName"
                    className="h-14 pl-12 rounded-2xl bg-background/50 border-border/60 focus:bg-background transition-all"
                    placeholder="Ex: Md. Mehedi Hasan"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-muted-foreground ml-1">
                  {copy("This exact name will appear on your official certificate.", "সার্টিফিকেটে ঠিক এই নামটি প্রদর্শিত হবে।")}
                </p>
              </div>

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
                    placeholder="Ex: name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95" disabled={loading}>
                {loading ? copy("Submitting...", "জমা দেওয়া হচ্ছে...") : copy("Apply for Certificate", "সার্টিফিকেটের জন্য আবেদন করুন")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}
