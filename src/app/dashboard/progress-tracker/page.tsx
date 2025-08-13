
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const skillsData = [
  { name: 'JavaScript', mastery: 90 },
  { name: 'React', mastery: 85 },
  { name: 'Node.js', mastery: 70 },
  { name: 'Python', mastery: 60 },
  { name: 'SQL', mastery: 75 },
  { name: 'System Design', mastery: 50 },
  { name: 'CI/CD', mastery: 40 },
]

const progressData = [
  { month: 'Jan', readiness: 30 },
  { month: 'Feb', readiness: 45 },
  { month: 'Mar', readiness: 55 },
  { month: 'Apr', readiness: 60 },
  { month: 'May', readiness: 72 },
  { month: 'Jun', readiness: 78 },
]


export default function ProgressTrackerPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Career Readiness: 78%</CardTitle>
                    <CardDescription>Your overall progress towards your career goals.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Progress value={78} className="w-full" />
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Skill Mastery</CardTitle>
                        <CardDescription>Your proficiency in key skills for your target roles.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={skillsData} layout="vertical" margin={{ right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                                <YAxis type="category" dataKey="name" width={80} />
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Bar dataKey="mastery" fill="hsl(var(--primary))" name="Mastery" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Readiness Over Time</CardTitle>
                        <CardDescription>Your career readiness score progression over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                         <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={progressData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Legend />
                                <Line type="monotone" dataKey="readiness" stroke="hsl(var(--primary))" name="Readiness" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Completed Items</CardTitle>
                    <CardDescription>Courses and projects you have completed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Completed: "Advanced React" on Coursera</li>
                        <li>Completed: "Node.js Essentials" on Udemy</li>
                        <li>Project: "E-commerce Backend API"</li>
                        <li>Project: "Personal Portfolio Website"</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
