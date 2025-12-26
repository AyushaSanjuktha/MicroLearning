"use client";

import { useState } from "react";
import { BookOpen, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generateLessonAction } from "./actions";
import MarkdownRenderer from "@/components/markdown-renderer";

export default function Home() {
  const [lessonContent, setLessonContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateLesson = async () => {
    setIsLoading(true);
    setLessonContent("");
    const result = await generateLessonAction();
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else if (result.lessonContent) {
      setLessonContent(result.lessonContent);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-3xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 font-headline">
            MicroLearnAI
          </h1>
          <p className="text-lg text-muted-foreground">
            Your personal AI-powered learning companion.
          </p>
        </header>

        <section className="bg-card p-6 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-card-foreground flex items-center gap-2 font-headline">
              <BookOpen className="text-primary" />
              Topic: Arrays
            </h2>
            <p className="text-muted-foreground mt-1">
              Generate a bite-sized lesson on the fundamentals of arrays.
            </p>
          </div>
          <Button
            onClick={handleGenerateLesson}
            disabled={isLoading}
            size="lg"
            className="w-full sm:w-auto bg-accent hover:bg-accent/90"
          >
            <Wand2 className="mr-2 h-5 w-5" />
            {isLoading ? "Generating..." : "Generate Micro Lesson (AI)"}
          </Button>
        </section>

        <section>
          {isLoading && (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          )}

          {lessonContent && (
            <div className="animate-in fade-in-50 duration-500">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary font-headline">
                    Your Micro-Lesson on Arrays
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownRenderer content={lessonContent} />
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
