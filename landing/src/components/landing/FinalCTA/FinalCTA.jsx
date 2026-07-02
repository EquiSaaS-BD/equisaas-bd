import React from "react";
import { ArrowRight, BookOpenCheck, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { APPLICATION_LINK, LINKS } from "@/data/cofounder";
import "./FinalCTA.module.scss";

const CTA_COPY = normalizeLocalizedTree({
  en: {
    badge: "Ready to Begin?",
    title: "Join Bangladesh's First Open Tech Cooperative",
    description: "Start your journey with practical learning, real contribution, and a path to ownership. No unpaid internships. No empty promises. Just real work, real skills, and real ownership.",
    primaryCta: "Open the LMS",
    secondaryCta: "Contact Support",
    applyCta: "Open registration form",
    reassurance: "Bilingual. Proof-based. Bangladesh-first.",
  },
  bn: {
    badge: "শুরু করার জন্য প্রস্তুত?",
    title: "বাংলাদেশের প্রথম Open Tech Cooperative-এ যোগ দিন",
    description: "বাস্তব শিক্ষা, প্রকৃত অবদান, এবং মালিকানার পথে আপনার যাত্রা শুরু করুন। কোনো অবৈতনিক ইন্টার্নশিপ নয়। কোনো ফাঁকা প্রতিশ্রুতি নয়। শুধু বাস্তব কাজ, বাস্তব দক্ষতা, এবং প্রকৃত মালিকানা।",
    primaryCta: "LMS এ প্রবেশ",
    secondaryCta: "সাপোর্টে যোগাযোগ করুন",
    applyCta: "রেজিস্ট্রেশন ফর্ম খুলুন",
    reassurance: "দ্বিভাষী। প্রমাণ-ভিত্তিক। বাংলাদেশ-প্রথম।",
  },
});

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  })
};

export default function FinalCTA({ lang }) {
  const t = CTA_COPY[lang];

  return (
    <section className="final-cta">
      <div className="final-cta__background" />
      <div className="container">
        <motion.div
          className="final-cta__content"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {/* Badge */}
          <motion.div
            className="final-cta__badge"
            custom={0}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <span className="badge__dot" />
            {t.badge}
          </motion.div>

          {/* Title */}
          <motion.h2
            className="final-cta__title"
            custom={0.1}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            {t.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            className="final-cta__description"
            custom={0.2}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            {t.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="final-cta__actions"
            custom={0.3}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <a href="/lms/login" className="btn btn--primary">
              <BookOpenCheck className="btn__icon" />
              {t.primaryCta}
            </a>
            <a href={LINKS.whatsappLink} target="_blank" rel="noreferrer" className="btn btn--secondary">
              <MessageCircle className="btn__icon" />
              {t.secondaryCta}
              <ArrowRight className="btn__arrow" />
            </a>
          </motion.div>

          {/* Reassurance */}
          <motion.p
            className="final-cta__reassurance"
            custom={0.4}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            {t.reassurance}
          </motion.p>
          <motion.p
            className="final-cta__reassurance"
            custom={0.45}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <a href={APPLICATION_LINK} target="_blank" rel="noreferrer">
              {t.applyCta}
            </a>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
