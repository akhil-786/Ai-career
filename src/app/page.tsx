import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, Bot, TrendingUp, Target, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ThemeToggleButton } from "@/components/shared/theme-toggle-button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white dark:bg-card sticky top-0 z-50">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <ThemeToggleButton />
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">Login</Link>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center bg-white dark:bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline">
                Your AI Career Mentor
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Navigate your career path with confidence. Get personalized guidance, from resume analysis to mock interviews, all powered by AI.
              </p>
              <div className="space-x-4 mt-6">
                <Button asChild size="lg">
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/dashboard">Try Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12 font-headline">
              Features to Fast-Track Your Career
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <FileText className="w-8 h-8 text-primary" />
                  <CardTitle>Resume Analyzer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Upload your resume to get an instant analysis of your skills, experience, and an ATS score with improvement tips.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Briefcase className="w-8 h-8 text-primary" />
                  <CardTitle>AI Career Match</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Discover your best-fit career paths based on your skills, interests, and personality traits.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Bot className="w-8 h-8 text-primary" />
                  <CardTitle>Mock Interviewer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Practice for your next interview with an AI that asks role-specific questions and gives instant feedback.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  <CardTitle>Job Market Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Get real-time data on job trends, salary benchmarks, and in-demand skills for your chosen field.</p>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Target className="w-8 h-8 text-primary" />
                  <CardTitle>Progress Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Visualize your progress with skill mastery graphs and a career readiness meter to stay motivated.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <LinkIcon className="w-8 h-8 text-primary" />
                  <CardTitle>Learning Roadmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Receive a personalized roadmap with courses and projects to bridge your skill gaps.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Ready to build your future?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join CareerWise AI today and take the first step towards a more fulfilling career.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2 mt-4">
               <Button asChild size="lg" className="w-full">
                  <Link href="/signup">Sign Up Now</Link>
                </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 CareerWise AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">Terms of Service</Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
}
