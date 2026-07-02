import React, { useState } from "react";
import {
  AlertTriangle,
  ArchiveRestore,
  BadgeCheck,
  Banknote,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Database,
  Download,
  FileText,
  HardDrive,
  Languages,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  Mail,
  MousePointer2,
  PackageSearch,
  Printer,
  Receipt,
  RotateCw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  UploadCloud,
  UserCog,
  Users,
  Warehouse,
  Wrench,
  Zap
} from "lucide-react";
import Header from "@/components/landing/Header/Header";
import Footer from "@/components/landing/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LINKS } from "@/data/cofounder/links";

const APP_VERSION = "0.1.1";

const iconMap = {
  setup: Settings,
  pos: ShoppingBag,
  inventory: PackageSearch,
  customers: Users,
  accounting: BarChart3,
  security: ShieldCheck,
  backup: Database,
  update: RotateCw
};

const copy = {
  en: {
    badge: "BD ERP POS Operating Handbook",
    title: "Client User Manual",
    subtitle:
      "A practical A-to-Z guide for Bangladeshi SME owners, managers, cashiers, inventory teams, accountants, and auditors.",
    version: `Stable version v${APP_VERSION}`,
    quickStartTitle: "Start here",
    quickStartBody:
      "Use this manual as the store playbook. Follow the first-launch checklist once, then use the role sections for daily work.",
    setupTitle: "First-launch setup checklist",
    rolesTitle: "Role-based access map",
    presetTitle: "Business type and feature presets",
    demoTitle: "Convert demo data into your real business data",
    modulesTitle: "Step-by-step module guides",
    troubleshootTitle: "Troubleshooting and safe operating rules",
    supportTitle: "Need hands-on help?",
    supportBody:
      "Send the shop name, user role, exact screen name, and a photo or screenshot of the message. That is enough for support to trace the issue quickly.",
    languageNote: "Bangla and English can be switched from the top bar or Legal & Support.",
    routeLabel: "Open from",
    rolesLabel: "Who can use it",
    beforeLabel: "Before you start",
    stepsLabel: "Clicks and workflow",
    fieldsLabel: "Important fields",
    resultLabel: "Expected result",
    guardLabel: "Guardrails",
    dailyLabel: "Daily checklist",
    finalNote:
      "If a screen is hidden or a button is disabled, check both the user's role permissions and the enabled feature modules."
  },
  bn: {
    badge: "BD ERP POS অপারেটিং হ্যান্ডবুক",
    title: "ক্লায়েন্ট ইউজার ম্যানুয়াল",
    subtitle:
      "বাংলাদেশি SME মালিক, ম্যানেজার, ক্যাশিয়ার, স্টক টিম, অ্যাকাউন্ট্যান্ট এবং অডিটরের জন্য A-to-Z ব্যবহার গাইড।",
    version: `স্টেবল ভার্সন v${APP_VERSION}`,
    quickStartTitle: "এখান থেকে শুরু করুন",
    quickStartBody:
      "এই ম্যানুয়ালটিকে দোকানের অপারেশন প্লে-বুক হিসেবে ব্যবহার করুন। প্রথম সেটআপ একবার করুন, তারপর দৈনন্দিন কাজের জন্য role অনুযায়ী section দেখুন।",
    setupTitle: "প্রথমবার চালুর সেটআপ চেকলিস্ট",
    rolesTitle: "Role অনুযায়ী access map",
    presetTitle: "Business type এবং feature preset",
    demoTitle: "Demo data-কে নিজের real business data-তে রূপান্তর",
    modulesTitle: "প্রতিটি module-এর step-by-step guide",
    troubleshootTitle: "Troubleshooting এবং safe operating rules",
    supportTitle: "হাতে-কলমে সাহায্য দরকার?",
    supportBody:
      "দোকানের নাম, user role, কোন screen-এ সমস্যা, এবং message/screenshot পাঠান। এতে support দ্রুত root cause বের করতে পারবে।",
    languageNote: "Top bar অথবা Legal & Support থেকে Bangla/English বদলানো যাবে।",
    routeLabel: "কোথা থেকে খুলবেন",
    rolesLabel: "কারা ব্যবহার করবে",
    beforeLabel: "শুরু করার আগে",
    stepsLabel: "কোথায় click করবেন এবং workflow",
    fieldsLabel: "গুরুত্বপূর্ণ field",
    resultLabel: "কাজ শেষে যা হবে",
    guardLabel: "নিরাপত্তা guardrail",
    dailyLabel: "দৈনিক checklist",
    finalNote:
      "কোন screen না দেখালে বা button disabled থাকলে user role permission এবং enabled feature module দুটোই check করুন।"
  }
};

const setupSteps = [
  {
    icon: Download,
    en: {
      title: "Install the correct setup",
      body: "Download BD ERP POS Setup from the product page and install it once. In-app updates work only for the installed updater build, not a copied portable/dev folder."
    },
    bn: {
      title: "সঠিক setup install করুন",
      body: "Product page থেকে BD ERP POS Setup download করে একবার install করুন। In-app update শুধু updater-installed build-এ কাজ করবে, copied portable/dev folder-এ নয়।"
    }
  },
  {
    icon: Languages,
    en: {
      title: "Choose language",
      body: "Select Bangla or English. Bangla mode formats supported numbers as Bengali digits on localized screens."
    },
    bn: {
      title: "ভাষা বেছে নিন",
      body: "Bangla অথবা English বেছে নিন। Bangla mode-এ supported screen-এ সংখ্যাও বাংলা digit হিসেবে দেখাবে।"
    }
  },
  {
    icon: ClipboardList,
    en: {
      title: "Enter business profile",
      body: "Fill Business name, Owner name, Phone, Address, and Business type. These details appear in receipts, reports, invoices, and support context."
    },
    bn: {
      title: "Business profile দিন",
      body: "Business name, Owner name, Phone, Address এবং Business type পূরণ করুন। এগুলো receipt, report, invoice এবং support context-এ কাজে লাগে।"
    }
  },
  {
    icon: ShieldCheck,
    en: {
      title: "Create Super Admin",
      body: "Use a strong password with at least 10 characters, upper/lowercase, number, and symbol. This first user can manage every role and permission."
    },
    bn: {
      title: "Super Admin তৈরি করুন",
      body: "কমপক্ষে 10 character, upper/lowercase, number এবং symbol সহ strong password দিন। এই প্রথম user সব role এবং permission manage করতে পারবে।"
    }
  },
  {
    icon: Wrench,
    en: {
      title: "Confirm features",
      body: "Review Expiry, Serial/Warranty, Godown, Fractional Quantity, B2B, Accounting, Printing, and Mobile Banking toggles before finishing setup."
    },
    bn: {
      title: "Feature confirm করুন",
      body: "Setup শেষ করার আগে Expiry, Serial/Warranty, Godown, Fractional Quantity, B2B, Accounting, Printing এবং Mobile Banking toggle দেখে নিন।"
    }
  }
];

const businessPresets = [
  {
    name: "Pharmacy",
    bn: "ফার্মেসি",
    features: "Expiry tracking on; accounting, thermal/A4 printing, mobile banking on.",
    note: "Use batch number and expiry date for medicine stock."
  },
  {
    name: "Supermarket",
    bn: "সুপারমার্কেট",
    features: "Expiry tracking and fractional quantities on.",
    note: "Use fractional quantities for kg/litre items and expiry for FMCG."
  },
  {
    name: "Electronics",
    bn: "ইলেকট্রনিক্স",
    features: "Serial/Warranty and B2B wholesale billing on.",
    note: "Use serial number and warranty date for device-level tracking."
  },
  {
    name: "Sanitary & Hardware",
    bn: "স্যানিটারি ও হার্ডওয়্যার",
    features: "Godowns, fractional quantities, and B2B billing on.",
    note: "Use rack/godown location for heavy or warehouse-managed items."
  },
  {
    name: "Warehouse / Wholesale",
    bn: "ওয়্যারহাউস / পাইকারি",
    features: "Godowns, fractional quantities, and B2B billing on.",
    note: "Use B2B invoice, wholesale price tiers, and location-based stock."
  },
  {
    name: "Custom",
    bn: "কাস্টম",
    features: "Start from the default toggles and manually enable the exact modules you need.",
    note: "Custom role permissions still control who can use each enabled screen."
  }
];

const roleRows = [
  {
    role: "Super Admin / Owner / Admin",
    bnRole: "সুপার অ্যাডমিন / ওনার / অ্যাডমিন",
    can: "Everything: users, roles, setup, sales, inventory, customers, accounting, backup, recycle bin.",
    bnCan: "সবকিছু: user, role, setup, sales, inventory, customers, accounting, backup, recycle bin।",
    guard: "Use only for owners or trusted operators."
  },
  {
    role: "Manager",
    bnRole: "ম্যানেজার",
    can: "Dashboard, POS, discount, sales, inventory view/edit, godown view, customer view/manage, reports, accounting view.",
    bnCan: "Dashboard, POS, discount, sales, inventory view/edit, godown view, customer view/manage, reports, accounting view।",
    guard: "No user/security/database control unless extra permissions are added."
  },
  {
    role: "Inventory Manager",
    bnRole: "ইনভেন্টরি ম্যানেজার",
    can: "Dashboard, inventory, product edit, godown view, stock adjustment, reports.",
    bnCan: "Dashboard, inventory, product edit, godown view, stock adjustment, reports।",
    guard: "Cannot post sales or accounting by default."
  },
  {
    role: "Cashier",
    bnRole: "ক্যাশিয়ার",
    can: "Dashboard, POS access, sales invoice creation.",
    bnCan: "Dashboard, POS access, sales invoice creation।",
    guard: "Discount, inventory edit, reports, and delete actions are blocked unless granted."
  },
  {
    role: "Auditor",
    bnRole: "অডিটর",
    can: "Dashboard, reports, customer statements, accounting view, audit trail.",
    bnCan: "Dashboard, reports, customer statements, accounting view, audit trail।",
    guard: "Read-focused role; no operational posting by default."
  },
  {
    role: "Custom Role",
    bnRole: "কাস্টম role",
    can: "Only the permissions you tick in User Management -> Roles & Permissions.",
    bnCan: "User Management -> Roles & Permissions-এ যেগুলো tick করবেন শুধু সেগুলো।",
    guard: "Feature toggles still apply. A permission cannot open a disabled module."
  }
];

const demoConversion = [
  {
    icon: HardDrive,
    en: "First take a backup from Database & Backup -> Backup Now. Keep one untouched backup before importing real data.",
    bn: "প্রথমে Database & Backup -> Backup Now থেকে backup নিন। Real data import করার আগে একটি untouched backup রাখুন।"
  },
  {
    icon: Download,
    en: "Go to Inventory -> Export Products CSV. Use the exported file as the product template instead of inventing columns manually.",
    bn: "Inventory -> Export Products CSV খুলুন। Column নিজে বানানোর বদলে export করা file-টাই product template হিসেবে ব্যবহার করুন।"
  },
  {
    icon: UploadCloud,
    en: "Replace demo SKU, barcode, name, category, unit, and price values with your real shop data. Keep SKU and barcode unique.",
    bn: "Demo SKU, barcode, name, category, unit এবং price নিজের shop data দিয়ে replace করুন। SKU এবং barcode unique রাখুন।"
  },
  {
    icon: PackageSearch,
    en: "Import products, then use Stock Entry for real opening stock. Do not fake stock through sales or delete products that still have stock.",
    bn: "Product import করার পর Stock Entry দিয়ে real opening stock দিন। Sales দিয়ে stock fake করবেন না এবং stock থাকা product delete করবেন না।"
  },
  {
    icon: Users,
    en: "Use Customer Data Sync to export/import customers. Set credit limit and opening due carefully before allowing credit sales.",
    bn: "Customer Data Sync দিয়ে customer export/import করুন। Credit sale চালুর আগে credit limit এবং opening due সতর্কভাবে set করুন।"
  },
  {
    icon: ArchiveRestore,
    en: "If a demo record is not needed, first reduce its stock to zero with a valid negative adjustment, then delete it. Deleted records can be restored from Recycle Bin by permitted users.",
    bn: "কোন demo record দরকার না হলে আগে valid negative adjustment দিয়ে stock zero করুন, তারপর delete করুন। Permission থাকলে Recycle Bin থেকে restore করা যাবে।"
  }
];

const moduleGuides = [
  {
    id: "pos",
    icon: ShoppingBag,
    title: "POS / Sales Counter",
    bnTitle: "POS / বিক্রি কাউন্টার",
    route: "Dashboard -> POS",
    roles: "Cashier, Manager, Admin, Owner, Super Admin",
    purpose: "Fast retail checkout, cash/card/mobile/bank/credit payment, receipt printing, parked orders, and shift close.",
    bnPurpose: "দ্রুত retail checkout, cash/card/mobile/bank/credit payment, receipt print, parked order এবং shift close।",
    before: [
      "User must have pos.access and sales.invoice.create.",
      "Open a shift before taking sales.",
      "Products must exist with stock on hand."
    ],
    bnBefore: [
      "User-এর pos.access এবং sales.invoice.create থাকতে হবে।",
      "Sale নেওয়ার আগে shift open করতে হবে।",
      "Product এবং stock আগে থাকতে হবে।"
    ],
    steps: [
      "Click Open Register / Start Shift and enter the opening cash in drawer.",
      "Search SKU/name/barcode or scan with a barcode scanner.",
      "Click the product tile. If batch tracking applies, select the correct batch.",
      "Choose customer or keep Walk-in customer. For credit sale, a customer is required.",
      "Select Cash, Card, Mobile Banking, Bank Transfer, or Credit.",
      "Enter amount received for cash. Change due is calculated automatically.",
      "Apply discount only if the user has discount permission.",
      "Click Complete Checkout. Print thermal or A4 receipt if enabled.",
      "Use Park/Hold when a customer pauses; Resume only after clearing the current cart.",
      "At day end, click Close Shift and enter physical cash counted."
    ],
    bnSteps: [
      "Open Register / Start Shift click করে drawer-এর opening cash দিন।",
      "SKU/name/barcode search করুন অথবা barcode scanner দিয়ে scan করুন।",
      "Product tile click করুন। Batch tracking থাকলে সঠিক batch select করুন।",
      "Customer select করুন অথবা Walk-in customer রাখুন। Credit sale হলে customer বাধ্যতামূলক।",
      "Cash, Card, Mobile Banking, Bank Transfer অথবা Credit select করুন।",
      "Cash হলে amount received দিন। Change due auto calculate হবে।",
      "Discount permission থাকলেই discount apply করুন।",
      "Complete Checkout click করুন। Enabled থাকলে thermal/A4 receipt print করুন।",
      "Customer pause করলে Park/Hold ব্যবহার করুন; Resume করার আগে current cart clear করুন।",
      "দিন শেষে Close Shift click করে physical cash counted দিন।"
    ],
    fields: [
      "Amount received: cash tendered by customer.",
      "Discount mode/value: percentage or flat discount.",
      "Redeem points: customer loyalty discount.",
      "Expected cash: system-calculated drawer amount.",
      "Actual cash: physical money counted at shift close."
    ],
    bnFields: [
      "Amount received: customer যে নগদ দিয়েছে।",
      "Discount mode/value: percentage অথবা flat discount।",
      "Redeem points: customer loyalty discount।",
      "Expected cash: system-calculated drawer amount।",
      "Actual cash: shift close-এর সময় গোনা টাকা।"
    ],
    result: "Invoice, payment, stock deduction, customer credit/loyalty, accounting posting, and cashbox movement are recorded.",
    bnResult: "Invoice, payment, stock deduction, customer credit/loyalty, accounting posting এবং cashbox movement record হবে।",
    guard: "Repeated products and selected batches cannot oversell available stock. Cash underpayment and credit sale without customer are blocked.",
    bnGuard: "Repeated product ও selected batch available stock-এর বেশি sell হতে পারবে না। Cash underpayment এবং customer ছাড়া credit sale blocked।"
  },
  {
    id: "inventory",
    icon: PackageSearch,
    title: "Inventory / Stock Control",
    bnTitle: "Inventory / Stock Control",
    route: "Dashboard -> Inventory, Stock Entry, Godowns, Expiry Watch, Serials & Warranty",
    roles: "Inventory Manager, Manager, Admin, Owner, Super Admin",
    purpose: "Create products, import/export catalog, receive stock, adjust stock, track expiry, serials, godowns, and reorder signals.",
    bnPurpose: "Product তৈরি, catalog import/export, stock receive/adjust, expiry, serial, godown এবং reorder signal track করা।",
    before: [
      "Create units/categories first when needed.",
      "Enable relevant features in setup: expiry, serial/warranty, godown, fractional quantity.",
      "Stock adjustments require inventory.stock.adjust."
    ],
    bnBefore: [
      "প্রয়োজনে unit/category আগে তৈরি করুন।",
      "Setup-এ expiry, serial/warranty, godown, fractional quantity feature enable করুন।",
      "Stock adjustment করতে inventory.stock.adjust লাগবে।"
    ],
    steps: [
      "Open Inventory and click New Product.",
      "Enter SKU, barcode, product name, base unit, category, active status, and retail/wholesale/distributor prices.",
      "For expiry-enabled products, set expiry-related fields and use batch number during stock entry.",
      "For serial/warranty items, enter serial number one item at a time with warranty start/end dates.",
      "Open Stock Entry, choose movement type: Purchase Receive, Opening Balance, Positive Adjustment, or Negative Adjustment.",
      "Select product, quantity, unit cost, reference number, godown/rack if enabled, and batch/serial fields if required.",
      "Click Save Stock Entry.",
      "Use Inventory Intelligence for low stock alerts, reorder recommendations, dead stock, and category performance.",
      "Use Import Products CSV / Export Products CSV for bulk catalog work."
    ],
    bnSteps: [
      "Inventory খুলে New Product click করুন।",
      "SKU, barcode, product name, base unit, category, active status এবং retail/wholesale/distributor price দিন।",
      "Expiry-enabled product হলে expiry field set করুন এবং stock entry-তে batch number ব্যবহার করুন।",
      "Serial/warranty item হলে প্রতিটি item আলাদা করে serial number ও warranty start/end date দিন।",
      "Stock Entry খুলে movement type বেছে নিন: Purchase Receive, Opening Balance, Positive Adjustment, Negative Adjustment।",
      "Product, quantity, unit cost, reference number, enabled হলে godown/rack, প্রয়োজন হলে batch/serial field দিন।",
      "Save Stock Entry click করুন।",
      "Low stock alert, reorder recommendation, dead stock এবং category performance দেখতে Inventory Intelligence ব্যবহার করুন।",
      "Bulk catalog কাজের জন্য Import Products CSV / Export Products CSV ব্যবহার করুন।"
    ],
    fields: [
      "SKU: unique product code.",
      "Barcode: scanner-friendly code.",
      "Unit cost: purchase cost used for inventory value.",
      "Movement type: why stock is increasing or decreasing.",
      "Godown/Rack: physical location when multiple godowns are enabled."
    ],
    bnFields: [
      "SKU: unique product code।",
      "Barcode: scanner-friendly code।",
      "Unit cost: inventory value হিসাবের purchase cost।",
      "Movement type: stock কেন বাড়ছে বা কমছে।",
      "Godown/Rack: multiple godown enabled হলে physical location।"
    ],
    result: "Stock ledger updates, product catalog refreshes, and POS stock availability changes immediately.",
    bnResult: "Stock ledger update হবে, product catalog refresh হবে এবং POS stock availability সাথে সাথে বদলাবে।",
    guard: "Negative adjustment cannot reduce stock below zero. Product with stock on hand cannot be deleted.",
    bnGuard: "Negative adjustment stock শূন্যের নিচে নামাতে পারবে না। Stock থাকা product delete করা যাবে না।"
  },
  {
    id: "customers",
    icon: Users,
    title: "Customers / Baki & Loyalty",
    bnTitle: "Customers / বাকি ও loyalty",
    route: "Dashboard -> Customer Credit",
    roles: "Manager, Auditor(read), Admin, Owner, Super Admin",
    purpose: "Manage customer accounts, credit limit, baki due, payments, loyalty points, statements, SMS reminders, and CSV data sync.",
    bnPurpose: "Customer account, credit limit, baki due, payment, loyalty point, statement, SMS reminder এবং CSV data sync manage করা।",
    before: [
      "customers.view is required to open statements.",
      "customers.manage is required to import, edit limits, receive payment, or delete.",
      "For credit sales, customer account must exist."
    ],
    bnBefore: [
      "Statement দেখতে customers.view লাগবে।",
      "Import, limit edit, payment receive, delete করতে customers.manage লাগবে।",
      "Credit sale করতে customer account আগে থাকতে হবে।"
    ],
    steps: [
      "Open Customer Credit and search customer name or phone.",
      "Select a customer to view credit limit, current due, loyalty balance, and transaction statement.",
      "To change limit, edit Credit Limit and click Save Credit Limit.",
      "To receive payment, enter amount, payment method, reference number, notes, and click Receive Payment.",
      "For cash payment, the open user's cashbox expected balance increases automatically.",
      "Use date range and Refresh Statement to inspect transactions.",
      "Export statement PDF when a customer asks for history.",
      "Use Send SMS Reminder only when phone number and due balance exist.",
      "Use Export Customers CSV / Import Customers CSV for migration."
    ],
    bnSteps: [
      "Customer Credit খুলে customer name বা phone search করুন।",
      "Customer select করলে credit limit, current due, loyalty balance এবং transaction statement দেখা যাবে।",
      "Limit বদলাতে Credit Limit edit করে Save Credit Limit click করুন।",
      "Payment নিতে amount, payment method, reference number, notes দিয়ে Receive Payment click করুন।",
      "Cash payment হলে open user-এর cashbox expected balance auto বাড়বে।",
      "Date range দিয়ে Refresh Statement click করে transaction দেখুন।",
      "Customer history চাইলে statement PDF export করুন।",
      "Phone number এবং due balance থাকলেই Send SMS Reminder ব্যবহার করুন।",
      "Migration-এর জন্য Export Customers CSV / Import Customers CSV ব্যবহার করুন।"
    ],
    fields: [
      "Credit limit: maximum allowed baki.",
      "Current balance: customer due.",
      "Payment amount: cannot be more than current due.",
      "Reference no: receipt, bKash/Nagad, bank, or manual voucher reference."
    ],
    bnFields: [
      "Credit limit: সর্বোচ্চ allowed baki।",
      "Current balance: customer due।",
      "Payment amount: current due-এর বেশি হতে পারবে না।",
      "Reference no: receipt, bKash/Nagad, bank বা voucher reference।"
    ],
    result: "Customer balance, transaction statement, cashbox cash-in, and loyalty history stay aligned.",
    bnResult: "Customer balance, transaction statement, cashbox cash-in এবং loyalty history aligned থাকবে।",
    guard: "Customer with outstanding balance cannot be deleted.",
    bnGuard: "Outstanding balance থাকা customer delete করা যাবে না।"
  },
  {
    id: "accounting",
    icon: BarChart3,
    title: "Accounting, Expenses & Reports",
    bnTitle: "Accounting, expense ও report",
    route: "Dashboard -> Reports, Expenses, Accounting",
    roles: "Manager(view), Auditor(view), Admin, Owner, Super Admin",
    purpose: "Review sales, profit, VAT/tax, cash book, inventory valuation, journals, and operational expenses.",
    bnPurpose: "Sales, profit, VAT/tax, cash book, inventory valuation, journal এবং operational expense review করা।",
    before: [
      "Accounting feature must be enabled.",
      "accounting.view opens ledgers.",
      "accounting.post is required for expense or manual journal posting."
    ],
    bnBefore: [
      "Accounting feature enabled থাকতে হবে।",
      "Ledger দেখতে accounting.view লাগবে।",
      "Expense বা manual journal post করতে accounting.post লাগবে।"
    ],
    steps: [
      "Open Reports to see Daily Sales, Revenue, Category Revenue, VAT/Tax, P&L, Cash Book, and Inventory Valuation.",
      "Use date filters before exporting reports.",
      "Open Expenses, select category, payment method, amount, date, and notes.",
      "Click Save Expense. Cash expenses reduce cashbox expected balance.",
      "Open Accounting to inspect journal entries and ledger lines.",
      "Export PDF/Excel for owner review, accountant handover, or audit."
    ],
    bnSteps: [
      "Reports খুলে Daily Sales, Revenue, Category Revenue, VAT/Tax, P&L, Cash Book এবং Inventory Valuation দেখুন।",
      "Export করার আগে date filter দিন।",
      "Expenses খুলে category, payment method, amount, date এবং notes দিন।",
      "Save Expense click করুন। Cash expense cashbox expected balance কমাবে।",
      "Accounting খুলে journal entry এবং ledger line inspect করুন।",
      "Owner review, accountant handover বা audit-এর জন্য PDF/Excel export করুন।"
    ],
    fields: [
      "Expense category: rent, utility, salary, transport, other.",
      "Payment method: cash affects drawer; non-cash records accounting without drawer movement.",
      "Narration/notes: why the money moved."
    ],
    bnFields: [
      "Expense category: rent, utility, salary, transport, other।",
      "Payment method: cash drawer affect করে; non-cash drawer movement ছাড়া accounting record করে।",
      "Narration/notes: টাকা কেন move হলো।"
    ],
    result: "Operational expenses, sales invoices, COGS, and reports become traceable from accounting records.",
    bnResult: "Operational expense, sales invoice, COGS এবং report accounting record থেকে trace করা যাবে।",
    guard: "Do not post manual journals unless you understand double-entry accounting.",
    bnGuard: "Double-entry accounting না বুঝলে manual journal post করবেন না।"
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "Users, Roles & Permissions",
    bnTitle: "User, role ও permission",
    route: "Dashboard -> User Management",
    roles: "Super Admin, Owner, Admin, or users.manage",
    purpose: "Create staff accounts, assign built-in roles, create custom roles, and control who can open each workspace or action.",
    bnPurpose: "Staff account তৈরি, built-in role assign, custom role তৈরি এবং কে কোন workspace/action ব্যবহার করবে তা control করা।",
    before: [
      "Only trusted users should manage security.",
      "Built-in roles are protected; create a custom role when you need different permissions.",
      "A feature must be enabled before its workspace can appear."
    ],
    bnBefore: [
      "শুধু trusted user-কে security manage করতে দিন।",
      "Built-in role protected; আলাদা permission দরকার হলে custom role তৈরি করুন।",
      "কোন workspace দেখাতে feature enabled থাকতে হবে।"
    ],
    steps: [
      "Open User Management.",
      "To add staff, fill username, display name, password, select role, and click Create User.",
      "To change a user role, select user, choose role, and click Set Selected User Role.",
      "To block/unblock, select user and use Block/Unblock.",
      "Open Roles & Permissions tab.",
      "Create a new custom role with a clear name such as Senior Cashier or Stock Auditor.",
      "Select the custom role, tick only needed permissions, and click Save Role Permissions.",
      "Ask the staff member to log out and log in again so permissions refresh."
    ],
    bnSteps: [
      "User Management খুলুন।",
      "Staff add করতে username, display name, password, role select করে Create User click করুন।",
      "User role বদলাতে user select করে role বেছে Set Selected User Role click করুন।",
      "Block/unblock করতে user select করে Block/Unblock ব্যবহার করুন।",
      "Roles & Permissions tab খুলুন।",
      "Senior Cashier বা Stock Auditor-এর মতো clear name দিয়ে custom role তৈরি করুন।",
      "Custom role select করে শুধু দরকারি permission tick করুন এবং Save Role Permissions click করুন।",
      "Permission refresh করতে staff-কে logout/login করতে বলুন।"
    ],
    fields: [
      "Dangerous permissions: delete, stock adjust, customer manage, accounting post, settings, users manage.",
      "Role description: write why the role exists.",
      "Audit trail: review sensitive operations."
    ],
    bnFields: [
      "Dangerous permissions: delete, stock adjust, customer manage, accounting post, settings, users manage।",
      "Role description: role কেন আছে লিখুন।",
      "Audit trail: sensitive operation review করুন।"
    ],
    result: "Each staff member sees only the screens and actions needed for their job.",
    bnResult: "প্রতিটি staff শুধু তার কাজের জন্য প্রয়োজনীয় screen/action দেখবে।",
    guard: "Never share the Super Admin password with cashier-level staff.",
    bnGuard: "Super Admin password কখনো cashier-level staff-কে দেবেন না।"
  },
  {
    id: "backup",
    icon: Database,
    title: "Database, Backup, Recycle Bin & Updates",
    bnTitle: "Database, backup, recycle bin ও update",
    route: "Dashboard -> Database & Backup, Recycle Bin, Legal & Support",
    roles: "Admin, Owner, Super Admin, or settings.manage",
    purpose: "Protect offline business data, restore mistakes, optimize SQLite, manage LAN mode, and install software updates.",
    bnPurpose: "Offline business data protect, ভুল restore, SQLite optimize, LAN mode manage এবং software update install করা।",
    before: [
      "Back up before imports, stock corrections, and version updates.",
      "Keep backups outside the installation folder.",
      "Updates require the proper installed setup build."
    ],
    bnBefore: [
      "Import, stock correction এবং version update-এর আগে backup নিন।",
      "Backup installation folder-এর বাইরে রাখুন।",
      "Update করতে proper installed setup build লাগবে।"
    ],
    steps: [
      "Open Database & Backup and click Backup Now.",
      "Choose a backup folder such as Documents, external drive, or secure office folder.",
      "Use Optimize Database when the database grows after heavy use.",
      "Use LAN/server settings only if your store intentionally runs a server-client setup.",
      "Open Recycle Bin, select a deleted item, and click Restore Selected when a deletion was accidental.",
      "Open Legal & Support and click Check for Update.",
      "If a new version downloads, click Restart to Update when the counter is not busy.",
      "If update says the copy is not updater-installed, install the latest BD ERP POS Setup once from the website."
    ],
    bnSteps: [
      "Database & Backup খুলে Backup Now click করুন।",
      "Documents, external drive অথবা secure office folder-এর মতো backup folder বেছে নিন।",
      "Heavy use-এর পর database বড় হলে Optimize Database ব্যবহার করুন।",
      "শুধু server-client setup থাকলে LAN/server setting ব্যবহার করুন।",
      "ভুল delete হলে Recycle Bin খুলে item select করে Restore Selected click করুন।",
      "Legal & Support খুলে Check for Update click করুন।",
      "নতুন version download হলে counter busy না থাকলে Restart to Update click করুন।",
      "Update যদি বলে copy updater-installed না, website থেকে latest BD ERP POS Setup একবার install করুন।"
    ],
    fields: [
      "Backup path: where the database copy will be saved.",
      "LAN mode: local, server, or client operation.",
      "Update status: current version, checking, download, or ready to install."
    ],
    bnFields: [
      "Backup path: database copy কোথায় save হবে।",
      "LAN mode: local, server অথবা client operation।",
      "Update status: current version, checking, download অথবা ready to install।"
    ],
    result: "Data remains recoverable and deployed software stays aligned with the public release feed.",
    bnResult: "Data recoverable থাকবে এবং software public release feed-এর সাথে aligned থাকবে।",
    guard: "Never restore an old backup during live sales without confirming with the owner.",
    bnGuard: "Owner confirm না করে live sales চলাকালীন পুরনো backup restore করবেন না।"
  }
];

const dailyChecklists = [
  {
    role: "Cashier",
    bnRole: "ক্যাশিয়ার",
    items: [
      "Log in with your own user account.",
      "Open shift and enter opening cash.",
      "Scan/search products; confirm quantity and price.",
      "Select customer for credit or loyalty work.",
      "Complete checkout and hand over receipt.",
      "Park orders only when the customer pauses.",
      "Close shift with physical cash count."
    ],
    bnItems: [
      "নিজের user account দিয়ে login করুন।",
      "Shift open করে opening cash দিন।",
      "Product scan/search করে quantity ও price confirm করুন।",
      "Credit বা loyalty কাজ হলে customer select করুন।",
      "Checkout complete করে receipt দিন।",
      "Customer pause করলে শুধু Park order ব্যবহার করুন।",
      "Physical cash count দিয়ে shift close করুন।"
    ]
  },
  {
    role: "Manager",
    bnRole: "ম্যানেজার",
    items: [
      "Review dashboard and daily sales.",
      "Approve discounts and customer credit limits.",
      "Check low stock and reorder recommendations.",
      "Review customer dues and collect payments.",
      "Export reports for owner review."
    ],
    bnItems: [
      "Dashboard এবং daily sales review করুন।",
      "Discount এবং customer credit limit approve করুন।",
      "Low stock ও reorder recommendation দেখুন।",
      "Customer due review করে payment collect করুন।",
      "Owner review-এর জন্য report export করুন।"
    ]
  },
  {
    role: "Inventory Manager",
    bnRole: "ইনভেন্টরি ম্যানেজার",
    items: [
      "Receive purchase stock through Stock Entry.",
      "Use batch/expiry/serial fields when enabled.",
      "Never create stock by editing reports or invoices.",
      "Keep SKU/barcode unique.",
      "Adjust stock only with a real reason and reference."
    ],
    bnItems: [
      "Stock Entry দিয়ে purchase stock receive করুন।",
      "Enabled থাকলে batch/expiry/serial field ব্যবহার করুন।",
      "Report বা invoice edit করে stock বানাবেন না।",
      "SKU/barcode unique রাখুন।",
      "Real reason ও reference দিয়ে stock adjust করুন।"
    ]
  },
  {
    role: "Auditor / Accountant",
    bnRole: "অডিটর / অ্যাকাউন্ট্যান্ট",
    items: [
      "Review reports and accounting ledgers.",
      "Compare cashbox close values with physical cash.",
      "Check customer statements and overdue balances.",
      "Export PDF/Excel reports for audit files.",
      "Do not post journals unless authorized."
    ],
    bnItems: [
      "Report এবং accounting ledger review করুন।",
      "Cashbox close value physical cash-এর সাথে মিলান।",
      "Customer statement ও overdue balance check করুন।",
      "Audit file-এর জন্য PDF/Excel export করুন।",
      "Authorized না হলে journal post করবেন না।"
    ]
  }
];

const troubleshooting = [
  {
    icon: Lock,
    en: "A screen is missing: the user may not have permission, or the feature module is disabled.",
    bn: "কোন screen দেখা যাচ্ছে না: user permission নেই, অথবা feature module disabled।"
  },
  {
    icon: AlertTriangle,
    en: "Product cannot be deleted: reduce stock to zero first, or edit the demo product into a real product.",
    bn: "Product delete হচ্ছে না: আগে stock zero করুন, অথবা demo product-কে real product হিসেবে edit করুন।"
  },
  {
    icon: Banknote,
    en: "Customer payment is rejected: payment cannot exceed the customer's current due.",
    bn: "Customer payment reject হচ্ছে: payment current due-এর বেশি হতে পারবে না।"
  },
  {
    icon: Receipt,
    en: "Cash drawer does not match: check opening cash, cash sales, customer cash payments, cash expenses, and manual cash in/out.",
    bn: "Cash drawer মিলছে না: opening cash, cash sale, customer cash payment, cash expense এবং manual cash in/out check করুন।"
  },
  {
    icon: RotateCw,
    en: "Update does not start: install the latest Setup once; portable or copied folders cannot self-update.",
    bn: "Update শুরু হচ্ছে না: latest Setup একবার install করুন; portable/copied folder self-update করতে পারে না।"
  },
  {
    icon: Search,
    en: "Product search looks stale: refresh catalog or reopen the POS after imports/large stock changes.",
    bn: "Product search stale মনে হলে import/large stock change-এর পর catalog refresh অথবা POS reopen করুন।"
  }
];

function SectionHeader({ eyebrow, title, body }) {
  return (
    <div className="max-w-4xl space-y-4">
      <Badge className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-primary hover:bg-primary/10">
        {eyebrow}
      </Badge>
      <h2 className="text-3xl font-black tracking-tight text-editorial md:text-5xl">{title}</h2>
      {body ? <p className="text-base leading-7 text-muted-foreground md:text-lg">{body}</p> : null}
    </div>
  );
}

function StepList({ items }) {
  return (
    <ol className="space-y-3">
      {items.map((item, index) => (
        <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-4 rounded-lg border border-border/70 bg-background p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-black text-primary">
            {index + 1}
          </span>
          <span className="pt-2 text-sm leading-6 text-foreground/85">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function TextList({ items, icon: Icon = ChevronRight }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
          <Icon className="mt-1 h-4 w-4 shrink-0 text-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function BdErpPosManual({ lang = "bn", setLang, theme = "light", setTheme }) {
  const [activeModule, setActiveModule] = useState("pos");
  const isBn = lang === "bn";
  const t = copy[isBn ? "bn" : "en"];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

        <main className="pt-32 pb-20">
          <section className="border-b border-border/70 bg-muted/20">
            <div className="container mx-auto grid gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div className="space-y-6">
                <Badge className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-primary hover:bg-primary/10">
                  {t.badge}
                </Badge>
                <h1 className="max-w-4xl text-5xl font-black tracking-tight text-editorial md:text-7xl">
                  BD ERP POS {t.title}
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">{t.subtitle}</p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="rounded-full px-4 py-2 font-bold">{t.version}</Badge>
                  <Badge variant="outline" className="rounded-full px-4 py-2 font-bold">Offline-first SQLite</Badge>
                  <Badge variant="outline" className="rounded-full px-4 py-2 font-bold">Bangla / English</Badge>
                </div>
              </div>

              <div className="grid gap-3 rounded-lg border border-border/70 bg-card p-5 shadow-elite">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-black">{t.quickStartTitle}</h2>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{t.quickStartBody}</p>
                <p className="text-sm leading-6 text-muted-foreground">{t.languageNote}</p>
              </div>
            </div>
          </section>

          <div className="container mx-auto space-y-24 px-6 py-16">
            <section className="space-y-8">
              <SectionHeader eyebrow="01" title={t.setupTitle} body={t.finalNote} />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {setupSteps.map((step) => {
                  const Icon = step.icon;
                  const content = step[isBn ? "bn" : "en"];
                  return (
                    <article key={content.title} className="rounded-lg border border-border/70 bg-card p-5 shadow-elite">
                      <Icon className="mb-5 h-7 w-7 text-primary" />
                      <h3 className="mb-3 text-lg font-black">{content.title}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">{content.body}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="space-y-8">
              <SectionHeader eyebrow="02" title={t.presetTitle} />
              <div className="overflow-x-auto rounded-lg border border-border/70 bg-card">
                <div className="grid min-w-[760px] grid-cols-[1fr_1.6fr_1.3fr] gap-px bg-border/70 text-sm">
                  <div className="bg-muted p-4 font-black">Business type</div>
                  <div className="bg-muted p-4 font-black">Enabled workflow</div>
                  <div className="bg-muted p-4 font-black">Use this for</div>
                  {businessPresets.map((preset) => (
                    <React.Fragment key={preset.name}>
                      <div className="bg-background p-4 font-bold">{isBn ? preset.bn : preset.name}</div>
                      <div className="bg-background p-4 leading-6 text-muted-foreground">{preset.features}</div>
                      <div className="bg-background p-4 leading-6 text-muted-foreground">{preset.note}</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <SectionHeader eyebrow="03" title={t.rolesTitle} />
              <div className="grid gap-4 lg:grid-cols-2">
                {roleRows.map((row) => (
                  <article key={row.role} className="rounded-lg border border-border/70 bg-card p-5 shadow-elite">
                    <div className="mb-4 flex items-start gap-3">
                      <UserCog className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <h3 className="text-lg font-black">{isBn ? row.bnRole : row.role}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{isBn ? row.bnCan : row.can}</p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
                      <strong className="text-foreground">Guard:</strong> {row.guard}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <SectionHeader eyebrow="04" title={t.dailyLabel} />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {dailyChecklists.map((checklist) => (
                  <article key={checklist.role} className="rounded-lg border border-border/70 bg-card p-5 shadow-elite">
                    <h3 className="mb-5 text-lg font-black">{isBn ? checklist.bnRole : checklist.role}</h3>
                    <TextList items={isBn ? checklist.bnItems : checklist.items} icon={CheckCircle2} />
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <SectionHeader eyebrow="05" title={t.demoTitle} />
              <div className="grid gap-4 lg:grid-cols-2">
                {demoConversion.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.en} className="grid grid-cols-[3rem_1fr] gap-4 rounded-lg border border-border/70 bg-card p-5 shadow-elite">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-primary">Step {index + 1}</div>
                        <p className="text-sm leading-6 text-muted-foreground">{isBn ? item.bn : item.en}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="space-y-8">
              <SectionHeader eyebrow="06" title={t.modulesTitle} />
              <Tabs value={activeModule} onValueChange={setActiveModule} className="space-y-8">
                <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-lg border border-border/70 bg-muted/40 p-2 md:grid-cols-3 xl:grid-cols-6">
                  {moduleGuides.map((module) => {
                    const Icon = module.icon;
                    return (
                      <TabsTrigger
                        key={module.id}
                        value={module.id}
                        className="min-h-14 rounded-md px-3 py-3 text-xs font-black data-[state=active]:bg-background data-[state=active]:shadow"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {isBn ? module.bnTitle.split(" / ")[0] : module.title.split(" / ")[0]}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {moduleGuides.map((module) => (
                  <TabsContent key={module.id} value={module.id} className="focus-visible:outline-none">
                    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                      <article className="rounded-lg border border-border/70 bg-card p-6 shadow-elite">
                        <div className="mb-6 flex items-start gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            {React.createElement(module.icon, { className: "h-7 w-7" })}
                          </div>
                          <div>
                            <h3 className="text-2xl font-black">{isBn ? module.bnTitle : module.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              {isBn ? module.bnPurpose : module.purpose}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          <div className="rounded-lg bg-muted/40 p-4">
                            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-primary">
                              <MousePointer2 className="h-4 w-4" />
                              {t.routeLabel}
                            </div>
                            <p className="font-mono text-sm text-foreground">{module.route}</p>
                          </div>
                          <div className="rounded-lg bg-muted/40 p-4">
                            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-primary">
                              <Users className="h-4 w-4" />
                              {t.rolesLabel}
                            </div>
                            <p className="text-sm leading-6 text-muted-foreground">{module.roles}</p>
                          </div>
                          <div className="rounded-lg bg-muted/40 p-4">
                            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-primary">
                              <BadgeCheck className="h-4 w-4" />
                              {t.resultLabel}
                            </div>
                            <p className="text-sm leading-6 text-muted-foreground">{isBn ? module.bnResult : module.result}</p>
                          </div>
                          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-amber-600">
                              <AlertTriangle className="h-4 w-4" />
                              {t.guardLabel}
                            </div>
                            <p className="text-sm leading-6 text-muted-foreground">{isBn ? module.bnGuard : module.guard}</p>
                          </div>
                        </div>
                      </article>

                      <div className="grid gap-6">
                        <article className="rounded-lg border border-border/70 bg-card p-6 shadow-elite">
                          <h4 className="mb-4 text-base font-black">{t.beforeLabel}</h4>
                          <TextList items={isBn ? module.bnBefore : module.before} icon={CheckCircle2} />
                        </article>
                        <article className="rounded-lg border border-border/70 bg-card p-6 shadow-elite">
                          <h4 className="mb-4 text-base font-black">{t.stepsLabel}</h4>
                          <StepList items={isBn ? module.bnSteps : module.steps} />
                        </article>
                        <article className="rounded-lg border border-border/70 bg-card p-6 shadow-elite">
                          <h4 className="mb-4 text-base font-black">{t.fieldsLabel}</h4>
                          <TextList items={isBn ? module.bnFields : module.fields} />
                        </article>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </section>

            <section className="space-y-8">
              <SectionHeader eyebrow="07" title={t.troubleshootTitle} />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {troubleshooting.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.en} className="rounded-lg border border-border/70 bg-card p-5 shadow-elite">
                      <Icon className="mb-4 h-6 w-6 text-primary" />
                      <p className="text-sm leading-6 text-muted-foreground">{isBn ? item.bn : item.en}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="rounded-lg border border-primary/20 bg-primary/[0.03] p-8 md:p-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                <div className="space-y-4">
                  <Badge className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-primary hover:bg-primary/10">
                    Support
                  </Badge>
                  <h2 className="text-3xl font-black tracking-tight md:text-5xl">{t.supportTitle}</h2>
                  <p className="text-base leading-7 text-muted-foreground md:text-lg">{t.supportBody}</p>
                </div>
                <div className="grid gap-4">
                  <a href={LINKS.whatsappLink} className="flex items-center gap-4 rounded-lg border border-border/70 bg-background p-5 no-underline shadow-elite">
                    <LifeBuoy className="h-7 w-7 text-emerald-600" />
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">WhatsApp</div>
                      <div className="text-lg font-black text-foreground">+880 1570-212260</div>
                    </div>
                  </a>
                  <a href="mailto:support@equisaas-bd.com" className="flex items-center gap-4 rounded-lg border border-border/70 bg-background p-5 no-underline shadow-elite">
                    <Mail className="h-7 w-7 text-primary" />
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Email</div>
                      <div className="text-lg font-black text-foreground">support@equisaas-bd.com</div>
                    </div>
                  </a>
                </div>
              </div>
            </section>
          </div>
        </main>

        <Footer lang={lang} />
      </div>
    </TooltipProvider>
  );
}
