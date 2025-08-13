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
  prompt: `You are an AI interviewer conducting a mock interview for the role of {{jobRole}} at the {{experienceLevel}}.

Your goal is to ask relevant interview questions and provide constructive feedback to help the candidate improve their interviewing skills.

You must always follow this process:
1.  Ask one question at a time.
2.  If the user provides a response, give feedback on that response.
3.  After giving feedback (or if it's the first turn), ask the next question.
4.  Maintain a running context of the interview.

**Response Format:**
You MUST structure your response using the following template. Do not include any other text or formatting.

<response>
<question>Your next interview question goes here.</question>
{{#if userResponse}}<feedback>Your feedback on the user's response goes here.</feedback>{{/if}}
<interview_context>A summary of the interview so far, including questions asked and topics covered, goes here.</interview_context>
</response>

**Interview State:**

{{#if previousInterviewContext}}
Previous Context:
{{{previousInterviewContext}}}
{{else}}
This is the beginning of the interview. Please ask your first question.
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

    const questionMatch = output!.text.match(/<question>(.*?)<\/question>/s);
    const feedbackMatch = output!.text.match(/<feedback>(.*?)<\/feedback>/s);
    const interviewContextMatch = output!.text.match(/<interview_context>(.*?)<\/interview_context>/s);
    
    const question = questionMatch ? questionMatch[1].trim() : 'I am having trouble coming up with the next question. Can you please try again?';
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : undefined;
    const interviewContext = interviewContextMatch ? interviewContextMatch[1].trim() : 'No context available.';

    return {
      question: question,
      feedback: feedback,
      interviewContext: interviewContext
    };
  }
);
