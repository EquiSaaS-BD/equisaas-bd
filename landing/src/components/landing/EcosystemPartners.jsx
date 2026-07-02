import React, { useState } from "react";
import { motion } from "framer-motion";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { withBrandAssetVersion } from "@/lib/brand-assets";
import { Card, CardContent } from "@/components/ui/card";
import { PARTNERS_DATA } from "@/data/partners";
import * as Dialog from "@radix-ui/react-dialog";
import { ExternalLink, X, Globe, Mail, MessageCircle, Youtube, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/components/landing/motion";

const COPY = normalizeLocalizedTree({
  en: {
    title: "In Partnership With",
    subtitle: "Organizations collaborating with us to build the open tech ecosystem",
    visitWebsite: "Visit Website",
    close: "Close"
  },
  bn: {
    title: "আমাদের পার্টনার্স",
    subtitle: "ওপেন টেক ইকোসিস্টেম গড়ে তুলতে যারা আমাদের সাথে কাজ করছেন",
    visitWebsite: "ওয়েবসাইট ভিজিট করুন",
    close: "বন্ধ করুন"
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 110, damping: 20 }
  }
};

export default function EcosystemPartners({ lang }) {
  const t = COPY[lang] || COPY.en;
  const [selectedPartner, setSelectedPartner] = useState(null);

  return (
    <section className="relative w-full py-12 md:py-16 lg:py-24 overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="container relative z-10 mx-auto px-6 max-w-6xl text-center">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-gradient-brand">{t.title}</h2>
          <p className="mt-4 text-muted-foreground">{t.subtitle}</p>
        </motion.div>

        <motion.div
          className="mt-12 flex lg:grid lg:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory pb-8 -mx-6 px-6 lg:mx-0 lg:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {PARTNERS_DATA.map((partner, idx) => (
            <motion.div key={idx} variants={cardVariants} className="w-[85vw] sm:w-[320px] lg:w-auto shrink-0 snap-center">
              <Card
                onClick={() => setSelectedPartner(partner)}
                className="w-full h-full glass-card-hover cursor-pointer overflow-hidden rounded-[2rem] border border-border/50 bg-card/50 shadow-lg backdrop-blur-xl transition-all duration-300"
              >
                <CardContent className="flex h-full flex-col items-center justify-center space-y-6 p-8">
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-4 shadow-inner ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-105 overflow-hidden">
                    <img src={withBrandAssetVersion(partner.logo)} alt={partner.name} className="w-full h-full object-contain drop-shadow-md z-10" loading="lazy" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-foreground text-lg">{partner.name}</h3>
                    <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider">{partner.type[lang] || partner.type.en}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Dialog.Root open={!!selectedPartner} onOpenChange={(open) => !open && setSelectedPartner(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md transition-all duration-300" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[100] w-[90vw] max-w-lg max-h-[85vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-primary/10 glass-premium p-6 sm:p-10 shadow-2xl focus:outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {selectedPartner && (
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-4 shadow-inner ring-1 ring-primary/20 relative overflow-hidden">
                  <img src={withBrandAssetVersion(selectedPartner.logo)} alt={selectedPartner.name} className="w-full h-full object-contain drop-shadow-lg z-10" />
                </div>
                
                <div className="space-y-2">
                  <Dialog.Title className="text-2xl font-black text-foreground">
                    {selectedPartner.name}
                  </Dialog.Title>
                  <p className="text-sm font-bold text-primary tracking-wide uppercase">
                    {selectedPartner.type[lang] || selectedPartner.type.en}
                  </p>
                </div>

                <Dialog.Description className="text-sm leading-relaxed text-muted-foreground">
                  {selectedPartner.description[lang] || selectedPartner.description.en}
                </Dialog.Description>

                <div className="w-full h-px bg-border/50 my-4" />

                <div className="flex flex-wrap justify-center gap-3 w-full">
                  {Object.entries(selectedPartner.links).map(([key, url]) => (
                    <a 
                      key={key} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                    >
                      {getIconForLink(key)}
                      {key}
                    </a>
                  ))}
                </div>

                <div className="mt-6 w-full flex flex-col gap-3">
                  <Button asChild size="lg" className="w-full rounded-xl font-bold text-md btn-glow">
                    <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      {t.visitWebsite}
                    </a>
                  </Button>
                  <Dialog.Close asChild>
                    <Button variant="ghost" className="w-full rounded-xl">
                      {t.close}
                    </Button>
                  </Dialog.Close>
                </div>
              </div>
            )}
            
            <Dialog.Close className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors focus:outline-none">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
