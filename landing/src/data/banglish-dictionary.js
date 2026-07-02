export const BANGLISH_DICTIONARY = {
  // Greetings
  "hello": ["hi", "হ্যালো", "slm", "salam", "assalamualaikum", "hi", "hey"],
  "kemon achen": ["how are you", "কেমন আছেন", "kmn asen", "kemon asen"],

  // Questions / Wh-words
  "ki": ["what", "কী", "k"],
  "kivabe": ["how", "কিভাবে", "kivabe", "kemne", "kibhabe"],
  "kothay": ["where", "কোথায়", "koi", "kothai"],
  "kobe": ["when", "কবে", "kobe", "kokhon"],
  "ke": ["who", "কে", "k", "kae"],
  "keno": ["why", "কেন", "kno"],

  // Actions
  "apply": ["apply", "আবেদন", "join", "যোগদান"],
  "korbo": ["will do", "করবো", "korbo", "kormu"],
  "shikhbo": ["learn", "শিখবো", "shikhbo", "seekhbo"],
  "kaj": ["work", "কাজ", "kaj", "kaaj"],

  // Entities
  "office": ["office", "অফিস", "hq", "headquarter", "thikana", "address"],
  "member": ["member", "সদস্য", "shodossho"],
  "founder": ["founder", "ফাউন্ডার", "ceo", "সিইও", "malik", "kholipha"],
  
  // Conjunctions (for splitting)
  "ebong": ["and", "এবং", "o", "ar", "aar", "ebong", "&"],
  
  // Application specific
  "step": ["step", "ধাপ", "dhaap", "process", "niyom"],
  "interview": ["interview", "ইন্টারভিউ", "viva"],
  "github": ["github", "গিটহাব", "git"]
};

// Function to expand a query with synonyms
export const expandQuery = (query) => {
  let expandedQuery = query.toLowerCase();
  
  // We don't replace, we just append synonyms so the string has more chances to match keywords
  const words = expandedQuery.split(/\s+/);
  const expansions = new Set(words);

  for (const word of words) {
    for (const [key, synonyms] of Object.entries(BANGLISH_DICTIONARY)) {
      if (word === key || synonyms.includes(word)) {
        synonyms.forEach(syn => expansions.add(syn));
        expansions.add(key);
      }
    }
  }

  return Array.from(expansions).join(" ");
};
