"use client";

import { useState } from "react";
import { BookOpen, CheckCircle, Wand2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generateLessonAction } from "./actions";
import MarkdownRenderer from "@/components/markdown-renderer";

const quizQuestions = [
  {
    id: "q1",
    question: "What is an array?",
    options: [
      "A collection of key-value pairs",
      "An ordered collection of elements",
      "A single value",
      "A function",
    ],
    correctAnswer: "An ordered collection of elements",
  },
  {
    id: "q2",
    question:
      "How do you access the first element of an array named 'myArray'?",
    options: ["myArray[1]", "myArray.first()", "myArray[0]", "myArray.get(0)"],
    correctAnswer: "myArray[0]",
  },
];

export default function Home() {
  const [lessonContent, setLessonContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGenerateLesson = async () => {
    setIsLoading(true);
    setLessonContent("");
    setSelectedAnswers({});
    setQuizScore(null);
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

  const handleAnswerChange = (questionId: string, value: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    setQuizScore(score);
  };

  const allQuestionsAnswered =
    Object.keys(selectedAnswers).length === quizQuestions.length;

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
            <div className="animate-in fade-in-50 duration-500 space-y-8">
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

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary font-headline">
                    Quick Quiz
                  </CardTitle>
                  <CardDescription>
                    Test your knowledge on arrays.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {quizQuestions.map((q, index) => (
                    <div key={q.id}>
                      <p className="font-medium text-card-foreground mb-3">
                        {index + 1}. {q.question}
                      </p>
                      <RadioGroup
                        value={selectedAnswers[q.id]}
                        onValueChange={(value) => handleAnswerChange(q.id, value)}
                        disabled={quizScore !== null}
                      >
                        {q.options.map((option) => {
                          const isCorrect = option === q.correctAnswer;
                          const isSelected = selectedAnswers[q.id] === option;
                          const showResult = quizScore !== null;

                          return (
                            <div
                              key={option}
                              className={`flex items-center space-x-3 p-2 rounded-md ${
                                showResult && isCorrect
                                  ? "bg-green-100 dark:bg-green-900/30"
                                  : ""
                              } ${
                                showResult && isSelected && !isCorrect
                                  ? "bg-red-100 dark:bg-red-900/30"
                                  : ""
                              }`}
                            >
                              <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                              <Label
                                htmlFor={`${q.id}-${option}`}
                                className="flex-1 cursor-pointer"
                              >
                                {option}
                              </Label>
                              {showResult && isCorrect && (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              )}
                              {showResult && isSelected && !isCorrect && (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                  {quizScore === null ? (
                    <Button
                      onClick={handleSubmitQuiz}
                      disabled={!allQuestionsAnswered}
                    >
                      Submit Quiz
                    </Button>
                  ) : (
                    <div className="w-full text-center p-4 bg-secondary rounded-lg">
                      <p className="text-lg font-bold text-secondary-foreground">
                        Your Score: {quizScore} / {quizQuestions.length}
                      </p>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
