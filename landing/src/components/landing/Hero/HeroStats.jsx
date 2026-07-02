import React from "react";
import { motion } from "framer-motion";
import { Building2, Map, Users, CheckCircle2, FileText, ExternalLink, Phone } from "lucide-react";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { APPLICATION_LINK, LINKS } from "@/data/cofounder";
import styles from "./Hero.module.scss";

const STATS_COPY = normalizeLocalizedTree({
  en: {
    stats: [
      { value: "9", label: "Departments", icon: Building2 },
      { value: "64", label: "Districts", icon: Map },
      { value: "4", label: "Groups", icon: Users },
      { value: "1", label: "Clear rule", icon: CheckCircle2 },
    ],
    signalLinks: [
      { label: "Registration Form", href: APPLICATION_LINK, icon: FileText },
      { label: "WhatsApp Support", href: LINKS.whatsappLink, icon: Phone },
      { label: "GitHub Organization", href: LINKS.githubOrg, icon: ExternalLink },
    ],
  },
  bn: {
    stats: [
      { value: "৯", label: "ডিপার্টমেন্ট", icon: Building2 },
      { value: "৬৪", label: "জেলা", icon: Map },
      { value: "৪", label: "গ্রুপ", icon: Users },
      { value: "১", label: "ক্লিয়ার রুল", icon: CheckCircle2 },
    ],
    signalLinks: [
      { label: "Registration Form", href: APPLICATION_LINK, icon: FileText },
      { label: "WhatsApp Support", href: LINKS.whatsappLink, icon: Phone },
      { label: "GitHub Organization", href: LINKS.githubOrg, icon: ExternalLink },
    ],
  },
});

export default function HeroStats({ lang }) {
  const t = STATS_COPY[lang];
  
  return (
    <section className={styles.statsSection}>
      <div className="container">
        <motion.div 
          className={styles.bentoGrid}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Bento Item 1: Departments */}
          <motion.a 
            href="/#departments"
            whileHover={{ scale: 1.02, y: -5 }}
            className={`${styles.bentoItem} ${styles.bentoMain}`}
          >
            <div className={styles.bentoHeader}>
              <Building2 className="text-primary" size={24} />
              <span className={styles.bentoLabel}>{t.stats[0].label}</span>
            </div>
            <p className={styles.bentoValue}>{t.stats[0].value}</p>
            <p className={styles.bentoSubtext}>Active across the ecosystem</p>
          </motion.a>

          {/* Bento Item 2: Districts */}
          <motion.a 
            href="/#how-it-works"
            whileHover={{ scale: 1.02, y: -5 }}
            className={`${styles.bentoItem} ${styles.bentoWide}`}
          >
            <div className={styles.bentoHeader}>
              <Map className="text-emerald-500" size={24} />
              <span className={styles.bentoLabel}>{t.stats[1].label}</span>
            </div>
            <div className={styles.bentoFlex}>
              <p className={styles.bentoValue}>{t.stats[1].value}</p>
              <div className={styles.bentoMiniGrid}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={styles.bentoDot} style={{ opacity: 0.2 + (i * 0.1) }} />
                ))}
              </div>
            </div>
            <p className={styles.bentoSubtext}>District-wide builder network</p>
          </motion.a>

          {/* Bento Item 3: Social/Signal */}
          <motion.div 
            className={`${styles.bentoItem} ${styles.bentoTall}`}
            whileHover={{ scale: 1.01 }}
          >
            <div className={styles.bentoHeader}>
              <Users className="text-amber-500" size={24} />
              <span className={styles.bentoLabel}>Community HQ</span>
            </div>
            <div className={styles.signalMiniList}>
              {t.signalLinks.map(({ label, href, icon: Icon }) => (
                <motion.a 
                  key={label} 
                  href={href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={styles.signalMiniLink}
                  whileHover={{ x: 5, color: "var(--primary)" }}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Bento Item 4: Rule */}
          <motion.a 
            href="/#our-masterplan"
            whileHover={{ scale: 1.02, y: -5 }}
            className={`${styles.bentoItem}`}
          >
            <div className={styles.bentoHeader}>
              <CheckCircle2 className="text-fuchsia-500" size={24} />
              <span className={styles.bentoLabel}>{t.stats[3].label}</span>
            </div>
            <p className={styles.bentoValue}>{t.stats[3].value}</p>
            <p className={styles.bentoSubtext}>Sweat Equity Standard</p>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
