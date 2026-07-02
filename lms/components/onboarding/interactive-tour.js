"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronRight, GraduationCap, Pickaxe, Target } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TOUR_STORAGE_KEY = "equisaas_tour_completed";

export function InteractiveTour() {
  const { copy } = useLocale();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Check if the user has already seen the tour
    const hasSeenTour = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!hasSeenTour) {
      // Small delay to let the app load before showing the modal
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setOpen(false);
  };

  const steps = [
    {
      icon: <GraduationCap className="h-10 w-10 text-blue-500 mb-4" />,
      title: copy("Stage 1: Student", "ধাপ ১: স্টুডেন্ট"),
      description: copy(
        "Welcome to EquiSaaS BD! You start as a Student. Go through the LMS lessons to build your foundational knowledge and pass proof-based tasks.",
        "EquiSaaS BD তে স্বাগতম! আপনি স্টুডেন্ট হিসেবে শুরু করছেন। LMS থেকে শিখে প্রুফ-বেসড টাস্ক জমা দিন।"
      ),
    },
    {
      icon: <Pickaxe className="h-10 w-10 text-emerald-500 mb-4" />,
      title: copy("Stage 2: Contributor", "ধাপ ২: কন্ট্রিবিউটর"),
      description: copy(
        "As you submit tasks and earn points, you become a Contributor. You'll build real SME software, and your points become your Sweat Equity.",
        "পয়েন্ট অর্জন করে আপনি কন্ট্রিবিউটর হবেন। আপনি বাস্তব SME সফটওয়্যার বানাবেন, আর আপনার পয়েন্ট হবে Sweat Equity।"
      ),
    },
    {
      icon: <Target className="h-10 w-10 text-purple-500 mb-4" />,
      title: copy("Stage 3: Owner", "ধাপ ৩: ওনার (Owner)"),
      description: copy(
        "Top contributors join the governance tier. Your sweat equity translates to real ownership in the cooperative and revenue shares.",
        "সেরা কন্ট্রিবিউটররা গভার্নেন্স স্তরে যোগ দেন। আপনার Sweat Equity কো-অপারেটিভের আসল মালিকানা ও লভ্যাংশে পরিণত হবে।"
      ),
    }
  ];

  if (!open) return null;

  const currentStep = steps[step];

  return (
    <AlertDialog open={open} onOpenChange={(val) => {
      if (!val) handleComplete();
    }}>
      <AlertDialogContent className="sm:max-w-md rounded-[2rem]">
        <AlertDialogHeader className="pt-4 flex flex-col items-center text-center">
          {currentStep.icon}
          <AlertDialogTitle className="text-2xl font-black">{currentStep.title}</AlertDialogTitle>
          <AlertDialogDescription className="text-base mt-2 leading-relaxed">
            {currentStep.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex justify-center gap-2 py-4">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"}`}
            />
          ))}
        </div>

        <AlertDialogFooter className="flex-row sm:justify-between items-center w-full gap-2 mt-2">
          <Button 
            variant="ghost" 
            onClick={handleComplete}
            className="text-muted-foreground"
          >
            {copy("Skip", "এড়িয়ে যান")}
          </Button>
          
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} className="gap-2 rounded-xl">
              {copy("Next", "পরবর্তী")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
              <CheckCircle2 className="h-4 w-4" />
              {copy("Start Building", "কাজ শুরু করুন")}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
