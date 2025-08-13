
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LearningRoadmapPage() {
  return (
    <div className="space-y-6">
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Learning Roadmaps are now part of Career Match!</CardTitle>
          <CardDescription>To get a personalized learning roadmap, please go to the Career Match page and find your recommended career paths.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/career-match">Go to Career Match</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
