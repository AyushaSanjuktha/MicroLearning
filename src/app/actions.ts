"use server";

import { generateArraysMicroLesson } from "@/ai/flows/generate-arrays-micro-lesson";

export async function generateLessonAction(): Promise<{
  lessonContent?: string;
  error?: string;
}> {
  try {
    const result = await generateArraysMicroLesson({ topic: "Arrays" });
    if (!result.lessonContent) {
      return { error: "Failed to generate lesson content." };
    }
    return { lessonContent: result.lessonContent };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
