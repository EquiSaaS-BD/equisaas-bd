import React from "react";
import { GraduationCap, Users2, BriefcaseBusiness, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import "./PersonaRouter.module.scss";

const PERSONA_COPY = normalizeLocalizedTree({
  en: {
    badge: "Who EquiSaaS BD Serves",
    title: "One platform for learning tech skills, building community-led SaaS, and preparing SME software for Bangladesh.",
    description: "EquiSaaS BD connects software training in Bangladesh with real operational work. Students learn, contributors build, and SME teams prepare for practical HR payroll, POS, and pharmacy inventory software.",
    personas: [
      {
        icon: GraduationCap,
        title: "For Bangladesh students and freshers",
        description: "Start with practical frontend, backend, DevOps, UI UX, product, business analysis, marketing, or CRM learning paths. The LMS connects lessons, proof submission, mentor review, and contribution records in one place.",
        cta: "Explore software training in Bangladesh",
        href: "/software-training-bangladesh",
      },
      {
        icon: Users2,
        title: "For contributors joining a community-driven SaaS ecosystem",
        description: "Join Bangladesh's first open tech cooperative with one department at a time, role-based review, and sweat equity aligned to real contribution. This is designed to replace unpaid internship culture with accountable production work.",
        cta: "Enter the EquiSaaS BD LMS",
        href: "/lms/login",
      },
      {
        icon: BriefcaseBusiness,
        title: "For Bangladesh SME owners",
        description: "Follow the roadmap for Bangladesh-focused SaaS tools including HR payroll software, POS software, and pharmacy inventory software. Our product direction is built around local operations, affordability, and clear onboarding.",
        cta: "See SME software plans",
        href: "/sme-software-bangladesh",
      },
    ],
  },
  bn: {
    badge: "EquiSaaS BD কাদের জন্য",
    title: "একটি প্ল্যাটফর্মে টেক স্কিল শেখা, কমিউনিটি-চালিত SaaS তৈরি, এবং বাংলাদেশি SME সফটওয়্যার প্রস্তুতি।",
    description: "EquiSaaS BD বাংলাদেশে সফটওয়্যার ট্রেনিংকে বাস্তব অপারেশনাল কাজের সঙ্গে যুক্ত করে। শিক্ষার্থীরা শেখে, contributors বাস্তব কাজ করে, আর SME টিমগুলো HR payroll, POS, এবং pharmacy inventory সফটওয়্যারের প্রস্তুতি দেখতে পারে।",
    personas: [
      {
        icon: GraduationCap,
        title: "বাংলাদেশের ছাত্রছাত্রী ও freshers-দের জন্য",
        description: "Frontend, backend, DevOps, UI UX, product, business analysis, marketing, বা CRM learning path দিয়ে শুরু করুন। LMS-এর ভেতরে lesson, proof submission, mentor review, এবং contribution record একসাথে যুক্ত থাকে।",
        cta: "বাংলাদেশে software training দেখুন",
        href: "/software-training-bangladesh",
      },
      {
        icon: Users2,
        title: "কমিউনিটি-চালিত SaaS ecosystem-এ contributor হতে চাইলে",
        description: "এক সময় এক department, role-based review, আর real contribution-ভিত্তিক sweat equity সহ বাংলাদেশের প্রথম open tech cooperative workflow-এ যোগ দিন। এটি unpaid internship culture-এর একটি বাস্তব বিকল্প।",
        cta: "EquiSaaS BD LMS-এ প্রবেশ করুন",
        href: "/lms/login",
      },
      {
        icon: BriefcaseBusiness,
        title: "বাংলাদেশের SME owner-দের জন্য",
        description: "বাংলাদেশি ব্যবসার জন্য HR payroll software, POS software, এবং pharmacy inventory software roadmap দেখুন। আমাদের product direction local operations, affordability, এবং clear onboarding-এর উপর ভিত্তি করে তৈরি।",
        cta: "SME software roadmap দেখুন",
        href: "/sme-software-bangladesh",
      },
    ],
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

export default function PersonaRouter({ lang }) {
  const t = PERSONA_COPY[lang];

  return (
    <section id="audiences" className="persona-router">
      <div className="container">
        {/* Header */}
        <motion.div
          className="persona-router__header"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="badge">
            <span className="badge__dot" />
            {t.badge}
          </div>
          <motion.h2
            className="persona-router__title"
            custom={0.5}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            {t.title}
          </motion.h2>
          <motion.p
            className="persona-router__description"
            custom={0.6}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            {t.description}
          </motion.p>
        </motion.div>

        {/* Personas Grid */}
        <motion.div
          className="persona-router__grid"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {t.personas.map((persona, index) => {
            const Icon = persona.icon;
            return (
              <motion.div
                key={persona.title}
                className="persona-card"
                custom={index + 1}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <div className="persona-card__icon">
                  <Icon className="icon" />
                </div>
                <div className="persona-card__content">
                  <h3 className="persona-card__title">{persona.title}</h3>
                  <p className="persona-card__description">{persona.description}</p>
                  <a href={persona.href} className="persona-card__cta">
                    {persona.cta}
                    <ArrowRight className="cta__icon" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}