import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server, Globe } from "lucide-react";
import LegalLayout from "@/components/landing/LegalLayout";

const CONTENT = {
  en: {
    title: "Data Privacy & Offline Security",
    intro: "At EquiSaaS BD, we prioritize your business autonomy. Our software is designed with an \"Offline-First\" philosophy, ensuring that your sensitive business data remains under your physical control.",
    features: [
      {
        icon: <Server className="w-6 h-6" />,
        title: "Local Storage",
        desc: "All transaction, inventory, and accounting data is stored locally on your machine. We do not sync your business data to our servers."
      },
      {
        icon: <Lock className="w-6 h-6" />,
        title: "No Cloud Tracking",
        desc: "We do not track your daily sales, profit margins, or customer lists. Your business numbers are your business alone."
      },
      {
        icon: <Eye className="w-6 h-6" />,
        title: "Data Sovereignty",
        desc: "You own 100% of the database. You can back it up to physical drives or export it at any time without our intervention."
      },
      {
        icon: <Globe className="w-6 h-6" />,
        title: "Minimal Telemetry",
        desc: "We only collect basic software versioning and hardware IDs for license verification and update delivery."
      }
    ],
    sections: [
      {
        title: "Full Privacy Disclosure",
        items: [
          "1. Data Collection: The BD ERP POS software does not automatically transmit business data (invoices, customers, stocks) to EquiSaaS BD or any third party.",
          "2. License Verification: During activation, the software sends a unique Hardware ID to our servers to issue a permanent license key. This is a one-time process for offline verification.",
          "3. Updates: The software checks for updates. This request only shares the current software version to determine if a newer patch is available.",
          "4. Backups: Automated backups are stored in a local directory of your choice. It is the user's responsibility to secure these files."
        ]
      }
    ],
    footer: "Last Updated: May 2026 • EquiSaaS BD Privacy Office"
  },
  bn: {
    title: "ডেটা প্রাইভেসী এবং অফলাইন সিকিউরিটি",
    intro: "EquiSaaS BD-তে আমরা আপনার ব্যবসার স্বায়ত্তশাসনকে অগ্রাধিকার দিই। আমাদের সফটওয়্যারটি \"Offline-First\" দর্শনে তৈরি, যা নিশ্চিত করে যে আপনার সংবেদনশীল ব্যবসায়িক ডেটা আপনার নিজের নিয়ন্ত্রণে থাকে।",
    features: [
      {
        icon: <Server className="w-6 h-6" />,
        title: "লোকাল স্টোরেজ",
        desc: "লেনদেন, ইনভেন্টরি এবং অ্যাকাউন্টিংয়ের সব ডেটা আপনার কম্পিউটারে সংরক্ষিত থাকে। আমরা আপনার ব্যবসায়িক ডেটা আমাদের সার্ভারে সিঙ্ক করি না।"
      },
      {
        icon: <Lock className="w-6 h-6" />,
        title: "ক্লাউড ট্র্যাকিং নেই",
        desc: "আমরা আপনার প্রতিদিনের বিক্রি, মুনাফা বা কাস্টমার লিস্ট ট্র্যাক করি না। আপনার ব্যবসার হিসাব শুধুমাত্র আপনারই।"
      },
      {
        icon: <Eye className="w-6 h-6" />,
        title: "ডেটা সার্বভৌমত্ব",
        desc: "ডেটাবেজের ১০০% মালিকানা আপনার। আপনি যেকোনো সময় ব্যাকআপ নিতে বা ডেটা এক্সপোর্ট করতে পারেন।"
      },
      {
        icon: <Globe className="w-6 h-6" />,
        title: "ন্যূনতম টেলিমেট্রি",
        desc: "লাইসেন্স ভেরিফিকেশন এবং আপডেটের জন্য আমরা শুধুমাত্র সফটওয়্যার ভার্সন এবং হার্ডওয়্যার আইডি সংগ্রহ করি।"
      }
    ],
    sections: [
      {
        title: "প্রাইভেসী ডিসক্লোজার",
        items: [
          "১. ডেটা সংগ্রহ: BD ERP POS সফটওয়্যার স্বয়ংক্রিয়ভাবে কোনো ব্যবসায়িক ডেটা আমাদের কাছে বা তৃতীয় কোনো পক্ষের কাছে পাঠায় না।",
          "২. লাইসেন্স ভেরিফিকেশন: অ্যাক্টিভেশনের সময় সফটওয়্যারটি একটি ইউনিক হার্ডওয়্যার আইডি পাঠায় পারমানেন্ট লাইসেন্স ইস্যু করার জন্য।",
          "৩. আপডেট: সফটওয়্যারটি আপডেটের জন্য শুধুমাত্র বর্তমান ভার্সন শেয়ার করে নতুন কোনো প্যাচ আছে কি না তা যাচাই করতে।",
          "৪. ব্যাকআপ: অটোমেটেড ব্যাকআপ আপনার নির্ধারিত ফোল্ডারে থাকে। এই ফাইলগুলো সুরক্ষিত রাখার দায়িত্ব ইউজারের।"
        ]
      }
    ],
    footer: "সর্বশেষ আপডেট: মে ২০২৬ • EquiSaaS BD প্রাইভেসী অফিস"
  }
};

const PrivacyPolicyPage = () => {
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
              {t.features.map((item, i) => (
                <div key={i} className="group p-8 rounded-[2.5rem] border border-border/50 bg-card/50 hover:bg-card transition-all hover:shadow-2xl hover:shadow-primary/5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {t.sections.map((section, idx) => (
              <section key={idx} className="space-y-8 py-8 border-t border-border/50">
                <h2 className="text-3xl font-black uppercase tracking-tight">{section.title}</h2>
                <div className="space-y-6">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex gap-4 p-6 rounded-3xl bg-muted/30 border border-border/30">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0" />
                      <p className="text-lg text-muted-foreground leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <footer className="pt-12 border-t border-border/50 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              {t.footer}
            </footer>
          </motion.div>
        );
      }}
    </LegalLayout>
  );
};

export default PrivacyPolicyPage;
