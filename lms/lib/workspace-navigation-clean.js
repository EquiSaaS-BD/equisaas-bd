import {
  BookOpen,
  Building2,
  ClipboardList,
  Compass,
  Gem,
  Medal,
  Megaphone,
  Settings,
  ShieldCheck,
  UserCircle2,
  Vote,
  Workflow,
} from "lucide-react";

export const workspaceNavSections = [
  {
    key: "start",
    icon: Compass,
    title: ["Start here", "এখান থেকেই শুরু"],
    items: [
      {
        href: "/dashboard",
        icon: Compass,
        label: ["Dashboard", "ড্যাশবোর্ড"],
        desc: ["Monitor your progress and next actions.", "আপনার অগ্রগতি ও পরবর্তী করণীয় দেখুন।"],
      },
      {
        href: "/department",
        icon: Building2,
        label: ["Department", "ডিপার্টমেন্ট"],
        desc: ["See your co-builder scope, curriculum, and active updates.", "আপনার co-builder scope, curriculum এবং active update দেখুন।"],
      },
      {
        href: "/manual",
        icon: UserCircle2,
        label: ["Manual", "ম্যানুয়াল"],
        desc: ["Learn your role, workflow, and platform rules clearly.", "আপনার role, workflow এবং platform rules পরিষ্কারভাবে বুঝুন।"],
      },
    ],
  },
  {
    key: "learning",
    icon: BookOpen,
    title: ["Learning", "লার্নিং"],
    items: [
      {
        href: "/courses",
        icon: BookOpen,
        label: ["Courses", "কোর্স"],
        desc: ["Follow your department learning path in order.", "আপনার department learning path ধাপে ধাপে follow করুন।"],
      },
      {
        href: "/lesson",
        icon: Workflow,
        label: ["Lessons", "লেসন"],
        desc: ["Open individual lessons, resources, and training instructions.", "প্রতিটি lesson, resource এবং training instruction খুলুন।"],
      },
      {
        href: "/task",
        icon: ClipboardList,
        label: ["Tasks", "টাস্ক"],
        desc: ["Submit proof of work from your assigned learning flow.", "আপনার assigned learning flow থেকে proof of work submit করুন।"],
      },
    ],
  },
  {
    key: "records",
    icon: Medal,
    title: ["Records", "রেকর্ড"],
    items: [
      {
        href: "/submissions",
        icon: ShieldCheck,
        label: ["Submissions", "সাবমিশন"],
        desc: ["Track pending, revision, and approved proof records.", "pending, revision এবং approved proof record track করুন।"],
      },
      {
        href: "/points",
        icon: Medal,
        label: ["Points", "পয়েন্ট"],
        desc: ["See the raw contribution ledger that feeds My Share.", "My Share-এ যুক্ত হওয়া raw contribution ledger দেখুন।"],
      },
      {
        href: "/announcements",
        icon: Megaphone,
        label: ["Announcements", "ঘোষণা"],
        desc: ["Stay updated with official team and platform notices.", "official team এবং platform notice সম্পর্কে আপডেট থাকুন।"],
      },
    ],
  },
  {
    key: "ownership",
    icon: Gem,
    title: ["Ownership", "মালিকানা"],
    items: [
      {
        href: "/equity",
        icon: Gem,
        label: ["My Share", "আমার শেয়ার"],
        desc: ["Track Sweat Equity Units and ownership milestones.", "Sweat Equity Unit এবং ownership milestone track করুন।"],
      },
      {
        href: "/governance",
        icon: Vote,
        label: ["Co-op Governance", "কো-অপ গভর্ন্যান্স"],
        desc: ["Vote on roadmap and cooperative policy proposals.", "Roadmap এবং cooperative policy proposal-এ vote দিন।"],
      },
    ],
  },
  {
    key: "core-governance",
    icon: ShieldCheck,
    title: ["Core Governance", "কোর গভর্ন্যান্স"],
    items: [
      {
        href: "/review",
        icon: ShieldCheck,
        label: ["Review Queue", "রিভিউ কিউ"],
        desc: ["Evaluate pending submissions and leave grounded feedback.", "pending submission evaluate করে grounded feedback দিন।"],
        requiresReview: true,
      },
      {
        href: "/manage",
        icon: Settings,
        label: ["Stewardship", "স্টিউয়ার্ডশিপ"],
        desc: ["Coordinate curriculum, co-builders, attendance, and transparent records.", "curriculum, co-builder, attendance এবং transparent record coordinate করুন।"],
        requiresManagement: true,
      },
    ],
  },
];

export function getVisibleWorkspaceNavSections({ canManage = false, canReview = false } = {}) {
  return workspaceNavSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.requiresManagement && !canManage) return false;
        if (item.requiresReview && !canReview) return false;
        return true;
      }),
    }))
    .filter((section) => section.items.length);
}

export function getCurrentWorkspaceItem(pathname, sections) {
  return sections.flatMap((section) => section.items).find((item) => item.href === pathname) || sections[0]?.items[0] || null;
}
