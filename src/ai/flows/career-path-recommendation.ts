'use server';

/**
 * @fileOverview A career path recommendation AI agent.
 *
 * - recommendCareerPaths - A function that handles the career path recommendation process.
 * - RecommendCareerPathsInput - The input type for the recommendCareerPaths function.
 * - RecommendCareerPathsOutput - The return type for the recommendCareerPaths function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendCareerPathsInputSchema = z.object({
  skills: z.string().describe('The skills of the user.'),
  experience: z.string().describe('The experience of the user.'),
  interests: z.string().describe('The interests of the user.'),
  considerTechnologies: z
    .boolean()
    .describe(
      'Whether or not to consider specific technologies when creating roadmaps.'
    )
    .optional(),
});
export type RecommendCareerPathsInput = z.infer<typeof RecommendCareerPathsInputSchema>;

const CareerPathSchema = z.object({
  careerPath: z.string().describe('The name of the career path.'),
  jobGrowthPercentage: z.number().describe('The job growth percentage of the career path.'),
  averageSalary: z.number().describe('The average salary of the career path.'),
  demandRating: z.string().describe('The demand rating of the career path.'),
  missingSkills: z.string().describe('The missing skills for the career path.'),
  suggestedProjects: z.string().describe('The suggested projects for the career path.'),
  relevantNetworkingOpportunities: z
    .string()
    .describe('The relevant networking opportunities for the career path.'),
});

const RecommendCareerPathsOutputSchema = z.array(CareerPathSchema).describe('An array of recommended career paths.');
export type RecommendCareerPathsOutput = z.infer<typeof RecommendCareerPathsOutputSchema>;

export async function recommendCareerPaths(
  input: RecommendCareerPathsInput
): Promise<RecommendCareerPathsOutput> {
  return recommendCareerPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCareerPathsPrompt',
  input: {schema: RecommendCareerPathsInputSchema},
  output: {schema: RecommendCareerPathsOutputSchema},
  prompt: `You are an expert career counselor specializing in recommending career paths based on skills, experience, and interests.

You will use this information to recommend 3-5 career paths that align with the user's profile. For each career path, provide a roadmap including missing skills, suggested projects, and relevant networking opportunities.

Skills: {{{skills}}}
Experience: {{{experience}}}
Interests: {{{interests}}}
Consider Technologies: {{#if considerTechnologies}}Yes{{else}}No{{/if}}

Format the response as a JSON array of career paths. Each career path should include:
- careerPath: The name of the career path.
- jobGrowthPercentage: The job growth percentage of the career path.
- averageSalary: The average salary of the career path.
- demandRating: The demand rating of the career path (e.g., High, Medium, Low).
- missingSkills: The missing skills for the career path and how to learn them.
- suggestedProjects: The suggested projects for the career path.
- relevantNetworkingOpportunities: The relevant networking opportunities for the career path.

Ensure the output is a valid JSON array.`,
});

const recommendCareerPathsFlow = ai.defineFlow(
  {
    name: 'recommendCareerPathsFlow',
    inputSchema: RecommendCareerPathsInputSchema,
    outputSchema: RecommendCareerPathsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
