
"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

const skillsData = [
    { name: 'Python', value: 400 },
    { name: 'SQL', value: 300 },
    { name: 'AWS', value: 280 },
    { name: 'React', value: 200 },
    { name: 'Java', value: 250 },
];
const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const hiringCompaniesData = [
    { name: 'Google', jobs: 250 },
    { name: 'Amazon', jobs: 310 },
    { name: 'Microsoft', jobs: 280 },
    { name: 'Meta', jobs: 200 },
    { name: 'Apple', jobs: 180 },
]

const salaryData = [
  { level: 'Entry', min: 70000, max: 95000 },
  { level: 'Mid', min: 90000, max: 130000 },
  { level: 'Senior', min: 120000, max: 180000 },
  { level: 'Lead', min: 160000, max: 220000 },
]

export default function InsightsPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Job Market Insights: Software Engineer</CardTitle>
                    <CardDescription>Real-time trends and data for your target career.</CardDescription>
                </CardHeader>
            </Card>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>In-Demand Skills</CardTitle>
                        <CardDescription>The most frequently mentioned skills in job postings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full h-[300px]">
                           <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={skillsData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                        {skillsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Top Hiring Companies</CardTitle>
                        <CardDescription>Companies with the most open positions this month.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="w-full h-[300px]">
                           <ResponsiveContainer>
                                <BarChart data={hiringCompaniesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="jobs" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Salary Benchmarks</CardTitle>
                    <CardDescription>Expected salary ranges by experience level.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                     <div className="w-full h-[300px]">
                        <ResponsiveContainer>
                            <BarChart data={salaryData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="level" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value)/1000}k`} />
                                <Tooltip formatter={(value, name) => [new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value)), name === 'max' ? 'Max Salary' : 'Min Salary']} />
                                <Legend />
                                <Bar dataKey="min" fill="hsl(var(--chart-2))" name="Minimum Salary" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="max" fill="hsl(var(--primary))" name="Maximum Salary" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
