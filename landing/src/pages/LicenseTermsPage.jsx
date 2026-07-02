import React from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, AlertTriangle, Scale, Terminal } from "lucide-react";
import LegalLayout from "@/components/landing/LegalLayout";

const CONTENT = {
  en: {
    title: "Software License Agreement",
    intro: "This license governs the use of BD ERP POS (the \"Software\"). By installing the software, you agree to these terms between your business and EquiSaaS BD.",
    features: [
      {
        icon: <CheckCircle2 className="w-6 h-6" />,
        title: "Authorized Usage",
        color: "text-primary",
        items: [
          "Perpetual License: Each purchase grants a permanent, lifetime license for the specific version and all its minor updates.",
          "Hardware Locking: Licenses are locked to the hardware ID of the primary installation machine to prevent unauthorized duplication.",
          "Commercial Use: The software is fully authorized for use in any registered business in Bangladesh."
        ]
      },
      {
        icon: <AlertTriangle className="w-6 h-6" />,
        title: "Strict Prohibitions",
        color: "text-destructive",
        items: [
          "No Reverse Engineering: You may not decompile, disassemble, or attempt to derive the source code.",
          "No Distribution: You may not resell, rent, lease, or distribute setup packages or license keys.",
          "No Multi-Store Cloning: A single license is intended for a single business location."
        ]
      }
    ],
    disclaimer: {
      title: "Legal Disclaimers",
      items: [
        "As-Is Warranty: The software is provided \"as-is\". Final responsibility for tax compliance lies with the user.",
        "Liability Limit: EquiSaaS BD is not liable for data loss due to hardware failure or lack of backups."
      ]
    },
    footer: "© 2026 EquiSaaS BD • Dhaka, Bangladesh"
  },
  bn: {
    title: "সফটওয়্যার লাইসেন্স চুক্তি",
    intro: "এই লাইসেন্সটি BD ERP POS (দ্য \"সফটওয়্যার\") ব্যবহারের নিয়মাবলী নির্ধারণ করে। সফটওয়্যারটি ইনস্টল করার মাধ্যমে আপনি আপনার ব্যবসা এবং EquiSaaS BD-এর মধ্যকার এই শর্তাবলীতে সম্মতি দিচ্ছেন।",
    features: [
      {
        icon: <CheckCircle2 className="w-6 h-6" />,
        title: "অনুমোদিত ব্যবহার",
        color: "text-primary",
        items: [
          "পারমানেন্ট লাইসেন্স: প্রতিটি পারচেজ নির্দিষ্ট ভার্সন এবং এর মাইনর আপডেটগুলোর জন্য আজীবন লাইসেন্স প্রদান করে।",
          "হার্ডওয়্যার লকিং: অননুমোদিত অনুলিপি রোধ করতে লাইসেন্সটি ইনস্টলেশন মেশিনের হার্ডওয়্যার আইডির সাথে লক করা থাকে।",
          "বাণিজ্যিক ব্যবহার: বাংলাদেশে যেকোনো নিবন্ধিত ব্যবসায় এই সফটওয়্যারটি ব্যবহারের পূর্ণ অনুমতি রয়েছে।"
        ]
      },
      {
        icon: <AlertTriangle className="w-6 h-6" />,
        title: "কঠোর নিষেধাজ্ঞা",
        color: "text-destructive",
        items: [
          "রিভার্স ইঞ্জিনিয়ারিং নিষেধ: আপনি সফটওয়্যারটির সোর্স কোড বের করার চেষ্টা বা ডিকম্পাইল করতে পারবেন না।",
          "বিতরণ নিষেধ: আপনি সেটআপ প্যাকেজ বা লাইসেন্স কি পুনবিক্রয় বা বিতরণ করতে পারবেন না।",
          "মাল্টি-স্টোর ক্লোনিং নিষেধ: একটি লাইসেন্স শুধুমাত্র একটি ব্যবসায়িক লোকেশনের জন্য প্রযোজ্য।"
        ]
      }
    ],
    disclaimer: {
      title: "আইনি ঘোষণা (Disclaimers)",
      items: [
        "As-Is ওয়ারেন্টি: সফটওয়্যারটি \"as-is\" ভিত্তিতে প্রদান করা হয়। ট্যাক্স কমপ্লায়েন্সের চূড়ান্ত দায়িত্ব ইউজারের।",
        "দায়ের সীমাবদ্ধতা: হার্ডওয়্যার ব্যর্থতা বা ব্যাকআপের অভাবে ডেটা লসের জন্য EquiSaaS BD দায়ী থাকবে না।"
      ]
    },
    footer: "© ২০২৬ EquiSaaS BD • ঢাকা, বাংলাদেশ"
  }
};

const LicenseTermsPage = () => {
  return (
    <LegalLayout>
      {({ lang }) => {
        const t = CONTENT[lang] || CONTENT.en;
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            <section className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/50 leading-tight">
                {t.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                {t.intro}
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
              {t.features.map((section, i) => (
                <div key={i} className="group p-8 rounded-[2.5rem] border border-border/50 bg-card/50 hover:bg-card transition-all hover:shadow-2xl hover:shadow-primary/5">
                  <div className={`w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-6 ${section.color} group-hover:scale-110 transition-transform`}>
                    {section.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-6">{section.title}</h3>
                  <ul className="space-y-4">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex gap-3 text-muted-foreground leading-relaxed">
                        <span className="text-primary font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <section className="space-y-8 py-8 border-t border-border/50">
              <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                <Scale className="w-8 h-8 text-primary" />
                {t.disclaimer.title}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {t.disclaimer.items.map((item, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-muted/30 border border-border/30 italic text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <div className="bg-muted/50 p-8 rounded-[2rem] border border-border/50 font-mono text-sm text-muted-foreground/60 overflow-hidden relative">
              <Terminal className="absolute -right-4 -bottom-4 w-32 h-32 opacity-5 rotate-12" />
              <div className="flex items-center gap-2 mb-4 font-bold text-foreground/40">
                <Terminal className="w-4 h-4" />
                <span>LICENSE_FINGERPRINT_VERIFICATION</span>
              </div>
              <p>ID: BD-ERP-POS-v0.0.21-STABLE-RELEASE</p>
              <p>VENDOR: EQUISAAS-BD-COOPERATIVE</p>
              <p>REGION: BD_LOCAL_X64</p>
            </div>

            <footer className="pt-12 border-t border-border/50 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              {t.footer}
            </footer>
          </motion.div>
        );
      }}
    </LegalLayout>
  );
};

export default LicenseTermsPage;
