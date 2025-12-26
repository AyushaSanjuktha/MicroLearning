"use server";

import { generateMicroLesson } from "@/ai/flows/generate-micro-lesson";

export async function generateLessonAction(topic: string): Promise<{
  lessonContent?: string;
  error?: string;
  quizQuestions?: any[];
}> {
  try {
    const result = await generateMicroLesson({ topic });
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
