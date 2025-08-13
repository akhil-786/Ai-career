'use server';

/**
 * @fileOverview Implements an AI mock interviewer flow.
 *
 * - mockInterview - A function that conducts a mock interview and provides feedback.
 * - MockInterviewInput - The input type for the mockInterview function.
 * - MockInterviewOutput - The return type for the mockInterview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MockInterviewInputSchema = z.object({
  jobRole: z.string().describe('The job role for the mock interview.'),
  experienceLevel: z
    .string()
    .describe('The experience level for the job (e.g., Entry-level, Mid-level, Senior-level).'),
  userResponse: z.string().optional().describe('The user\'s response to the AI interviewer question.'),
  previousInterviewContext: z.string().optional().describe("Previous interview context in case this is not the first turn. This can include previous questions, answers, and feedback.")
});

export type MockInterviewInput = z.infer<typeof MockInterviewInputSchema>;

const MockInterviewOutputSchema = z.object({
  question: z.string().describe('The AI interviewer\'s question.'),
  feedback: z.string().optional().describe('Feedback on the user\'s response.'),
  interviewContext: z.string().describe('The running context of the interview.')
});

export type MockInterviewOutput = z.infer<typeof MockInterviewOutputSchema>;


export async function mockInterview(input: MockInterviewInput): Promise<MockInterviewOutput> {
  return mockInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mockInterviewerPrompt',
  input: {schema: MockInterviewInputSchema},
  prompt: `You are an AI interviewer conducting a mock interview for the role of {{jobRole}} ({{experienceLevel}}).

Your goal is to ask relevant interview questions and provide constructive feedback.

Follow this process:
1.  Ask one question at a time.
2.  If the user provides a response, give feedback on that response.
3.  After giving feedback (or if it's the first turn), ask the next question.
4.  Maintain a running context of the interview (questions asked, topics covered).

**Response Format:**
You MUST structure your response using the following template. Do not include any other text or formatting. Start with <response> and end with </response>.

<response>
  <question>Your next interview question goes here.</question>
  {{#if userResponse}}<feedback>Your feedback on the user's response goes here.</feedback>{{/if}}
  <interview_context>A summary of the interview so far goes here.</interview_context>
</response>

**Interview State:**

{{#if previousInterviewContext}}
Previous Context:
{{{previousInterviewContext}}}
{{else}}
This is the beginning of the interview. Ask your first question.
{{/if}}

{{#if userResponse}}
Candidate's Response:
{{{userResponse}}}
{{/if}}
`,
});


const mockInterviewFlow = ai.defineFlow(
  {
    name: 'mockInterviewFlow',
    inputSchema: MockInterviewInputSchema,
    outputSchema: MockInterviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    const responseText = output?.text ?? '';

    const questionMatch = responseText.match(/<question>([\s\S]*?)<\/question>/);
    const feedbackMatch = responseText.match(/<feedback>([\s\S]*?)<\/feedback>/);
    const interviewContextMatch = responseText.match(/<interview_context>([\s\S]*?)<\/interview_context>/);
    
    const question = questionMatch ? questionMatch[1].trim() : 'I am having trouble coming up with the next question. Could you try responding again?';
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : undefined;
    let interviewContext = interviewContextMatch ? interviewContextMatch[1].trim() : 'No context available.';

    // Ensure context is passed for the next turn
    if (!interviewContext || interviewContext === 'No context available.') {
      interviewContext = input.previousInterviewContext || `Interview for ${input.jobRole} (${input.experienceLevel}) started.`;
    }

    return {
      question: question,
      feedback: feedback,
      interviewContext: interviewContext,
    };
  }
);
