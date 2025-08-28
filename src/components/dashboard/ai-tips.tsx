"use client";

import { fetchWorkflowTips } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

export function AiTips() {
  const [isPending, startTransition] = useTransition();
  const [tips, setTips] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTips = () => {
    startTransition(async () => {
      const result = await fetchWorkflowTips();
      if (result.error) {
        setError(result.error);
        setTips([]);
      } else {
        setTips(result.tips);
        setError(null);
      }
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
                <Lightbulb className="h-6 w-6" />
                <div>
                    <CardTitle>AI-Powered Tips</CardTitle>
                    <CardDescription>
                    Advice on optimizing your workflow.
                    </CardDescription>
                </div>
            </div>
            <Button onClick={handleGenerateTips} disabled={isPending} size="sm" variant="outline">
                {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    "Generate"
                )}
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!isPending && tips.length > 0 && (
          <ul className="space-y-3 text-sm list-disc pl-5 text-muted-foreground">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        )}
        {!isPending && tips.length === 0 && !error && (
            <p className="text-sm text-center text-muted-foreground py-8">Click "Generate" to get workflow optimization tips.</p>
        )}
      </CardContent>
    </Card>
  );
}
