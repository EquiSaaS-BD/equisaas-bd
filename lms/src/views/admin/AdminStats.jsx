import React from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Layers, CheckCircle, TrendingUp, DollarSign, Activity, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AdminStats = ({ stats, lang }) => {
  const data = [
    {
      title: lang === "bn" ? "মোট কোর্স" : "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: "+2 this month"
    },
    {
      title: lang === "bn" ? "সক্রিয় লেসন" : "Active Lessons",
      value: stats.totalLessons,
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      trend: "+12.5%"
    },
    {
      title: lang === "bn" ? "মোট কন্ট্রিবিউশন" : "Total Contributions",
      value: stats.totalContributions,
      icon: Layers,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      trend: "Avg 4.8/day"
    },
    {
      title: lang === "bn" ? "মেম্বার ট্রাস্ট স্কোর" : "Avg Trust Score",
      value: stats.avgTrustScore || "88%",
      icon: Zap,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: "High Performance"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((item, idx) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Card className="border-none shadow-premium bg-background/40 backdrop-blur-md group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} rounded-bl-full -mr-12 -mt-12 transition-all group-hover:scale-110`} />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${item.bg}`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <Badge variant="outline" className="text-[10px] font-bold border-muted-foreground/20 opacity-60">
                  {item.trend}
                </Badge>
              </div>
              <div>
                <div className="text-3xl font-black tracking-tight">{item.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 opacity-70">
                  {item.title}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStats;
