'use server';

/**
 * @fileOverview An AI agent that provides workflow optimization tips for e-commerce marketplace managers.
 *
 * - getWorkflowOptimizationTips - A function that retrieves workflow optimization tips.
 * - WorkflowOptimizationTipsInput - The input type for the getWorkflowOptimizationTips function.
 * - WorkflowOptimizationTipsOutput - The return type for the getWorkflowOptimizationTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WorkflowOptimizationTipsInputSchema = z.object({
  backlogData: z
    .string()
    .describe('Backlog data including store names, payment order, and marketplace source.'),
  pickingPerformance: z
    .string()
    .describe('Analysis of the trend and time taken for order picking.'),
  packingPerformance: z
    .string()
    .describe('Analysis of the trend and time taken for order packing.'),
  shippingPerformance: z
    .string()
    .describe('Analysis of the trends in the time taken to ship orders.'),
});
export type WorkflowOptimizationTipsInput = z.infer<
  typeof WorkflowOptimizationTipsInputSchema
>;

const WorkflowOptimizationTipsOutputSchema = z.object({
  tips: z
    .array(z.string())
    .describe('AI-powered tips on how to optimize the e-commerce workflow.'),
});
export type WorkflowOptimizationTipsOutput = z.infer<
  typeof WorkflowOptimizationTipsOutputSchema
>;

export async function getWorkflowOptimizationTips(
  input: WorkflowOptimizationTipsInput
): Promise<WorkflowOptimizationTipsOutput> {
  return workflowOptimizationTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'workflowOptimizationTipsPrompt',
  input: {schema: WorkflowOptimizationTipsInputSchema},
  output: {schema: WorkflowOptimizationTipsOutputSchema},
  prompt: `You are an AI assistant that analyzes e-commerce workflow data and provides actionable tips to optimize operations.

  Analyze the following data and provide a list of tips to reduce bottlenecks in picking, packing, and shipping.

  Backlog Data: {{{backlogData}}}
  Picking Performance: {{{pickingPerformance}}}
  Packing Performance: {{{packingPerformance}}}
  Shipping Performance: {{{shippingPerformance}}}

  Provide the tips as a numbered list.`,
});

const workflowOptimizationTipsFlow = ai.defineFlow(
  {
    name: 'workflowOptimizationTipsFlow',
    inputSchema: WorkflowOptimizationTipsInputSchema,
    outputSchema: WorkflowOptimizationTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
