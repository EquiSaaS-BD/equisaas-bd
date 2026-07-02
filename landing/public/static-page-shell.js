"use strict";

(function staticPageShell() {
  const THEME_KEY = "theme";
  const LANG_KEY = "lang";
  const DEFAULT_THEME = "light";
  const DEFAULT_LANG = "bn";
  const HEADER_SELECTOR = "[data-generated-public-header]";
  const MENU_OPEN_CLASS = "block";
  const MENU_CLOSED_CLASS = "hidden";

  const chromeCopy = {
    en: {
      langToggle: "বাংলা",
      themeLight: "Day",
      themeDark: "Night",
      langAria: "Switch language",
      themeAria: "Switch day or night theme",
    },
    bn: {
      langToggle: "EN",
      themeLight: "দিন",
      themeDark: "রাত",
      langAria: "ভাষা বদলান",
      themeAria: "দিন বা রাত থিম বদলান",
    },
  };

  const publicNavCopy = {
    en: {
      founder: "Founder's Message",
      departments: "Departments",
      roadmap: "Roadmap",
      training: "Training",
      faq: "FAQ",
      apply: "Start at Your Pace",
      lms: "Enter LMS",
      quick: "Quick navigation",
      more: "More links",
      openTech: "Open Tech Coop",
      orientation: "Orientation 2026",
      linkedin: "LinkedIn",
      menu: "Open menu",
      close: "Close menu",
      homeAria: "EquiSaaS BD homepage",
      logoAlt: "EquiSaaS BD logo",
    },
    bn: {
      founder: "ফাউন্ডারের বার্তা",
      departments: "ডিপার্টমেন্ট",
      roadmap: "রোডম্যাপ",
      training: "ট্রেনিং",
      faq: "FAQ",
      apply: "আপনার গতিতে শুরু করুন",
      lms: "LMS এ প্রবেশ",
      quick: "দ্রুত নেভিগেশন",
      more: "আরও লিংক",
      openTech: "ওপেন টেক কো-অপারেটিভ",
      orientation: "অরিয়েন্টেশন ২০২৬",
      linkedin: "লিংকডইন",
      menu: "মেনু খুলুন",
      close: "মেনু বন্ধ করুন",
      homeAria: "EquiSaaS BD হোমপেজ",
      logoAlt: "EquiSaaS BD লোগো",
    },
  };

  const publicNavLinks = {
    primary: [
      { href: "/founder/", label: "founder" },
      { href: "/#departments", label: "departments" },
      { href: "/#roadmap", label: "roadmap" },
      { href: "/software-training-bangladesh/", label: "training" },
      { href: "/#faq", label: "faq" },
    ],
    secondary: [
      { href: "/open-tech-cooperative-bangladesh/", label: "openTech" },
      { href: "/orientation-2026/", label: "orientation" },
      { href: "https://www.linkedin.com/company/equisaas-bd/", label: "linkedin", external: true },
    ],
  };

  function safeReadStorage(key, fallbackValue) {
    try {
      const value = window.localStorage.getItem(key);
      return value || fallbackValue;
    } catch {
      return fallbackValue;
    }
  }

  function safeWriteStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignore storage failures on privacy-restricted browsers.
    }
  }

  function getCurrentLang() {
    return safeReadStorage(LANG_KEY, DEFAULT_LANG) === "en" ? "en" : "bn";
  }

  function getCurrentTheme() {
    return safeReadStorage(THEME_KEY, DEFAULT_THEME) === "dark" ? "dark" : "light";
  }

  function getPageCopy(key, lang) {
    const map = window.__STATIC_PAGE_I18N || {};
    const entry = map[key];
    if (!entry) return "";
    return entry[lang] || entry.en || "";
  }

  function applyTheme(theme) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.dataset.theme = nextTheme;
    safeWriteStorage(THEME_KEY, nextTheme);
  }

  function applyLocalizedNode(node, lang) {
    const key = node.dataset.i18nKey;
    if (!key) return;

    const value = getPageCopy(key, lang);
    if (!value) return;

    const attr = node.dataset.i18nAttr || "text";
    const mode = node.dataset.i18nMode || "text";

    if (attr === "text") {
      if (mode === "html") {
        node.innerHTML = value;
      } else {
        node.textContent = value;
      }
      return;
    }

    node.setAttribute(attr, value);
  }

  function findHeaderTarget() {
    return Array.from(document.body.children).find((element) => element.tagName === "HEADER") || null;
  }

  function buildDesktopLinks() {
    return publicNavLinks.primary
      .map(
        (item) => `
          <a
            href="${item.href}"
            data-public-label="${item.label}"
            class="inline-flex min-h-10 items-center justify-center rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          ></a>
        `,
      )
      .join("");
  }

  function buildMobileLinks(items) {
    return items
      .map(
        (item) => `
          <a
            href="${item.href}"
            ${item.external ? 'target="_blank" rel="noreferrer"' : ""}
            data-public-label="${item.label}"
            data-public-menu-link
            class="block rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-semibold text-muted-foreground no-underline transition-colors hover:text-foreground"
          ></a>
        `,
      )
      .join("");
  }

  function buildPublicHeaderMarkup() {
    return `
      <header
        data-generated-public-header
        class="sticky top-0 z-50 hidden border-b border-border/70 bg-background/88 shadow-[0_18px_48px_-34px_rgba(15,23,42,0.35)] backdrop-blur-xl md:block"
      >
        <nav class="container mx-auto flex min-h-[68px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6 xl:min-h-[72px]">
          <a href="https://equisaas-bd.com/" data-public-home-link class="flex min-w-0 items-center gap-3 text-foreground no-underline">
            <img
              data-public-logo
              src="/logo-bn.svg?v=20260405"
              alt="EquiSaaS BD logo"
              class="h-[2.125rem] w-auto sm:h-[2.375rem] xl:h-[2.55rem]"
              width="240"
              height="48"
              loading="eager"
              decoding="async"
            />
          </a>

          <div class="hidden items-center gap-1 rounded-full border border-border/70 bg-background/78 p-1.5 shadow-[0_14px_36px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl xl:flex">
            ${buildDesktopLinks()}
          </div>

          <div class="hidden items-center gap-2 md:flex">
            <button
              type="button"
              data-theme-toggle
              class="inline-flex min-h-10 items-center justify-center rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
            >
              <span data-static-label="theme"></span>
            </button>

            <button
              type="button"
              data-lang-toggle
              class="inline-flex min-h-10 items-center justify-center rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
            >
              <span data-static-label="lang"></span>
            </button>

            <a
              href="/#apply"
              data-public-label="apply"
              class="inline-flex min-h-10 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground no-underline shadow-sm"
            ></a>

            <a
              href="/lms/login"
              data-public-label="lms"
              class="inline-flex min-h-10 items-center justify-center rounded-full border border-primary/25 bg-background/80 px-4 py-2 text-sm font-semibold text-primary no-underline"
            ></a>
          </div>

          <button
            type="button"
            data-public-menu-toggle
            aria-expanded="false"
            aria-controls="static-public-mobile-menu"
            class="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-border/70 bg-background/85 px-3 py-2 text-sm font-semibold text-foreground md:hidden"
          >
            <span data-public-menu-label></span>
          </button>
        </nav>

        <div
          id="static-public-mobile-menu"
          data-public-menu
          class="hidden border-t border-border/70 bg-background/95 px-4 pb-5 pt-4 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.4)] backdrop-blur-xl md:hidden"
        >
          <div class="container mx-auto space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                data-lang-toggle
                class="inline-flex min-h-11 items-center justify-center rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm font-semibold text-foreground"
              >
                <span data-static-label="lang"></span>
              </button>
              <button
                type="button"
                data-theme-toggle
                class="inline-flex min-h-11 items-center justify-center rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm font-semibold text-foreground"
              >
                <span data-static-label="theme"></span>
              </button>
            </div>

            <div class="space-y-3 rounded-[1.75rem] border border-border/70 bg-card/90 p-4 shadow-sm">
              <p data-public-label="quick" class="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground"></p>
              <div class="grid gap-3">
                ${buildMobileLinks(publicNavLinks.primary)}
              </div>
            </div>

            <div class="space-y-3 rounded-[1.75rem] border border-border/70 bg-card/90 p-4 shadow-sm">
              <p data-public-label="more" class="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground"></p>
              <div class="grid gap-3">
                ${buildMobileLinks(publicNavLinks.secondary)}
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <a
                href="/#apply"
                data-public-label="apply"
                data-public-menu-link
                class="inline-flex min-h-11 items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground no-underline"
              ></a>
              <a
                href="/lms/login"
                data-public-label="lms"
                data-public-menu-link
                class="inline-flex min-h-11 items-center justify-center rounded-2xl border border-primary/25 px-4 py-3 text-sm font-semibold text-primary no-underline"
              ></a>
            </div>
          </div>
        </div>
      </header>

      <div
        data-mobile-thumb-zone
        class="fixed bottom-0 left-0 right-0 z-[100] border-t border-border/40 bg-background/80 px-6 pb-6 pt-3 backdrop-blur-2xl md:hidden"
      >
        <div class="flex items-center justify-between gap-4">
          <button type="button" data-lang-toggle class="flex flex-col items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 border border-border/50">
              <span data-static-label="lang" class="text-xs font-bold uppercase tracking-widest"></span>
            </div>
          </button>

          <a
            href="/#apply"
            class="relative -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_12px_24px_-8px_rgba(var(--primary),0.5)] ring-[6px] ring-background transition-transform active:scale-95"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>

          <button type="button" data-public-menu-toggle class="flex flex-col items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 border border-border/50">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-foreground"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </div>
          </button>
        </div>
      </div>
    `;
  }

  function ensurePublicHeader() {
    const existingGenerated = document.querySelector(HEADER_SELECTOR);
    if (existingGenerated) return existingGenerated;

    const targetHeader = findHeaderTarget();
    const wrapper = document.createElement("div");
    wrapper.innerHTML = buildPublicHeaderMarkup().trim();
    const generatedHeader = wrapper.firstElementChild;

    if (!generatedHeader) return null;

    if (targetHeader) {
      targetHeader.replaceWith(generatedHeader);
    } else {
      document.body.prepend(generatedHeader);
    }

    return generatedHeader;
  }

  function applyPublicHeader(lang, theme) {
    const header = ensurePublicHeader();
    if (!header) return;

    const copy = publicNavCopy[lang] || publicNavCopy.en;
    const logo = header.querySelector("[data-public-logo]");
    const homeLink = header.querySelector("[data-public-home-link]");
    const menuButton = header.querySelector("[data-public-menu-toggle]");
    const menuLabel = header.querySelector("[data-public-menu-label]");
    const menu = header.querySelector("[data-public-menu]");
    const isMenuOpen = Boolean(menu && menu.classList.contains(MENU_OPEN_CLASS));

    header.querySelectorAll("[data-public-label]").forEach((node) => {
      const key = node.getAttribute("data-public-label");
      if (!key || !copy[key]) return;
      node.textContent = copy[key];
    });

    if (logo) {
      logo.setAttribute("src", lang === "bn" ? "/logo-bn.svg?v=20260405" : "/logo.svg?v=20260405");
      logo.setAttribute("alt", copy.logoAlt);
    }

    if (homeLink) {
      homeLink.setAttribute("aria-label", copy.homeAria);
      homeLink.setAttribute("title", copy.homeAria);
    }

    if (menuButton) {
      const nextLabel = isMenuOpen ? copy.close : copy.menu;
      menuButton.setAttribute("aria-label", nextLabel);
      menuButton.setAttribute("title", nextLabel);
      if (menuLabel) {
        menuLabel.textContent = nextLabel;
      }
    }

    applyChrome(lang, theme);
  }

  function applyChrome(lang, theme) {
    const copy = chromeCopy[lang] || chromeCopy.en;

    document.querySelectorAll("[data-lang-toggle]").forEach((langButton) => {
      langButton.setAttribute("aria-label", copy.langAria);
      langButton.setAttribute("title", copy.langAria);
    });

    document.querySelectorAll("[data-theme-toggle]").forEach((themeButton) => {
      themeButton.setAttribute("aria-label", copy.themeAria);
      themeButton.setAttribute("title", copy.themeAria);
    });

    document.querySelectorAll("[data-static-label='lang']").forEach((langLabel) => {
      langLabel.textContent = copy.langToggle;
    });

    document.querySelectorAll("[data-static-label='theme']").forEach((themeLabel) => {
      themeLabel.textContent = theme === "dark" ? copy.themeLight : copy.themeDark;
    });
  }

  function closeMobileMenu() {
    const menu = document.querySelector("[data-public-menu]");
    const button = document.querySelector("[data-public-menu-toggle]");
    const label = document.querySelector("[data-public-menu-label]");
    const lang = getCurrentLang();
    const copy = publicNavCopy[lang] || publicNavCopy.en;

    if (menu) {
      menu.classList.remove(MENU_OPEN_CLASS);
      menu.classList.add(MENU_CLOSED_CLASS);
    }

    if (button) {
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", copy.menu);
      button.setAttribute("title", copy.menu);
    }

    if (label) {
      label.textContent = copy.menu;
    }
  }

  function toggleMobileMenu() {
    const menu = document.querySelector("[data-public-menu]");
    const button = document.querySelector("[data-public-menu-toggle]");
    const label = document.querySelector("[data-public-menu-label]");
    const lang = getCurrentLang();
    const copy = publicNavCopy[lang] || publicNavCopy.en;

    if (!menu || !button) return;

    const shouldOpen = !menu.classList.contains(MENU_OPEN_CLASS);
    menu.classList.toggle(MENU_OPEN_CLASS, shouldOpen);
    menu.classList.toggle(MENU_CLOSED_CLASS, !shouldOpen);
    button.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    button.setAttribute("aria-label", shouldOpen ? copy.close : copy.menu);
    button.setAttribute("title", shouldOpen ? copy.close : copy.menu);

    if (label) {
      label.textContent = shouldOpen ? copy.close : copy.menu;
    }
  }

  function applyLang(lang) {
    const nextLang = lang === "en" ? "en" : "bn";
    document.documentElement.lang = nextLang === "bn" ? "bn" : "en";
    document.documentElement.dataset.locale = nextLang;
    safeWriteStorage(LANG_KEY, nextLang);

    document.querySelectorAll("[data-i18n-key]").forEach((node) => applyLocalizedNode(node, nextLang));
    applyPublicHeader(nextLang, getCurrentTheme());
  }

  function bindControls() {
    document.addEventListener("click", (event) => {
      const langButton = event.target.closest("[data-lang-toggle]");
      if (langButton) {
        event.preventDefault();
        const nextLang = getCurrentLang() === "en" ? "bn" : "en";
        applyLang(nextLang);
        return;
      }

      const themeButton = event.target.closest("[data-theme-toggle]");
      if (themeButton) {
        event.preventDefault();
        const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        applyPublicHeader(getCurrentLang(), nextTheme);
        return;
      }

      const menuButton = event.target.closest("[data-public-menu-toggle]");
      if (menuButton) {
        event.preventDefault();
        toggleMobileMenu();
        return;
      }

      const menuLink = event.target.closest("[data-public-menu-link]");
      if (menuLink) {
        closeMobileMenu();
      }
    });

    // ── Global Mouse Tracking for Kinetic Premium Effects ──
    document.addEventListener("mousemove", (e) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);

      // Keep local tracking for elements that might need relative coordinates
      const targets = document.querySelectorAll(".hover-glow-local");
      targets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        target.style.setProperty("--local-mouse-x", `${x}px`);
        target.style.setProperty("--local-mouse-y", `${y}px`);
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) {
        closeMobileMenu();
      }
    });
  }

  function initScrollReveal() {
    const observerOptions = {
      root: null,
      threshold: 0.15, // Spec: 15% visibility
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll("[data-reveal]").forEach((el) => {
      observer.observe(el);
    });
  }

  function bootstrap() {
    const initialTheme = getCurrentTheme();
    const initialLang = getCurrentLang();
    applyTheme(initialTheme);
    ensurePublicHeader();
    applyLang(initialLang);
    closeMobileMenu();
    bindControls();
    initScrollReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
