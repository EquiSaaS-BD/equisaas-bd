"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { BookViewer } from "@/components/books/book-viewer";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function BABookPage() {
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      redirect("/login");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Configuration for the BA Book
  const bookConfig = {
    pdfUrl: "/lms/assets/books/ba-handbook.pdf",
    title: "B2B SaaS স্টার্টআপ ও ওপেন টেক কোঅপারেটিভের জন্য সমাধান",
    author: "EquiSaaS Strategic Advisory",
    category: "Strategic Manual",
    departmentId: "baagile",
    coverImage: "/lms/founder.jpg"
  };

  return (
    <BookViewer 
      pdfUrl={bookConfig.pdfUrl}
      title={bookConfig.title}
      author={bookConfig.author}
      category={bookConfig.category}
      departmentId={bookConfig.departmentId}
      coverImage={bookConfig.coverImage}
    />
  );
}
