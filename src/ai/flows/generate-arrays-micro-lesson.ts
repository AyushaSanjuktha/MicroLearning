'use server';

/**
 * @fileOverview A Genkit flow for generating a micro-lesson about arrays.
 *
 * - generateArraysMicroLesson - A function that generates a micro-lesson about arrays.
 * - GenerateArraysMicroLessonInput - The input type for the generateArraysMicroLesson function.
 * - GenerateArraysMicroLessonOutput - The return type for the generateArraysMicroLesson function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArraysMicroLessonInputSchema = z.object({
  topic: z.string().describe('The topic for the micro-lesson. Should be \'Arrays\'.'),
});
export type GenerateArraysMicroLessonInput = z.infer<
  typeof GenerateArraysMicroLessonInputSchema
>;

const GenerateArraysMicroLessonOutputSchema = z.object({
  lessonContent: z
    .string()
    .describe('The AI-generated content for the micro-lesson on arrays.'),
});
export type GenerateArraysMicroLessonOutput = z.infer<
  typeof GenerateArraysMicroLessonOutputSchema
>;

export async function generateArraysMicroLesson(
  input: GenerateArraysMicroLessonInput
): Promise<GenerateArraysMicroLessonOutput> {
  return generateArraysMicroLessonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArraysMicroLessonPrompt',
  input: {schema: GenerateArraysMicroLessonInputSchema},
  output: {schema: GenerateArraysMicroLessonOutputSchema},
  prompt: `You are an expert educator specializing in concise, engaging micro-lessons.
  Generate a short, informative lesson about the topic: {{{topic}}}. Focus on the core concepts and provide a few practical examples.
  Keep the lesson brief and easy to understand.
  The lesson should be in markdown format.
  
  Arrays are...`,
});

const generateArraysMicroLessonFlow = ai.defineFlow(
  {
    name: 'generateArraysMicroLessonFlow',
    inputSchema: GenerateArraysMicroLessonInputSchema,
    outputSchema: GenerateArraysMicroLessonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
