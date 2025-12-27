
"use client";

import { useState, useEffect } from "react";
import { BookOpen, CheckCircle, Wand2, XCircle, Lightbulb, BrainCircuit, User } from "lucide-react";
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
import { generateLessonAction, getQuizFeedbackAction } from "./actions";
import MarkdownRenderer from "@/components/markdown-renderer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

const topics = ["Arrays", "Strings"];

export default function Home() {
  const [lessonContent, setLessonContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSimpleExplanation, setIsSimpleExplanation] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState("Arrays");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [feedback, setFeedback] = useState("");
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const handleGenerateLesson = async () => {
    setIsLoading(true);
    setLessonContent("");
    setQuizQuestions([]);
    setSelectedAnswers({});
    setQuizScore(null);
    setFeedback("");
    const result = await generateLessonAction(selectedTopic, isSimpleExplanation);
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else if (result.lessonContent) {
      setLessonContent(result.lessonContent);
      setQuizQuestions(result.quizQuestions || []);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitQuiz = async () => {
    if (!user) return;
    let score = 0;
    const incorrectAnswers: { question: string; selectedAnswer: string; correctAnswer: string }[] = [];
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      } else {
        incorrectAnswers.push({
          question: q.question,
          selectedAnswer: selectedAnswers[q.id],
          correctAnswer: q.correctAnswer,
        });
      }
    });
    setQuizScore(score);

    // Save quiz score to firestore
    const scoreRef = doc(firestore, `users/${user.uid}/quizScores/${Date.now()}`);
    setDocumentNonBlocking(scoreRef, {
      id: scoreRef.id,
      userId: user.uid,
      quizId: selectedTopic, // using topic as quizId for simplicity
      score: score,
      completionDate: new Date().toISOString(),
    }, { merge: true });

    // Update learning progress
    const progressRef = doc(firestore, `users/${user.uid}/learningProgress/${selectedTopic}`);
    const completed = score / quizQuestions.length >= 0.5;
    setDocumentNonBlocking(progressRef, {
      id: selectedTopic,
      userId: user.uid,
      topicId: selectedTopic,
      completed: completed,
      timeSpent: 5, // Assuming 5 minutes per lesson
    }, { merge: true });


    if (incorrectAnswers.length > 0) {
      setIsFeedbackLoading(true);
      const result = await getQuizFeedbackAction({ topic: selectedTopic, incorrectAnswers });
      if (result.feedback) {
        setFeedback(result.feedback);
      }
      setIsFeedbackLoading(false);
    }
  };

  const allQuestionsAnswered =
    quizQuestions.length > 0 && Object.keys(selectedAnswers).length === quizQuestions.length;

  const getRecommendation = () => {
    if (quizScore === null) return null;
    const percentage = (quizScore / quizQuestions.length) * 100;
    if (percentage < 50) {
      return "Recommendation: Revise this topic using micro-lessons.";
    }
    return "Recommendation: Move to the next topic.";
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
        <Skeleton className="h-10 w-48" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-3xl">
        <header className="text-center mb-8 flex justify-between items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 font-headline">
            MicroLearnAI
          </h1>
          <p className="text-lg text-muted-foreground">
            Your personal AI-powered learning companion.
          </p>
          <Link href="/dashboard" passHref>
            <Button variant="ghost">
              <User className="mr-2" /> Dashboard
            </Button>
          </Link>
        </header>

        <section className="bg-card p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto flex-grow">
              <h2 className="text-2xl font-semibold text-card-foreground flex items-center gap-2 font-headline mb-2">
                <BookOpen className="text-primary" />
                Topic
              </h2>
              <Select onValueChange={setSelectedTopic} defaultValue={selectedTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleGenerateLesson}
              disabled={isLoading}
              size="lg"
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 mt-4 sm:mt-0"
            >
              <Wand2 className="mr-2 h-5 w-5" />
              {isLoading ? "Generating..." : "Generate Micro Lesson (AI)"}
            </Button>
          </div>
          <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
            <Switch id="simple-explanation" checked={isSimpleExplanation} onCheckedChange={setIsSimpleExplanation} />
            <Label htmlFor="simple-explanation" className="text-muted-foreground">Explain in a Simple Way</Label>
          </div>
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
                    Your Micro-Lesson on {selectedTopic}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownRenderer content={lessonContent} />
                </CardContent>
              </Card>

              {quizQuestions.length > 0 && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary font-headline">
                      Quick Quiz
                    </CardTitle>
                    <CardDescription>
                      Test your knowledge on {selectedTopic}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {quizQuestions.map((q, index) => {
                      const showResult = quizScore !== null;
                      return (
                        <div key={q.id}>
                          <p className="font-medium text-card-foreground mb-3">
                            {index + 1}. {q.question}
                          </p>
                          <RadioGroup
                            value={selectedAnswers[q.id]}
                            onValueChange={(value) => handleAnswerChange(q.id, value)}
                            disabled={showResult}
                          >
                            {q.options.map((option) => {
                              const isCorrect = option === q.correctAnswer;
                              const isSelected = selectedAnswers[q.id] === option;

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
                      );
                    })}
                  </CardContent>
                  <CardFooter className="flex-col items-stretch gap-4">
                    {quizScore === null ? (
                      <Button
                        onClick={handleSubmitQuiz}
                        disabled={!allQuestionsAnswered}
                      >
                        Submit Quiz
                      </Button>
                    ) : (
                      <div className="w-full text-center p-4 bg-secondary rounded-lg space-y-3">
                        <p className="text-lg font-bold text-secondary-foreground">
                          Your Score: {quizScore} / {quizQuestions.length}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-accent-foreground/80 bg-accent/80 p-3 rounded-md">
                          <Lightbulb className="h-5 w-5" />
                          <p className="font-semibold">{getRecommendation()}</p>
                        </div>

                        {(isFeedbackLoading || feedback) && (
                          <div className="mt-4 text-left p-4 bg-card rounded-lg">
                            <h3 className="font-semibold text-card-foreground flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-primary" /> AI Feedback</h3>
                            {isFeedbackLoading ? (
                               <div className="space-y-2 mt-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                              </div>
                            ) : (
                              <p className="text-muted-foreground mt-2 text-sm">{feedback}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
