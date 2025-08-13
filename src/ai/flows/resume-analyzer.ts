
'use server';

/**
 * @fileOverview Analyzes a resume to extract skills, experience, and calculate an ATS score.
 *
 * - analyzeResume - A function that handles the resume analysis process.
 * - AnalyzeResumeInput - The input type for the analyzeResume function.
 * - AnalyzeResumeOutput - The return type for the analyzeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  calculateAtsScore: z
    .boolean()
    .optional()
    .describe('Whether to calculate the ATS score and provide improvement suggestions.'),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  skills: z.array(z.string()).describe('A list of skills extracted from the resume.'),
  experience: z.string().describe('A summary of the work experience extracted from the resume.'),
  education: z.string().describe('A summary of the education extracted from the resume.'),
  atsScore: z.number().optional().describe('The calculated ATS score from 0 to 100.'),
  atsSuggestions: z
    .string()
    .optional()
    .describe('Suggestions to improve the resume for better ATS compatibility.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const analyzeResumePrompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are an expert resume analyzer and career coach. Your job is to extract the skills, experience, and education from a resume.

  Here is the resume:
  {{media url=resumeDataUri}}

  1. Extract the skills, experience, and education.
  {{#if calculateAtsScore}}
  2. Calculate an Applicant Tracking System (ATS) score for this resume out of 100. The score should reflect keyword optimization, formatting, and clarity.
  3. Provide concrete suggestions for how to improve the ATS score.
  {{/if}}

  Format the output as a valid JSON object.
  `,
});

const analyzeResumeFlow = ai.defineFlow(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async input => {
    const {output} = await analyzeResumePrompt(input);
    return output!;
  }
);
