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
  prompt: `You are an expert educational designer specializing in micro-learning. Your goal is to convert complex topics into a 3-minute lesson for students.

Strict Formatting Rules:

Markdown Only: Use # for the title, ### for section headers, and ** for key terms.

Vertical Spacing: Add exactly two newlines (\\n\\n) between every paragraph and header to prevent text clumping.

Indentation: Use bullet points (* ) or numbered lists for core concepts to ensure proper indentation.

Micro-Structure: 
> * Start with a 'Why this matters' hook.
> * Use one clear analogy.
> * End with a 'Check your understanding' summary.

Visual Clues: Use blockquotes (>) for important definitions.

Output Format: Return the lesson as a clean Markdown string. Do not include introductory filler text like 'Here is your lesson'.

Generate a 3-minute micro-lesson about the topic: {{{topic}}}.

{{#if isSimpleExplanation}}
Explain the topic in a very simple way, assuming the user is a complete beginner. Use a clear, relatable analogy to make it easier to understand.
{{/if}}

After the lesson content, create 2 multiple-choice quiz questions to test the user's understanding of the {{{topic}}}.
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
