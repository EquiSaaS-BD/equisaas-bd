import { useEffect, useState } from "react";
import { collection, getDocs, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";

const readCache = (key, fallback) => {
  try {
    const cached = sessionStorage.getItem(key);
    return cached ? JSON.parse(cached) : fallback;
  } catch {
    return fallback;
  }
};

const writeCache = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const COLLECTION_CACHE_KEYS = {
  contributions: "eq_coop_contributions_cache",
  payouts: "eq_coop_payouts_cache",
  proposals: "eq_coop_proposals_cache",
  proposalVotes: "eq_coop_proposal_votes_cache",
  pathways: "eq_coop_pathways_cache",
  squads: "eq_coop_squads_cache",
  translations: "eq_coop_translations_cache",
  mentorRequests: "eq_coop_mentor_requests_cache",
  qualityGates: "eq_coop_quality_gates_cache",
  credentials: "eq_coop_credentials_cache",
  roadmapItems: "eq_coop_roadmap_items_cache",
  roadmapVotes: "eq_coop_roadmap_votes_cache",
  trustSignals: "eq_coop_trust_signals_cache",
  assignmentSubmissions: "eq_coop_assignment_submissions_cache",
  reviewQueueItems: "eq_coop_review_queue_items_cache",
  auditEntries: "eq_coop_audit_entries_cache",
};

const mapDocs = (snap) => snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

export default function useCoopData({ db, user, isAdmin, view, coopTab }) {
  const [contributions, setContributions] = useState(() => readCache(COLLECTION_CACHE_KEYS.contributions, []));
  const [payouts, setPayouts] = useState(() => readCache(COLLECTION_CACHE_KEYS.payouts, []));
  const [proposals, setProposals] = useState(() => readCache(COLLECTION_CACHE_KEYS.proposals, []));
  const [proposalVotes, setProposalVotes] = useState(() => readCache(COLLECTION_CACHE_KEYS.proposalVotes, {}));
  const [pathways, setPathways] = useState(() => readCache(COLLECTION_CACHE_KEYS.pathways, []));
  const [squads, setSquads] = useState(() => readCache(COLLECTION_CACHE_KEYS.squads, []));
  const [translations, setTranslations] = useState(() => readCache(COLLECTION_CACHE_KEYS.translations, []));
  const [mentorRequests, setMentorRequests] = useState(() => readCache(COLLECTION_CACHE_KEYS.mentorRequests, []));
  const [qualityGates, setQualityGates] = useState(() => readCache(COLLECTION_CACHE_KEYS.qualityGates, []));
  const [credentials, setCredentials] = useState(() => readCache(COLLECTION_CACHE_KEYS.credentials, []));
  const [roadmapItems, setRoadmapItems] = useState(() => readCache(COLLECTION_CACHE_KEYS.roadmapItems, []));
  const [roadmapVotes, setRoadmapVotes] = useState(() => readCache(COLLECTION_CACHE_KEYS.roadmapVotes, {}));
  const [trustSignals, setTrustSignals] = useState(() => readCache(COLLECTION_CACHE_KEYS.trustSignals, []));
  const [assignmentSubmissions, setAssignmentSubmissions] = useState(() => readCache(COLLECTION_CACHE_KEYS.assignmentSubmissions, []));
  const [reviewQueueItems, setReviewQueueItems] = useState(() => readCache(COLLECTION_CACHE_KEYS.reviewQueueItems, []));
  const [auditEntries, setAuditEntries] = useState(() => readCache(COLLECTION_CACHE_KEYS.auditEntries, []));

  const hasUser = Boolean(db && user?.uid);
  const isCoopView = hasUser && view === "coop";
  const isAdminView = hasUser && view === "admin";

  useEffect(() => {
    if (hasUser) return;
    setContributions([]);
    setPayouts([]);
    setProposals([]);
    setProposalVotes({});
    setPathways([]);
    setSquads([]);
    setTranslations([]);
    setMentorRequests([]);
    setQualityGates([]);
    setCredentials([]);
    setRoadmapItems([]);
    setRoadmapVotes({});
    setTrustSignals([]);
    setAssignmentSubmissions([]);
    setReviewQueueItems([]);
    setAuditEntries([]);
  }, [hasUser]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "ledger") && !isAdminView) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "contributions"), orderBy("createdAt", "desc"), limit(50)),
      (snap) => {
        const items = mapDocs(snap);
        setContributions(items);
        writeCache(COLLECTION_CACHE_KEYS.contributions, items);
      },
    );
    return unsubscribe;
  }, [coopTab, db, isAdminView, isCoopView]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "payouts")) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "payouts"), orderBy("month", "desc"), limit(20)),
      (snap) => {
        const items = mapDocs(snap);
        setPayouts(items);
        writeCache(COLLECTION_CACHE_KEYS.payouts, items);
      },
    );
    return unsubscribe;
  }, [coopTab, db, isCoopView]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "governance")) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "proposals"), orderBy("createdAt", "desc"), limit(30)),
      (snap) => {
        const items = mapDocs(snap);
        setProposals(items);
        writeCache(COLLECTION_CACHE_KEYS.proposals, items);
      },
    );
    return unsubscribe;
  }, [coopTab, db, isCoopView]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "governance")) return;
    if (!proposals.length) {
      setProposalVotes({});
      writeCache(COLLECTION_CACHE_KEYS.proposalVotes, {});
      return;
    }

    let cancelled = false;

    Promise.all(
      proposals.map(async (proposal) => {
        const snap = await getDocs(collection(db, "proposals", proposal.id, "votes"));
        let yes = 0;
        let no = 0;
        snap.forEach((voteDoc) => {
          if (voteDoc.data().value === "yes") yes += 1;
          if (voteDoc.data().value === "no") no += 1;
        });
        return [proposal.id, { yes, no }];
      }),
    )
      .then((entries) => {
        if (cancelled) return;
        const next = Object.fromEntries(entries);
        setProposalVotes(next);
        writeCache(COLLECTION_CACHE_KEYS.proposalVotes, next);
      })
      .catch((error) => {
        console.error("Proposal vote snapshot failed:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [coopTab, db, isCoopView, proposals]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "pathways")) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "pathways"), orderBy("createdAt", "desc"), limit(50)),
      (snap) => {
        const items = mapDocs(snap);
        setPathways(items);
        writeCache(COLLECTION_CACHE_KEYS.pathways, items);
      },
    );
    return unsubscribe;
  }, [coopTab, db, isCoopView]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "squads")) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "squads"), orderBy("createdAt", "desc"), limit(50)),
      (snap) => {
        const items = mapDocs(snap);
        setSquads(items);
        writeCache(COLLECTION_CACHE_KEYS.squads, items);
      },
    );
    return unsubscribe;
  }, [coopTab, db, isCoopView]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "translations")) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "translations"), orderBy("createdAt", "desc"), limit(50)),
      (snap) => {
        const items = mapDocs(snap);
        setTranslations(items);
        writeCache(COLLECTION_CACHE_KEYS.translations, items);
      },
    );
    return unsubscribe;
  }, [coopTab, db, isCoopView]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "mentorship")) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "mentorRequests"), orderBy("createdAt", "desc"), limit(30)),
      (snap) => {
        const items = mapDocs(snap);
        setMentorRequests(items);
        writeCache(COLLECTION_CACHE_KEYS.mentorRequests, items);
      },
    );
    return unsubscribe;
  }, [coopTab, db, isCoopView]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "quality")) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "qualityGates"), orderBy("createdAt", "desc"), limit(50)),
      (snap) => {
        const items = mapDocs(snap);
        setQualityGates(items);
        writeCache(COLLECTION_CACHE_KEYS.qualityGates, items);
      },
    );
    return unsubscribe;
  }, [coopTab, db, isCoopView]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "credentials")) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "credentials"), orderBy("issuedAt", "desc"), limit(50)),
      (snap) => {
        const items = mapDocs(snap);
        setCredentials(items);
        writeCache(COLLECTION_CACHE_KEYS.credentials, items);
      },
    );
    return unsubscribe;
  }, [coopTab, db, isCoopView]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "roadmap") && !isAdminView) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "roadmap"), orderBy("createdAt", "desc"), limit(50)),
      (snap) => {
        const items = mapDocs(snap);
        setRoadmapItems(items);
        writeCache(COLLECTION_CACHE_KEYS.roadmapItems, items);
      },
    );
    return unsubscribe;
  }, [coopTab, db, isAdminView, isCoopView]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "roadmap")) return;
    if (!roadmapItems.length) {
      setRoadmapVotes({});
      writeCache(COLLECTION_CACHE_KEYS.roadmapVotes, {});
      return;
    }

    let cancelled = false;

    Promise.all(
      roadmapItems.map(async (item) => {
        const snap = await getDocs(collection(db, "roadmap", item.id, "votes"));
        return [item.id, snap.size];
      }),
    )
      .then((entries) => {
        if (cancelled) return;
        const next = Object.fromEntries(entries);
        setRoadmapVotes(next);
        writeCache(COLLECTION_CACHE_KEYS.roadmapVotes, next);
      })
      .catch((error) => {
        console.error("Roadmap vote snapshot failed:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [coopTab, db, isCoopView, roadmapItems]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "trust") && !isAdminView) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "trustSignals"), orderBy("createdAt", "desc"), limit(50)),
      (snap) => {
        const items = mapDocs(snap);
        setTrustSignals(items);
        writeCache(COLLECTION_CACHE_KEYS.trustSignals, items);
      },
    );
    return unsubscribe;
  }, [coopTab, db, isAdminView, isCoopView]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "assignments") && !isAdminView) return;
    const baseRef = collection(db, "assignmentSubmissions");
    const submissionsQuery = isAdmin || isAdminView ? query(baseRef, orderBy("createdAt", "desc"), limit(120)) : query(baseRef, where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(submissionsQuery, (snap) => {
      const items = mapDocs(snap);
      setAssignmentSubmissions(items);
      writeCache(COLLECTION_CACHE_KEYS.assignmentSubmissions, items);
    });
    return unsubscribe;
  }, [coopTab, db, isAdmin, isAdminView, isCoopView, user?.uid]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "assignments") && !isAdminView) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "reviewQueue"), orderBy("updatedAt", "desc"), limit(isAdmin ? 60 : 40)),
      (snap) => {
        const items = mapDocs(snap);
        setReviewQueueItems(items);
        writeCache(COLLECTION_CACHE_KEYS.reviewQueueItems, items);
      },
    );
    return unsubscribe;
  }, [coopTab, db, isAdmin, isAdminView, isCoopView]);

  useEffect(() => {
    if (!(isCoopView && coopTab === "audit") && !isAdminView) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "coopAudit"), orderBy("createdAt", "desc"), limit(isAdminView ? 160 : 80)),
      (snap) => {
        const items = mapDocs(snap);
        setAuditEntries(items);
        writeCache(COLLECTION_CACHE_KEYS.auditEntries, items);
      },
    );
    return unsubscribe;
  }, [coopTab, db, isAdminView, isCoopView]);

  return {
    assignmentSubmissions,
    auditEntries,
    reviewQueueItems,
    contributions,
    credentials,
    mentorRequests,
    pathways,
    payouts,
    proposalVotes,
    proposals,
    qualityGates,
    roadmapItems,
    roadmapVotes,
    setAssignmentSubmissions,
    setAuditEntries,
    setReviewQueueItems,
    setContributions,
    setCredentials,
    setMentorRequests,
    setPathways,
    setPayouts,
    setProposalVotes,
    setProposals,
    setQualityGates,
    setRoadmapItems,
    setRoadmapVotes,
    setSquads,
    setTranslations,
    setTrustSignals,
    squads,
    translations,
    trustSignals,
  };
}
