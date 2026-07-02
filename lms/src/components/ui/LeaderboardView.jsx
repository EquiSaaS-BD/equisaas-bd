import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { Trophy, Crown, Medal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const CACHE_KEY = "eq_leaderboard_cache";
const MEDAL_CONFIG = [
  { rank: 1, icon: Crown, bg: "from-yellow-400 to-amber-500",   ring: "ring-yellow-400/50",  label: "Gold"   },
  { rank: 2, icon: Trophy, bg: "from-slate-300 to-slate-400",   ring: "ring-slate-400/50",   label: "Silver" },
  { rank: 3, icon: Medal,  bg: "from-orange-400 to-amber-600",  ring: "ring-orange-500/50",  label: "Bronze" },
];

const LeaderboardView = ({ db, lang }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Restore from sessionStorage first ;  zero Firestore reads
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try { setLeaders(JSON.parse(cached)); return; } catch (_) {}
    }
    fetchLeaders();
  }, [db]);

  const fetchLeaders = async () => {
    if (!db) {
      // Demo data when Firestore not configured
      setLeaders([
        { id: "1", displayName: "Nusrat Jahan",   coopPoints: 2100, role: "Product Manager"    },
        { id: "2", displayName: "Rafiqul Islam",  coopPoints: 1250, role: "Frontend Engineer"  },
        { id: "3", displayName: "Tanvir Ahmed",   coopPoints: 980,  role: "Backend Engineer"   },
        { id: "4", displayName: "Farida Khanam",  coopPoints: 860,  role: "UX Researcher"      },
        { id: "5", displayName: "Mosharraf Hossain", coopPoints: 750, role: "DevOps Engineer"  },
      ]);
      return;
    }
    setLoading(true);
    try {
      // Try contributions collection ;  sum points per user by fetching top contributions
      // This is 1 Firestore read for up to 10 docs ;  minimal quota usage
      const q = query(
        collection(db, "contributions"),
        orderBy("points", "desc"),
        limit(10)
      );
      const snap = await getDocs(q);
      const raw = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Aggregate points per user from the result set (client-side grouping)
      const byUser = {};
      raw.forEach((item) => {
        const uid = item.uid || item.createdBy || item.id;
        if (!byUser[uid]) {
          byUser[uid] = {
            id: uid,
            displayName: item.displayName || item.createdBy || "Anonymous",
            coopPoints: 0,
            role: item.type || "Contributor",
          };
        }
        byUser[uid].coopPoints += Number(item.points || 0);
      });

      const sorted = Object.values(byUser)
        .sort((a, b) => b.coopPoints - a.coopPoints)
        .slice(0, 10);

      setLeaders(sorted);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(sorted));
    } catch (e) {
      console.error("Leaderboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const getMedalConfig = (rank) => MEDAL_CONFIG.find((m) => m.rank === rank) || null;

  const formatter = React.useMemo(() => new Intl.NumberFormat(lang === "bn" ? "bn-BD" : "en-US"), [lang]);
  const formatPoints = (pts) => formatter.format(pts || 0);

  return (
    <Card className="border-none bg-muted/30 shadow-none overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-black flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            {lang === "bn" ? "শীর্ষ কন্ট্রিবিউটর" : "Top Contributors"}
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchLeaders}
            className="h-7 rounded-full border-amber-500/30 px-3 text-[10px] font-black uppercase tracking-widest text-amber-600 hover:bg-amber-50"
          >
            {loading ? "..." : lang === "bn" ? "রিফ্রেশ" : "Refresh"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          {lang === "bn"
            ? "কো-অপে সর্বোচ্চ পয়েন্টধারী সদস্যরা"
            : "Members with the most co-op contribution points"}
        </p>
      </CardHeader>

      <CardContent className="space-y-2 pt-2">
        {leaders.length === 0 && !loading && (
          <div className="py-10 text-center text-muted-foreground text-sm font-semibold">
            {lang === "bn" ? "এখনো কোনো ডেটা নেই" : "No data yet. Be the first!"}
          </div>
        )}

        {leaders.map((leader, i) => {
          const rank = i + 1;
          const medal = getMedalConfig(rank);

          return (
            <div
              key={leader.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl border transition-all",
                rank <= 3
                  ? "bg-background border-muted-foreground/10 shadow-sm"
                  : "bg-transparent border-transparent hover:bg-background hover:border-muted-foreground/10"
              )}
            >
              {/* Rank Badge */}
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 ring-2",
                  medal
                    ? `bg-gradient-to-br ${medal.bg} ${medal.ring}`
                    : "bg-muted text-muted-foreground ring-transparent"
                )}
              >
                {medal ? <medal.icon className="w-4 h-4" /> : rank}
              </div>

              {/* Avatar & Name */}
              <Avatar className="h-8 w-8 shrink-0 border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/50">
                <AvatarImage src={leader.avatarUrl || ""} alt={leader.displayName || "Contributor"} />
                <AvatarFallback className="bg-transparent text-xs font-black text-white">
                  {(leader.displayName || "?")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">
                  {leader.displayName || "Anonymous"}
                </div>
                <div className="text-[10px] font-semibold text-muted-foreground truncate">
                  {leader.role || "Contributor"}
                </div>
              </div>

              {/* Points */}
              <div className="text-right shrink-0">
                <div
                  className={cn(
                    "text-sm font-black",
                    rank === 1 && "text-amber-500",
                    rank === 2 && "text-slate-500",
                    rank === 3 && "text-orange-500"
                  )}
                >
                  {formatPoints(leader.coopPoints)}
                </div>
                <div className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">
                  {lang === "bn" ? "পয়েন্ট" : "pts"}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default React.memo(LeaderboardView);
