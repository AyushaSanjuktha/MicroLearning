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
  isSimpleExplanation: z.boolean().optional().describe('Whether to explain the topic in a simple way.'),
});
export type GenerateMicroLessonInput = z.infer<
  typeof GenerateMicroLessonInputSchema
>;

const GenerateMicroLessonOutputSchema = z.object({
  lessonContent: z
    .string()
    .describe('The AI-generated content for the micro-lesson.'),
  quizQuestions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.string()
  })).describe('A list of quiz questions related to the lesson.')
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
  The lesson should be in markdown format.

  {{#if isSimpleExplanation}}
  Explain the topic in a very simple way, assuming the user is a complete beginner. Use analogies to make it easier to understand.
  {{/if}}

  After the lesson, create 2 multiple-choice quiz questions to test the user's understanding of the {{{topic}}}.
  For each question, provide 4 options and indicate the correct answer.
  Return the lesson and the quiz questions in the specified output format.`,
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
