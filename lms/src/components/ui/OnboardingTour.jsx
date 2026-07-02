import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Compass, BookOpen, MessageSquare, CheckCircle2 } from "lucide-react";
import { useLms } from "../../lms-context";

const TOUR_STEPS = [
  {
    icon: Compass,
    titleBn: "প্লাটফর্মে স্বাগতম!",
    titleEn: "Welcome to the Platform!",
    descBn: "চলুন আপনার লার্নিং ড্যাশবোর্ড এবং কো-অপ ওয়ার্কস্পেস ঘুরে দেখি।",
    descEn: "Let's take a quick tour of your Learning Hub and Co-op Workspace."
  },
  {
    icon: BookOpen,
    titleBn: "Learning Hub",
    titleEn: "Learning Hub",
    descBn: "এখানে আপনার নির্বাচিত ট্র্যাকের সব রোডম্যাপ এবং মডিউল পাবেন।",
    descEn: "Find all roadmaps and modules for your selected track here."
  },
  {
    icon: MessageSquare,
    titleBn: "Co-op Workspace",
    titleEn: "Co-op Workspace",
    descBn: "স্কোয়াড চ্যানেল, কমিউনিটি আপডেট এবং কন্ট্রিবিউশন ট্র্যাক করুন।",
    descEn: "Access squad channels, updates, and track your contributions."
  }
];

const OnboardingTour = ({ onComplete }) => {
  const { lang } = useLms();
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);

  const currentStep = TOUR_STEPS[step];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setOpen(false);
      onComplete?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) onComplete?.();
    }}>
      <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl p-6">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="w-8 h-8" />
          </div>
        </div>
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-black">
            {lang === 'bn' ? currentStep.titleBn : currentStep.titleEn}
          </DialogTitle>
          <DialogDescription className="text-sm font-medium mt-2">
            {lang === 'bn' ? currentStep.descBn : currentStep.descEn}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center gap-2 my-6">
          {TOUR_STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all ${idx === step ? 'w-8 bg-primary' : 'w-2 bg-slate-200'}`}
            />
          ))}
        </div>

        <DialogFooter className="flex-col sm:flex-row items-center gap-3 w-full">
          <Button variant="ghost" className="w-full sm:w-auto text-muted-foreground" onClick={() => { setOpen(false); onComplete?.(); }}>
            {lang === 'bn' ? "বাদ দিন" : "Skip Tour"}
          </Button>
          <Button onClick={handleNext} className="w-full sm:w-auto flex-1 rounded-xl font-bold h-11">
            {step === TOUR_STEPS.length - 1 ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {lang === 'bn' ? "শুরু করুন" : "Get Started"}
              </>
            ) : (
              lang === 'bn' ? "পরবর্তী" : "Next"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTour;
