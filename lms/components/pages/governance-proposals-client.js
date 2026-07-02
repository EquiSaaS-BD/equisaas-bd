"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Clock, Info, ShieldCheck, Vote as VoteIcon } from "lucide-react";
import { WorkspacePageHeader } from "@/components/layout/workspace-page-header";
import { WorkspaceBreadcrumbs } from "@/components/layout/workspace-breadcrumbs";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fetchProposals, submitVote } from "@/lib/firestore/lms";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function GovernanceProposalsClient() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();
  const { copy } = useLocale();

  const trail = [
    { href: "/dashboard", en: "Dashboard", bn: "ড্যাশবোর্ড" },
    { href: "/governance", en: "Governance", bn: "গভর্ন্যান্স" },
    { href: null, en: "Proposals", bn: "প্রস্তাবনা" },
  ];

  const refreshProposals = async () => {
    try {
      const data = await fetchProposals();
      setProposals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProposals();
  }, []);

  const handleVote = async (proposalId, choice) => {
    if (!authState.user?.governanceEligible) {
      toast.error(copy("Not eligible to vote yet.", "আপনি এখনো ভোট দেওয়ার যোগ্য নন।"));
      return;
    }

    try {
      await submitVote({ actor: authState.user, proposalId, choice });
      toast.success(copy("Vote recorded successfully!", "ভোট সফলভাবে রেকর্ড করা হয়েছে!"));
      refreshProposals();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <WorkspaceBreadcrumbs trail={trail} />
      <WorkspacePageHeader
        title={copy("Governance Proposals", "গভর্ন্যান্স প্রস্তাবনা")}
        description={copy("Vote on the future direction of the cooperative.", "কো-অপারেটিভের ভবিষ্যতের দিকনির্দেশনায় ভোট দিন।")}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          {loading ? (
            <Card className="p-12 text-center opacity-40">
              <p>{copy("Loading proposals...", "প্রস্তাবনা লোড হচ্ছে...")}</p>
            </Card>
          ) : proposals.length === 0 ? (
            <Card className="glass-premium p-12 text-center rounded-[3rem]">
              <VoteIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-black">{copy("No active proposals", "কোনো সক্রিয় প্রস্তাবনা নেই")}</h3>
              <p className="text-muted-foreground mt-2">{copy("Check back later for new community decisions.", "নতুন প্রস্তাবনার জন্য পরে আবার দেখুন।")}</p>
            </Card>
          ) : (
            proposals.map(proposal => (
              <Card key={proposal.id} className="glass-premium border-primary/10 rounded-[3rem] overflow-hidden group">
                <CardHeader className="p-8 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{proposal.category}</Badge>
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-0">{copy("ACTIVE", "সক্রিয়")}</Badge>
                      </div>
                      <CardTitle className="text-2xl font-black mt-3 group-hover:text-primary transition-colors">{proposal.title}</CardTitle>
                    </div>
                    <div className="text-right shrink-0">
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{copy("Ends in", "শেষ হবে")}</p>
                       <div className="flex items-center gap-1.5 text-primary font-bold mt-1">
                         <Clock className="h-4 w-4" />
                         <span>3 Days</span>
                       </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-8">
                  <p className="text-muted-foreground leading-relaxed">{proposal.description}</p>
                  
                  <div className="space-y-6">
                    {proposal.options?.map(opt => (
                      <div key={opt.id} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="uppercase tracking-widest">{opt.label}</span>
                          <span className="text-primary">{opt.votePercent || 0}%</span>
                        </div>
                        <div className="relative h-10 group/opt cursor-pointer" onClick={() => handleVote(proposal.id, opt.id)}>
                           <div className="absolute inset-0 bg-muted/40 rounded-2xl overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${opt.votePercent || 0}%` }}
                                className="h-full bg-primary/20 border-r-2 border-primary" 
                              />
                           </div>
                           <div className="absolute inset-0 flex items-center px-4 justify-between">
                              <span className="font-black text-sm">{opt.label}</span>
                              <div className="h-6 w-6 rounded-full border-2 border-primary/30 flex items-center justify-center group-hover/opt:border-primary transition-colors">
                                 {/* Logic for showing if user voted for this */}
                                 <Circle className="h-3 w-3 text-primary opacity-0 group-hover/opt:opacity-100" />
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-primary/5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <Info className="h-3.5 w-3.5" />
                    <span>{copy("Votes are weighted by your total Sweat Equity Units.", "আপনার মোট Sweat Equity Unit অনুযায়ী ভোটের ওজন নির্ধারিত হবে।")}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-6">
          <Card className="glass-elite border-primary/20 rounded-[2.5rem] p-6 shadow-xl">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                {copy("Your Voting Power", "আপনার ভোটিং পাওয়ার")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="text-center py-6 bg-primary/5 rounded-3xl border border-primary/10">
                 <p className="text-4xl font-black text-primary">{authState.user?.totalPoints || 0}</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">SEU (Sweat Equity Units)</p>
              </div>
              
              {!authState.user?.governanceEligible ? (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                   <p className="text-xs font-bold text-amber-700 leading-relaxed">
                     {copy("You need to reach 500 SEU to open active governance voting.", "ভোটিং খুলতে আপনার ৫০০ SEU প্রয়োজন।")}
                   </p>
                   <Progress value={(authState.user?.totalPoints || 0) / 500 * 100} className="h-1.5" />
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                   <p className="text-xs font-bold text-emerald-700">
                     {copy("You are an eligible governance steward.", "আপনি একজন সক্রিয় গভর্ন্যান্স স্টিউয়ার্ড।")}
                   </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
