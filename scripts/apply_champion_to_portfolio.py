"""
Apply the National Champion upgrade (Zero Olympiad Season 2, SDG 15)
to the founder portfolio project at D:\\projects\\kholipha-ahmmad-al-amin.equisaas-bd.com.

Source of truth: D:\\projects\\EquiSaaS BD\\landing\\src\\components\\landing\\AchievementsAndPartnerships.jsx
Narrative:
  - Out of a national pool of 9,332 Round 1 contestants narrowed to 3,407 in Round 2
  - Emerged as official SDG ACHIEVER (CHAMPION) at the Grand Finale on June 13, 2026
  - Represented Atish Dipankar University of Science & Technology (ADUST)
  - Rigorous evaluation, supported by learning partners like TESOL Bangladesh
  - Assessed: content relevance, creativity, communication, technical quality, environmental impact
"""

from pathlib import Path
import sys

PORTFOLIO = Path(r"D:\projects\kholipha-ahmmad-al-amin.equisaas-bd.com")

# ---------- File 1: activitiesData.js id=7 ----------
ACTIVITIES = PORTFOLIO / "src" / "data" / "activitiesData.js"

activities_old = """  {
    id: 7,
    title: "Top 51 Finalist & SDG 15 Achiever",
    organization: "Zero Olympiad Grand Finals",
    period: "2026",
    type: "leadership",
    icon: "users",
    description: "Competed and qualified in the national grand finals ranking in the top 51 out of 9332 competitors, and named an SDG 15 (Life on Land) Achiever representing ADUST.",
    achievements: ["Top 51 Finalist", "SDG 15 Achiever", "9332+ Contestants"]
  }"""

activities_new = """  {
    id: 7,
    title: "National Champion (SDG Achiever) - SDG 15 | Zero Olympiad Grand Finals (Season 2)",
    organization: "Zero Olympiad Grand Finals - Representing Atish Dipankar University of Science & Technology (ADUST)",
    period: "June 13, 2026",
    type: "leadership",
    icon: "trophy",
    description: "Emerged as the official SDG ACHIEVER (CHAMPION) at the Grand Finale on June 13, 2026, out of a national pool of 9,332 Round 1 contestants narrowed to 3,407 in Round 2, representing Atish Dipankar University of Science & Technology (ADUST). The rigorous evaluation, supported by learning partners including TESOL Bangladesh, assessed content relevance, creativity, communication, technical quality, and overall environmental impact.",
    achievements: ["National Champion (SDG Achiever)", "Out of 9,332 Round 1 \u2192 3,407 Round 2 Pool", "Representing ADUST", "Evaluated by TESOL Bangladesh"]
  }"""

# ---------- File 2: certificationsData.js line 23 ----------
CERTS = PORTFOLIO / "src" / "data" / "certificationsData.js"

certs_old = """            { title: "Zero Olympiad Top 51 Finalist & SDG 15 Achiever", org: "Zero Olympiad", date: "2026-03-10", type: "Academic", file: "Zero_Olympiad_Finalist.pdf", tags: ["SDG 15", "Olympiad", "Finalist"] },"""

certs_new = """            { title: "Zero Olympiad National Champion (SDG Achiever) - SDG 15 (Season 2)", org: "Zero Olympiad Grand Finals", date: "2026-06-13", type: "Academic", file: "Zero_Olympiad_Finalist.pdf", tags: ["National Champion", "SDG 15", "Season 2", "9,332 \u2192 3,407 Pool", "TESOL Bangladesh"] },"""

# ---------- File 3: siteContentDefaults.js zero-olympiad-2026 card ----------
SITE = PORTFOLIO / "src" / "data" / "siteContentDefaults.js"

site_old = """    {
      id: 'zero-olympiad-2026',
      title: 'Zero Olympiad Grand Finals',
      subtitle: 'Top 51 Finalist & SDG 15 Achiever',
      description:
        'Emerged in the Top 51 Finalists nationwide out of 9,332 contestants, named SDG 15 (Life on Land) Achiever representing ADUST.',
      meta: 'Zero Olympiad | Mar 2026',
      icon: 'trophy',
      href: '/files/Certificates/Zero_Olympiad_Finalist.pdf',
    },"""

site_new = """    {
      id: 'zero-olympiad-2026',
      title: 'Zero Olympiad Grand Finals (Season 2)',
      subtitle: 'National Champion (SDG Achiever) - SDG 15',
      description:
        'Emerged as the official SDG ACHIEVER (CHAMPION) at the Grand Finale on June 13, 2026, out of a national pool of 9,332 Round 1 contestants narrowed to 3,407 in Round 2, representing Atish Dipankar University of Science & Technology (ADUST). The rigorous evaluation, supported by learning partners including TESOL Bangladesh, assessed content relevance, creativity, communication, technical quality, and overall environmental impact.',
      meta: 'Zero Olympiad | June 13, 2026',
      icon: 'trophy',
      href: '/files/Certificates/Zero_Olympiad_Finalist.pdf',
    },"""

# ---------- File 4: chatbotData.js Key Achievements response ----------
CHATBOT = PORTFOLIO / "src" / "data" / "chatbotData.js"

chatbot_old = """    keywords: [\"achievement\", \"award\", \"buildfest\", \"olympiad\", \"zero\", \"sdg\"],
    response: \"\ud83c\udfc6 **Key Achievements:**\\n\\n\u2022 **Infinity AI BuildFest 2026 National Finalist** (E-Commerce Track) at BRAC University out of 3,360 contestants and 612 teams with EquiPulse AI.\\n\u2022 **Zero Olympiad Top 51 Finalist & SDG 15 Achiever** out of 9,332 contestants nationwide, representing ADUST.\""""

chatbot_new = """    keywords: [\"achievement\", \"award\", \"buildfest\", \"olympiad\", \"zero\", \"sdg\"],
    response: \"\ud83c\udfc6 **Key Achievements:**\\n\\n\u2022 **Zero Olympiad Grand Finals (Season 2) - National Champion (SDG Achiever) - SDG 15**: Emerged as the official SDG ACHIEVER (CHAMPION) at the Grand Finale on June 13, 2026, out of a national pool of 9,332 Round 1 contestants narrowed to 3,407 in Round 2, representing Atish Dipankar University of Science & Technology (ADUST). Evaluation, supported by learning partners like TESOL Bangladesh, assessed content relevance, creativity, communication, technical quality, and environmental impact.\\n\\n\u2022 **Infinity AI BuildFest 2026 National Finalist** (E-Commerce Track) at BRAC University out of 3,360 contestants and 612 teams with EquiPulse AI.\""""

# ---------- Apply ----------
def apply(path: Path, old: str, new: str, label: str) -> bool:
    if not path.exists():
        print(f"[MISS] {label}: file not found at {path}", file=sys.stderr)
        return False
    text = path.read_text(encoding="utf-8")
    if old not in text:
        print(f"[SKIP] {label}: old string not found verbatim in {path.name}", file=sys.stderr)
        return False
    if text.count(old) != 1:
        print(f"[SKIP] {label}: old string matches {text.count(old)} times in {path.name} (need exactly 1)", file=sys.stderr)
        return False
    path.write_text(text.replace(old, new), encoding="utf-8")
    print(f"[OK]   {label}: {path.name} updated")
    return True

results = [
    apply(ACTIVITIES, activities_old, activities_new, "activitiesData.js id=7"),
    apply(CERTS, certs_old, certs_new, "certificationsData.js Zero Olympiad entry"),
    apply(SITE, site_old, site_new, "siteContentDefaults.js zero-olympiad-2026 card"),
    apply(CHATBOT, chatbot_old, chatbot_new, "chatbotData.js Key Achievements response"),
]

print()
print(f"Summary: {sum(results)}/{len(results)} files updated")
sys.exit(0 if all(results) else 1)
