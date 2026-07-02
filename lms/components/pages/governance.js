"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, CheckCircle2, Landmark, MessageSquareText, ShieldCheck, Vote } from "lucide-react";
import { WorkspaceBreadcrumbs } from "@/components/layout/workspace-breadcrumbs";
import { WorkspacePageHeader } from "@/components/layout/workspace-page-header";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { fetchActiveGovernanceProposals, getLocalGovernanceVote, submitGovernanceVote } from "@/lib/firestore/governance";
import { cn } from "@/lib/utils";

const STEWARD_ROLES = new Set(["super_admin", "director", "department_head", "mentor"]);

const getTotalVotes = (proposal, selectedOptionId = "") =>
  (proposal.options || []).reduce((total, option) => total + Number(option.votes || 0) + (option.id === selectedOptionId ? 1 : 0), 0);

function localizeProposal(copy, proposal) {
  return {
    title: copy(proposal.title || "", proposal.titleBn || proposal.title || ""),
    summary: copy(proposal.summary || "", proposal.summaryBn || proposal.summary || ""),
  };
}

function localizeOption(copy, option) {
  return copy(option.label || "", option.labelBn || option.label || "");
}

function GovernanceMetric({ title, value, description, icon: Icon }) {
  return (
    <Card className="hover-lift rounded-[1.75rem]">
      <CardContent className="flex items-start gap-4 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-black tracking-tight tabular-nums">{value}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ProposalCard({
  proposal,
  selectedOptionId,
  savedVote,
  comment,
  canVote,
  submitting,
  onSelect,
  onCommentChange,
  onVote,
  copy,
}) {
  const localizedProposal = localizeProposal(copy, proposal);
  const totalVotes = getTotalVotes(proposal, savedVote?.selectedOptionId || "");

  return (
    <Card className="rounded-[2rem]">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="subtle">{proposal.type}</Badge>
          <Badge variant={canVote ? "success" : "outline"}>
            {canVote ? copy("Eligible", "Eligible") : copy(`${proposal.requiredSweatEquityUnits || 0}+ SEU needed`, `${proposal.requiredSweatEquityUnits || 0}+ SEU দরকার`)}
          </Badge>
          {savedVote ? <Badge variant="secondary">{copy("Vote saved", "ভোট সংরক্ষিত")}</Badge> : null}
        </div>
        <CardTitle>{localizedProposal.title}</CardTitle>
        <CardDescription className="text-base leading-7">{localizedProposal.summary}</CardDescription>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {proposal.closesAtText || copy("Open proposal", "Open proposal")}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {(proposal.options || []).map((option) => {
            const label = localizeOption(copy, option);
            const isSelected = selectedOptionId === option.id;
            const isSaved = savedVote?.selectedOptionId === option.id;
            const voteCount = Number(option.votes || 0) + (isSaved ? 1 : 0);
            const percentage = totalVotes ? Math.round((voteCount / totalVotes) * 100) : 0;

            return (
              <button
                key={option.id}
                type="button"
                disabled={!canVote || submitting}
                onClick={() => onSelect(option.id)}
                className={cn(
                  "group w-full rounded-[1.5rem] border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
                  isSelected || isSaved
                    ? "border-primary/40 bg-primary/8 shadow-sm shadow-primary/10"
                    : "border-border/60 bg-background/75 hover:border-primary/25 hover:bg-muted/35",
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                      isSelected || isSaved ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground",
                    )}>
                      {isSaved ? <CheckCircle2 className="h-4 w-4" /> : <Vote className="h-4 w-4" />}
                    </span>
                    <span className="font-semibold">{label}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-primary">{percentage}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${percentage}%` }} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor={`comment-${proposal.id}`}>
            {copy("Optional reason", "ঐচ্ছিক কারণ")}
          </label>
          <Textarea
            id={`comment-${proposal.id}`}
            value={comment}
            disabled={!canVote || submitting}
            onChange={(event) => onCommentChange(event.target.value)}
            placeholder={copy(
              "Explain why this option helps the cooperative most.",
              "এই option cooperative-এর জন্য কেন সবচেয়ে উপকারী, সংক্ষেপে লিখুন।",
            )}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-muted-foreground">
            {canVote
              ? copy("Each co-builder gets one vote per proposal.", "প্রতি proposal-এ একজন co-builder একটি vote দিতে পারবেন।")
              : copy(
                  "Build more approved contribution records to open voting, or participate as a mentor/steward.",
                  "Voting খুলতে আরও approved contribution record তৈরি করুন, অথবা mentor/steward হিসেবে অংশ নিন।",
                )}
          </p>
          <Button disabled={!canVote || !selectedOptionId || submitting} onClick={onVote}>
            {submitting ? copy("Saving...", "সংরক্ষণ হচ্ছে...") : savedVote ? copy("Update vote", "ভোট আপডেট") : copy("Submit vote", "ভোট দিন")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function GovernanceDashboard() {
  const { user, profile, roles } = useAuth();
  const { copy } = useLocale();
  const [proposals, setProposals] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [savedVotes, setSavedVotes] = useState({});
  const [comments, setComments] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [submittingId, setSubmittingId] = useState("");
  const [loading, setLoading] = useState(true);

  const sweatEquityUnits = Number(profile?.sweatEquityUnits ?? profile?.totalPoints ?? 0);
  const isSteward = (roles || []).some((roleId) => STEWARD_ROLES.has(roleId));

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      const nextProposals = await fetchActiveGovernanceProposals();
      if (!active) return;
      setProposals(nextProposals);
      const nextVotes = {};
      const nextSelectedOptions = {};
      nextProposals.forEach((proposal) => {
        const vote = getLocalGovernanceVote(proposal.id, user?.uid || "");
        if (vote) {
          nextVotes[proposal.id] = vote;
          nextSelectedOptions[proposal.id] = vote.selectedOptionId;
        }
      });
      setSavedVotes(nextVotes);
      setSelectedOptions(nextSelectedOptions);
      setLoading(false);
    };

    load().catch(() => {
      if (!active) return;
      setProposals([]);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [user?.uid]);

  const eligibleProposalCount = useMemo(
    () => proposals.filter((proposal) => isSteward || sweatEquityUnits >= Number(proposal.requiredSweatEquityUnits || 0)).length,
    [isSteward, proposals, sweatEquityUnits],
  );

  const trail = [
    { href: "/dashboard", en: "Dashboard", bn: "ড্যাশবোর্ড" },
    { href: null, en: "Co-op Governance", bn: "কো-অপ গভর্ন্যান্স" },
  ];

  const handleVote = async (proposal) => {
    const selectedOptionId = selectedOptions[proposal.id];
    if (!selectedOptionId || !user?.uid) return;

    setSubmittingId(proposal.id);
    setStatusMessage("");
    try {
      const result = await submitGovernanceVote({
        proposalId: proposal.id,
        selectedOptionId,
        userId: user.uid,
        profile,
        comment: comments[proposal.id] || "",
      });

      setSavedVotes((current) => ({ ...current, [proposal.id]: result.vote }));
      setStatusMessage(
        result.mode === "firestore"
          ? copy("Your governance vote has been saved.", "আপনার governance vote সংরক্ষণ করা হয়েছে।")
          : copy(
              "Your vote is saved locally for now. Enable Firestore governance rules later to sync cooperative votes centrally.",
              "আপনার vote আপাতত locally save হয়েছে। পরে Firestore governance rules চালু করলে cooperative vote centrally sync হবে।",
            ),
      );
    } catch (error) {
      setStatusMessage(error?.message || copy("Vote could not be saved.", "ভোট সংরক্ষণ করা যায়নি।"));
    } finally {
      setSubmittingId("");
    }
  };

  if (loading) {
    return (
      <div className="workspace-stack">
        <WorkspaceBreadcrumbs items={trail} />
        <Skeleton className="h-72 rounded-[2rem]" />
        <Skeleton className="h-72 rounded-[2rem]" />
      </div>
    );
  }

  return (
    <div className="workspace-stack">
      <WorkspaceBreadcrumbs items={trail} />
      <WorkspacePageHeader
        badge={copy("Co-op Governance", "কো-অপ গভর্ন্যান্স")}
        title={copy("Vote on the roadmap as a co-builder", "Co-builder হিসেবে roadmap-এ ভোট দিন")}
        description={copy(
          "EquiSaaS BD decisions should feel cooperative, transparent, and contribution-aware. Use this space to shape roadmap priorities, proof policies, and production credential standards.",
          "EquiSaaS BD-এর decision cooperative, transparent, এবং contribution-aware হওয়া উচিত। Roadmap priority, proof policy, এবং production credential standard গঠনে এই space ব্যবহার করুন।",
        )}
        stats={[
          {
            label: copy("Active proposals", "Active proposal"),
            value: proposals.length,
            note: copy("Open roadmap and policy items.", "Open roadmap ও policy item।"),
          },
          {
            label: copy("My SEU", "আমার SEU"),
            value: sweatEquityUnits,
            note: copy("Sweat Equity Units from approved contribution.", "Approved contribution থেকে Sweat Equity Unit।"),
          },
          {
            label: copy("Eligible proposals", "Eligible proposal"),
            value: eligibleProposalCount,
            note: isSteward
              ? copy("Mentor/steward access active.", "Mentor/steward access active।")
              : copy("Based on current SEU threshold.", "বর্তমান SEU threshold অনুযায়ী।"),
          },
        ]}
        actions={(
          <div className="workspace-pane space-y-3 p-4">
            <p className="text-sm leading-6 text-muted-foreground">
              {copy(
                "This route is ready for Firestore-backed voting, but it safely falls back to local storage until governance collections are enabled.",
                "এই route Firestore-backed voting-এর জন্য ready, তবে governance collection চালু না হওয়া পর্যন্ত নিরাপদে local storage fallback ব্যবহার করে।",
              )}
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/equity">
                {copy("Check My Share", "আমার শেয়ার দেখুন")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <GovernanceMetric
          title={copy("Participation model", "Participation model")}
          value={copy("1 vote", "১ ভোট")}
          description={copy("One co-builder, one vote per proposal.", "প্রতি proposal-এ একজন co-builder একটি vote।")}
          icon={Vote}
        />
        <GovernanceMetric
          title={copy("Threshold logic", "Threshold logic")}
          value="SEU"
          description={copy("Voting access follows verified contribution.", "Voting access verified contribution অনুসরণ করে।")}
          icon={ShieldCheck}
        />
        <GovernanceMetric
          title={copy("Co-op direction", "Co-op direction")}
          value={copy("Open", "Open")}
          description={copy("Roadmap input is visible and repeatable.", "Roadmap input visible এবং repeatable।")}
          icon={Landmark}
        />
      </div>

      {statusMessage ? (
        <Card className="rounded-[1.5rem] border-primary/20 bg-primary/8">
          <CardContent className="flex items-start gap-3 p-5">
            <BadgeCheck className="mt-0.5 h-5 w-5 text-primary" />
            <p className="text-sm leading-6 text-muted-foreground">{statusMessage}</p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.42fr]">
        <div className="space-y-6">
          {proposals.length ? proposals.map((proposal) => {
            const canVote = isSteward || sweatEquityUnits >= Number(proposal.requiredSweatEquityUnits || 0);
            return (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                selectedOptionId={selectedOptions[proposal.id] || ""}
                savedVote={savedVotes[proposal.id] || null}
                comment={comments[proposal.id] || ""}
                canVote={canVote}
                submitting={submittingId === proposal.id}
                onSelect={(optionId) => setSelectedOptions((current) => ({ ...current, [proposal.id]: optionId }))}
                onCommentChange={(value) => setComments((current) => ({ ...current, [proposal.id]: value }))}
                onVote={() => handleVote(proposal)}
                copy={copy}
              />
            );
          }) : (
            <Card className="rounded-[2rem]">
              <CardHeader>
                <CardTitle>{copy("No open proposals yet", "এখনও open proposal নেই")}</CardTitle>
                <CardDescription>
                  {copy("When roadmap or policy proposals open, they will appear here.", "Roadmap বা policy proposal খুললে এখানে দেখা যাবে।")}
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>

        <Card className="h-fit rounded-[2rem]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <MessageSquareText className="h-6 w-6" />
            </div>
            <CardTitle>{copy("Governance principles", "Governance principle")}</CardTitle>
            <CardDescription className="text-base leading-7">
              {copy(
                "This is not a corporate command chain. It is a transparent decision layer for contributors who are building the ecosystem.",
                "এটি corporate command chain নয়। এটি ecosystem build করা contributor-দের transparent decision layer।",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              [copy("Proof before influence", "Influence-এর আগে proof"), copy("Voting weight begins with verified contribution.", "Voting access verified contribution দিয়ে শুরু হয়।")],
              [copy("Roadmap transparency", "Roadmap transparency"), copy("Product priorities should be visible before work begins.", "কাজ শুরু হওয়ার আগে product priority visible হওয়া উচিত।")],
              [copy("Production credibility", "Production credibility"), copy("Credentials should prove real product work, not empty course completion.", "Credential real product work প্রমাণ করবে, শুধু empty course completion নয়।")],
            ].map(([title, description]) => (
              <div key={title} className="workspace-pane p-4">
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
