"use server";

import { generateMicroLesson, type GenerateMicroLessonInput } from "@/ai/flows/generate-micro-lesson";
import { getQuizFeedback, type GetQuizFeedbackInput } from "@/ai/flows/get-quiz-feedback";

export async function generateLessonAction(topic: string, isSimpleExplanation: boolean): Promise<{
  lessonContent?: string;
  error?: string;
  quizQuestions?: any[];
}> {
  try {
    const result = await generateMicroLesson({ topic, isSimpleExplanation });
    if (!result.lessonContent) {
      return { error: "Failed to generate lesson content." };
    }
    return { lessonContent: result.lessonContent, quizQuestions: result.quizQuestions };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

export async function getQuizFeedbackAction(input: GetQuizFeedbackInput): Promise<{
  feedback?: string;
  error?: string;
}> {
  try {
    const result = await getQuizFeedback(input);
    if (!result.feedback) {
      return { error: "Failed to generate feedback." };
    }
    return { feedback: result.feedback };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
