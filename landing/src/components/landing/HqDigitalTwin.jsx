import React from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Globe, Building, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const REGIONS = [
  { name: "Dhaka", count: 420, x: "50%", y: "45%" },
  { name: "Chittagong", count: 180, x: "65%", y: "75%" },
  { name: "Bagerhat", count: 95, x: "35%", y: "70%" },
  { name: "Sylhet", count: 110, x: "75%", y: "35%" },
  { name: "Rajshahi", count: 140, x: "25%", y: "40%" },
];

export function HqDigitalTwin({ lang = "bn" }) {
  const copy = (en, bn) => lang === "bn" ? bn : en;

  return (
    <div className="space-y-20">
      {/* HQ Digital Twin */}
      <section className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6" data-reveal="left">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            {copy("Physical HQ", "ফিজিক্যাল সদর দপ্তর")}
          </Badge>
          <h2 className="text-4xl font-black tracking-tight leading-tight">
            {copy("Grounding our digital vision in physical reality.", "আমাদের ডিজিটাল ভিশনকে বাস্তবে রূপ দেওয়া।")}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {copy(
              "EquiSaaS BD operates from its official headquarters in Dhaka. This is where orientations, high-level governance meetups, and our core servers are managed.",
              "EquiSaaS BD ঢাকার সদর দপ্তর থেকে পরিচালিত হয়। এখানেই ওরিয়েন্টেশন, গভর্ন্যান্স মিটআপ এবং আমাদের কোর সার্ভারগুলো ম্যানেজ করা হয়।"
            )}
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-5 rounded-[2rem] border bg-card/50 space-y-2">
               <MapPin className="h-6 w-6 text-primary" />
               <p className="font-bold text-sm">Tejgaon, Dhaka</p>
               <p className="text-[10px] text-muted-foreground uppercase font-black">HQ Location</p>
            </div>
            <div className="p-5 rounded-[2rem] border bg-card/50 space-y-2">
               <Building className="h-6 w-6 text-primary" />
               <p className="font-bold text-sm">Amir Palace</p>
               <p className="text-[10px] text-muted-foreground uppercase font-black">734 Hazrat Ali Rd</p>
            </div>
          </div>
          <Button className="rounded-full px-8 h-12 gap-2 group" asChild>
             <a href="https://maps.app.goo.gl/og6pQYJpRknXkyC89" target="_blank" rel="noreferrer">
               {copy("View on Google Maps", "গুগল ম্যাপে দেখুন")}
               <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
             </a>
          </Button>
        </div>

        <div className="relative group" data-reveal="right">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
          <Card className="glass-elite border-primary/20 rounded-[3rem] overflow-hidden relative shadow-2xl">
             <div className="aspect-video bg-muted relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-[#0a0a0a] overflow-hidden group-hover:scale-105 transition-transform duration-700">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-20 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(59,130,246,0.3)_360deg)]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white shadow-glow">
                      <Users className="h-6 w-6" />
                   </div>
                   <div>
                      <p className="font-black text-white text-lg">Active In-Person</p>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest">12 Builders Today</p>
                   </div>
                </div>
             </div>
          </Card>
        </div>
      </section>

      {/* Regional Growth Map */}
      <section className="space-y-10" data-reveal="up">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-black tracking-tight">{copy("Regional Growth Network", "আঞ্চলিক বৃদ্ধি নেটওয়ার্ক")}</h2>
          <p className="text-muted-foreground">{copy("Our co-operative is spreading across every district of Bangladesh.", "আমাদের কো-অপারেটিভ বাংলাদেশের প্রতিটি জেলায় ছড়িয়ে পড়ছে।")}</p>
        </div>

        <div className="relative aspect-[16/9] w-full max-w-4xl mx-auto rounded-[3rem] border border-primary/10 bg-primary/[0.02] overflow-hidden">
           {/* Abstract Bangladesh SVG Placeholder */}
           <svg viewBox="0 0 1000 600" className="absolute inset-0 w-full h-full opacity-10 text-primary">
              <path d="M500 50 L700 150 L800 400 L600 550 L400 550 L200 400 L300 150 Z" fill="currentColor" />
           </svg>

           {REGIONS.map((region, i) => (
             <motion.div 
               key={region.name}
               initial={{ scale: 0, opacity: 0 }}
               whileInView={{ scale: 1, opacity: 1 }}
               transition={{ delay: i * 0.1 }}
               style={{ left: region.x, top: region.y }}
               className="absolute -translate-x-1/2 -translate-y-1/2"
             >
               <div className="relative flex items-center justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute h-12 w-12 rounded-full bg-primary/20" 
                  />
                  <div className="h-4 w-4 rounded-full bg-primary shadow-glow relative z-10 group cursor-pointer">
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-1.5 rounded-xl bg-background border shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        <p className="font-black text-[10px] uppercase tracking-widest">{region.name}</p>
                        <p className="text-primary font-bold text-xs">{region.count} Builders</p>
                     </div>
                  </div>
               </div>
             </motion.div>
           ))}
        </div>
      </section>
    </div>
  );
}

// Missing Button component for landing
function Button({ children, className, ...props }) {
  return (
    <button 
      className={cn("bg-primary text-primary-foreground px-6 font-bold transition-all hover:bg-primary/90 hover:shadow-glow", className)} 
      {...props}
    >
      {children}
    </button>
  );
}
