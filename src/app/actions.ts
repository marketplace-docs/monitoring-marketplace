"use server";

import { getWorkflowOptimizationTips } from "@/ai/flows/workflow-optimization-tips";
import {
  backlogData,
  packingPerformanceData,
  pickingPerformanceData,
  shippingPerformanceData,
} from "@/lib/mock-data";

export async function fetchWorkflowTips() {
  try {
    const backlogDataString = `Current Backlog:\n${JSON.stringify(backlogData, null, 2)}`;
    const pickingPerformanceString = `Picking Performance Trend (Avg. Minutes):\n${JSON.stringify(pickingPerformanceData, null, 2)}`;
    const packingPerformanceString = `Packing Performance Trend (Avg. Minutes):\n${JSON.stringify(packingPerformanceData, null, 2)}`;
    const shippingPerformanceString = `Shipping Performance Trend (Avg. Hours):\n${JSON.stringify(shippingPerformanceData, null, 2)}`;

    const response = await getWorkflowOptimizationTips({
      backlogData: backlogDataString,
      pickingPerformance: pickingPerformanceString,
      packingPerformance: packingPerformanceString,
      shippingPerformance: shippingPerformanceString,
    });

    return { tips: response.tips, error: null };
  } catch (error) {
    console.error("Error fetching workflow tips:", error);
    return {
      tips: [],
      error: "Failed to generate AI-powered tips. Please try again later.",
    };
  }
}
