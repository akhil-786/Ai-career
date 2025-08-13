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
  output: {schema: MockInterviewOutputSchema},
  prompt: `You are an AI interviewer conducting a mock interview for the role of {{jobRole}} at the {{experienceLevel}}.

  Your goal is to ask relevant interview questions and provide constructive feedback to help the candidate improve their interviewing skills.

  Consider the user's previous responses in the interviewContext when formulating the next question.
  Make sure to only ask one question at a time. Once the user answers, you will be given the user's response to give feedback on.

  If the user has not given a response yet, generate a new question. Use the following format for your response:
  Question: [The next question to ask the candidate]
  InterviewContext: [running context of the interview]

  If the user has given a response, provide targeted feedback on the response, then pose the next question. Use the following format for your response:
  Feedback: [Your feedback on the candidate's response]
  Question: [The next question to ask the candidate]
  InterviewContext: [running context of the interview]

  {{#if previousInterviewContext}}
  Previous interview context:
  {{previousInterviewContext}}
  {{/if}}

  {{#if userResponse}}
  Candidate's Response:
  {{userResponse}}
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
    const regexQuestion = /Question: (.*)/;
    const regexFeedback = /Feedback: (.*)/;
    const regexInterviewContext = /InterviewContext: (.*)/;

    const questionMatch = output!.text.match(regexQuestion);
    const feedbackMatch = output!.text.match(regexFeedback);
    const interviewContextMatch = output!.text.match(regexInterviewContext);

    const question = questionMatch ? questionMatch[1].trim() : 'Error: Question not found.';
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : undefined;
    const interviewContext = interviewContextMatch ? interviewContextMatch[1].trim() : 'Error: Interview context not found.';

    return {
      question: question,
      feedback: feedback,
      interviewContext: interviewContext
    };
  }
);
