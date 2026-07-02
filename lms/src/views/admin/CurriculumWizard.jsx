import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, BookOpen, ListOrdered, Map, Type, Link, Video, Shield, ChevronRight, CheckCircle, ArrowRight, Save, Trash2, Globe, Layout, Layers, Activity, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const CurriculumWizard = ({ 
  courses, 
  adminCourseId, 
  setAdminCourseId, 
  addCourse, 
  addLesson, 
  adminLessons, 
  moveLesson, 
  toggleCoursePublish, 
  getCourseTitle, 
  getLessonTitle, 
  text, 
  lang 
}) => {
  const [step, setStep] = useState("select"); // 'select', 'create', 'lessons'

  return (
    <div className="space-y-8 min-h-[600px]">
      <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl w-fit border border-muted-foreground/5 mb-6">
        <Button 
          variant={step === "select" ? "secondary" : "ghost"} 
          onClick={() => setStep("select")}
          className="rounded-xl px-5 py-2 text-xs font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-9"
        >
          <Layers className="w-3.5 h-3.5 mr-2" />
          Manage Existing
        </Button>
        <Button 
          variant={step === "create" ? "secondary" : "ghost"} 
          onClick={() => setStep("create")}
          className="rounded-xl px-5 py-2 text-xs font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-9"
        >
          <Plus className="w-3.5 h-3.5 mr-2" />
          Create New
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {step === "select" && (
          <motion.div 
            key="select"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {courses.map(course => (
              <Card 
                key={course.id} 
                className={cn(
                  "border-muted/20 hover:border-primary/40 transition-all bg-card/40 backdrop-blur-sm group cursor-pointer relative overflow-hidden",
                  adminCourseId === course.id && "border-primary ring-1 ring-primary/20"
                )}
                onClick={() => {
                  setAdminCourseId(course.id);
                  setStep("lessons");
                }}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-8 -mt-8 grayscale group-hover:grayscale-0 transition-all" />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                     <Badge variant="outline" className={cn(
                       "font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-lg border-none",
                       course.published ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                     )}>
                       {course.published ? "Published" : "Draft"}
                     </Badge>
                     <div className="text-[10px] font-black text-muted-foreground uppercase">{course.lang} · {course.level}</div>
                  </div>
                  <CardTitle className="text-lg font-black mt-4 leading-tight group-hover:text-primary transition-colors">{getCourseTitle(course)}</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-xl border border-muted-foreground/5">
                    <ListOrdered className="w-3.5 h-3.5" />
                    <span className="font-bold">{course.lessons} Total Sessions</span>
                  </div>
                </CardContent>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/0 group-hover:bg-primary/20 transition-all" />
              </Card>
            ))}
          </motion.div>
        )}

        {step === "create" && (
          <motion.div 
            key="create"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm overflow-hidden max-w-4xl mx-auto">
               <CardHeader className="bg-primary/5 p-8 border-b border-muted-foreground/5">
                  <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                    <Plus className="w-6 h-6 text-primary" />
                    Spawn New Curriculum
                  </CardTitle>
                  <CardDescription className="text-sm font-medium">Define high-quality educational blueprints for the EquiSaaS ecosystem.</CardDescription>
               </CardHeader>
               <CardContent className="p-8">
                  <form onSubmit={addCourse} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <Globe className="w-3 h-3 text-primary" /> বাংলা শিরোনাম
                      </Label>
                      <Input name="titleBn" required placeholder="ইমেইল মার্কেটিং ফাউন্ডেশন" className="bg-muted/50 border-none h-14 font-bold text-lg focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                         <Globe className="w-3 h-3 text-primary" /> English Title
                      </Label>
                      <Input name="titleEn" required placeholder="Email Marketing Foundation" className="bg-muted/50 border-none h-14 font-bold text-lg focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1">বাংলা বর্ণনা</Label>
                      <Textarea name="descBn" required className="bg-muted/50 border-none min-h-[120px] leading-relaxed resize-none p-4 rounded-2xl" placeholder="কোর্সের মূল উদ্দেশ্য এবং আউটকাম এখানে লিখুন..." />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1">English Description</Label>
                      <Textarea name="descEn" required className="bg-muted/50 border-none min-h-[120px] leading-relaxed resize-none p-4 rounded-2xl" placeholder="Detailed curriculum objective and learning outcomes..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                       <div className="space-y-3">
                         <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1">Difficulty Level</Label>
                         <Select name="level" defaultValue="Beginner">
                           <SelectTrigger className="bg-muted/50 border-none h-12 font-bold rounded-xl">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="Beginner">Beginner (নবাগত)</SelectItem>
                             <SelectItem value="Intermediate">Intermediate (মাঝারি)</SelectItem>
                             <SelectItem value="Advanced">Advanced (দক্ষ)</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                       <div className="space-y-3">
                         <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1">Curriculum Language</Label>
                         <Select name="lang" defaultValue="BN+EN">
                           <SelectTrigger className="bg-muted/50 border-none h-12 font-bold rounded-xl">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="BN+EN">Bilingual (বাংলা+English)</SelectItem>
                             <SelectItem value="BN Only">Bengali Only</SelectItem>
                             <SelectItem value="EN Only">English Only</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-4 bg-muted/30 p-5 rounded-2xl border border-muted-foreground/5 group hover:border-primary/20 transition-all">
                      <div className="p-3 bg-background rounded-xl border-none shadow-sm group-hover:scale-110 transition-transform">
                         <Shield className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="course-wizard-pub" className="text-sm font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer">
                          Publish Immediately
                        </Label>
                        <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Visible to all members after successful deployment.</p>
                      </div>
                      <Checkbox name="published" id="course-wizard-pub" defaultChecked className="w-6 h-6 rounded-lg data-[state=checked]:bg-emerald-500" />
                    </div>
                    <Button type="submit" className="md:col-span-2 w-full h-16 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all bg-primary hover:bg-primary/90 text-primary-foreground group">
                      <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
                      Finalize Blueprint
                      <ArrowRight className="w-4 h-4 ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </form>
               </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "lessons" && adminCourseId && (
          <motion.div 
            key="lessons"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between gap-4">
              <Button variant="outline" size="sm" onClick={() => setStep("select")} className="h-9 px-4 rounded-xl border-muted-foreground/10 font-bold transition-all hover:bg-primary/5">
                 ← Back to Courses
              </Button>
              <div className="flex items-center gap-3">
                 <Badge variant="outline" className="font-black uppercase tracking-[0.2em] text-[10px] border-primary/20 text-primary bg-primary/5 px-3 py-1 animate-pulse">
                   Active Editing Context: {adminCourseId}
                 </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Lesson Entry Section */}
               <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm h-fit">
                  <CardHeader className="bg-primary/5 border-b border-muted-foreground/5 p-6">
                    <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                       <ListOrdered className="w-5 h-5 text-primary" /> Add New Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={addLesson} className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1">বাংলা সেশন টাইটেল</Label>
                        <Input name="titleBn" required className="bg-muted/50 border-none h-12 font-black" placeholder="মডিউল পরিচিতি" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1">English Session Title</Label>
                        <Input name="titleEn" required className="bg-muted/50 border-none h-12 font-black" placeholder="Module Overview" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1">Sequence Order</Label>
                          <Input name="order" type="number" defaultValue={adminLessons.length + 1} required className="bg-muted/50 border-none h-12 font-bold" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1">Session Duration</Label>
                          <Input name="duration" placeholder="15m" className="bg-muted/50 border-none h-12 font-bold" />
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-14 font-black uppercase tracking-widest shadow-lg shadow-primary/20 bg-primary group">
                        <Plus className="w-5 h-5 mr-3 transition-transform group-hover:rotate-180" />
                        Inject Session
                      </Button>
                    </form>
                  </CardContent>
               </Card>

               {/* Lesson List Section */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Sequence Preview
                    </h4>
                    <Badge variant="outline" className="font-bold border-muted-foreground/10 text-[10px] bg-muted/50">
                      {adminLessons.length} Total Elements
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {adminLessons.map((lesson, idx) => (
                      <motion.div 
                        key={lesson.id} 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative"
                      >
                         <Card className="border-muted/10 bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-all group-hover:shadow-lg">
                           <CardContent className="p-4 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-muted/50 flex flex-col items-center justify-center font-black leading-tight border border-muted-foreground/5 shadow-inner group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                  <span className="text-[10px] text-muted-foreground uppercase opacity-50 group-hover:text-primary/50">Pos</span>
                                  <span className="text-sm">{lesson.order ?? idx + 1}</span>
                                </div>
                                <div>
                                  <div className="text-sm font-black group-hover:text-primary transition-colors leading-tight">{getLessonTitle(lesson)}</div>
                                  <div className="text-[10px] font-bold text-muted-foreground/50 flex items-center gap-2 mt-1">
                                     <Clock className="w-3.5 h-3.5" /> {lesson.duration || "N/A"} · ID: {lesson.id?.slice(0, 8)}...
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                 <div className="flex flex-col gap-1 pr-2 border-r border-muted-foreground/10 mr-1">
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      onClick={() => moveLesson(adminCourseId, idx, -1)} 
                                      disabled={idx === 0}
                                      className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-30"
                                    >
                                      <ChevronRight className="w-4 h-4 -rotate-90" />
                                    </Button>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      onClick={() => moveLesson(adminCourseId, idx, 1)} 
                                      disabled={idx === adminLessons.length - 1}
                                      className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-30"
                                    >
                                      <ChevronRight className="w-4 h-4 rotate-90" />
                                    </Button>
                                 </div>
                                 <Button 
                                   size="icon" 
                                   variant="ghost" 
                                   className="h-9 w-9 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 rounded-xl"
                                 >
                                   <Trash2 className="w-4 h-4" />
                                 </Button>
                              </div>
                           </CardContent>
                         </Card>
                      </motion.div>
                    ))}

                    {!adminLessons.length && (
                      <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50 opacity-40">
                         <Type className="w-10 h-10 mb-4" />
                         <p className="text-xs font-black uppercase tracking-widest text-center">Empty Sequence.<br/>Define your first session above.</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurriculumWizard;

