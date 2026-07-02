import React from "react";
import { PARTNERS_DATA } from "@/data/partners";
import { withBrandAssetVersion } from "@/lib/brand-assets";
import { ExternalLink, Globe, Mail, MessageCircle, Youtube, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import Header from "@/components/landing/Header/Header";
import Footer from "@/components/landing/Footer";
import AmbientBackdrop from "@/components/landing/AmbientBackdrop";
import Chatbot from "@/components/chatbot/Chatbot";

const COPY = normalizeLocalizedTree({
  en: {
    heroTitle: "Our Ecosystem Partners",
    heroSubtitle: "Meet the brilliant organizations and agencies collaborating with EquiSaaS BD to build the next generation open tech ecosystem.",
    visitWebsite: "Visit Website"
  },
  bn: {
    heroTitle: "আমাদের ইকোসিস্টেম পার্টনার্স",
    heroSubtitle: "EquiSaaS BD-এর সাথে যুক্ত হয়ে যারা বাংলাদেশের প্রথম ওপেন টেক ইকোসিস্টেম গড়ে তুলছেন, তাদের সম্পর্কে জানুন।",
    visitWebsite: "ওয়েবসাইট ভিজিট করুন"
  }
});

function getIconForLink(key) {
  const k = key.toLowerCase();
  if (k.includes("facebook")) return <Facebook className="w-4 h-4" />;
  if (k.includes("instagram")) return <Instagram className="w-4 h-4" />;
  if (k.includes("youtube")) return <Youtube className="w-4 h-4" />;
  if (k.includes("whatsapp")) return <MessageCircle className="w-4 h-4" />;
  if (k.includes("email")) return <Mail className="w-4 h-4" />;
  return <Globe className="w-4 h-4" />;
}

export default function PartnersPage({ lang, setLang, theme, setTheme }) {
  const t = COPY[lang] || COPY.en;

  return (
    <div className="min-h-screen bg-background text-foreground tracking-tight flex flex-col">
      <AmbientBackdrop />
      <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      <main className="flex-1 container mx-auto px-6 py-32 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 reveal-up">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
            {t.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PARTNERS_DATA.map((partner, idx) => (
            <Card key={idx} className="reveal-up overflow-hidden rounded-3xl sm:rounded-[2rem] border border-border/50 bg-card/60 shadow-lg backdrop-blur-xl flex flex-col hover:border-primary/30 transition-colors duration-500">
              <CardContent className="flex flex-col flex-1 p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 p-3 shadow-inner ring-1 ring-white/10">
                    <img
                      src={withBrandAssetVersion(partner.logo)}
                      alt={`${partner.name} logo`}
                      className="max-h-full max-w-full object-contain drop-shadow-md"
                    />
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20 uppercase tracking-wider">
                      {partner.type[lang] || partner.type.en}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <h3 className="text-2xl font-bold text-foreground">{partner.name}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground/90">
                    {partner.description[lang] || partner.description.en}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-border/50 flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(partner.links).map(([key, url]) => (
                      <a 
                        key={key} 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        title={key}
                      >
                        {getIconForLink(key)}
                        <span className="sr-only">{key}</span>
                      </a>
                    ))}
                  </div>
                  <Button asChild className="w-full rounded-xl shadow-elite group" variant="default">
                    <a href={partner.website} target="_blank" rel="noopener noreferrer">
                      <span>{t.visitWebsite}</span>
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer lang={lang} />
      <Chatbot lang={lang} theme={theme} />
    </div>
  );
}
