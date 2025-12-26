'use server';

/**
 * @fileOverview A Genkit flow for generating feedback on quiz performance.
 *
 * - getQuizFeedback - A function that generates feedback.
 * - GetQuizFeedbackInput - The input type for the getQuizFeedback function.
 * - GetQuizFeedbackOutput - The return type for the getQuizFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IncorrectAnswerSchema = z.object({
  question: z.string(),
  selectedAnswer: z.string(),
  correctAnswer: z.string(),
});

const GetQuizFeedbackInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz.'),
  incorrectAnswers: z.array(IncorrectAnswerSchema).describe('A list of questions the user answered incorrectly.'),
});
export type GetQuizFeedbackInput = z.infer<typeof GetQuizFeedbackInputSchema>;

const GetQuizFeedbackOutputSchema = z.object({
  feedback: z.string().describe('A 1-2 line explanation of why the student might be weak based on their incorrect answers.'),
});
export type GetQuizFeedbackOutput = z.infer<typeof GetQuizFeedbackOutputSchema>;

export async function getQuizFeedback(
  input: GetQuizFeedbackInput
): Promise<GetQuizFeedbackOutput> {
  return getQuizFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getQuizFeedbackPrompt',
  input: {schema: GetQuizFeedbackInputSchema},
  output: {schema: GetQuizFeedbackOutputSchema},
  prompt: `A student took a quiz on the topic "{{topic}}". They answered the following questions incorrectly.
  
  {{#each incorrectAnswers}}
  - Question: {{this.question}}
    - Their Answer: {{this.selectedAnswer}}
    - Correct Answer: {{this.correctAnswer}}
  {{/each}}
  
  Based on these incorrect answers, provide a very brief, 1-2 sentence explanation of the student's potential misunderstanding or weakness. Address the student directly in your feedback.`,
});


const getQuizFeedbackFlow = ai.defineFlow(
  {
    name: 'getQuizFeedbackFlow',
    inputSchema: GetQuizFeedbackInputSchema,
    outputSchema: GetQuizFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
