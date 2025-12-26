
'use server';

/**
 * @fileOverview A Genkit flow for generating a micro-lesson on a given topic.
 *
 * - generateMicroLesson - A function that generates a micro-lesson.
 * - GenerateMicroLessonInput - The input type for the generateMicroLesson function.
 * - GenerateMicroLessonOutput - The return type for the generateMicroLesson function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMicroLessonInputSchema = z.object({
  topic: z.string().describe('The topic for the micro-lesson.'),
});
export type GenerateMicroLessonInput = z.infer<
  typeof GenerateMicroLessonInputSchema
>;

const GenerateMicroLessonOutputSchema = z.object({
  lessonContent: z
    .string()
    .describe('The AI-generated content for the micro-lesson.'),
});
export type GenerateMicroLessonOutput = z.infer<
  typeof GenerateMicroLessonOutputSchema
>;

export async function generateMicroLesson(
  input: GenerateMicroLessonInput
): Promise<GenerateMicroLessonOutput> {
  return generateMicroLessonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMicroLessonPrompt',
  input: {schema: GenerateMicroLessonInputSchema},
  output: {schema: GenerateMicroLessonOutputSchema},
  prompt: `You are an expert educator specializing in concise, engaging micro-lessons.
  Generate a short, informative lesson about the topic: {{{topic}}}. Focus on the core concepts and provide a few practical examples.
  Keep the lesson brief and easy to understand.
  The lesson should be in markdown format.`,
});

const generateMicroLessonFlow = ai.defineFlow(
  {
    name: 'generateMicroLessonFlow',
    inputSchema: GenerateMicroLessonInputSchema,
    outputSchema: GenerateMicroLessonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
