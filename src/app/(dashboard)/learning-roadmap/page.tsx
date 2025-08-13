import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Laptop, Video } from "lucide-react"

export default function LearningRoadmapPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Roadmap: Full-Stack Engineer</CardTitle>
          <CardDescription>Your personalized plan to achieve your career goal. Check off items as you complete them.</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Phase 1: Frontend Fundamentals</h3>
          <div className="space-y-4">
            <RoadmapItem icon={Video} title="Advanced React & Hooks" source="Coursera" type="Course" />
            <RoadmapItem icon={Video} title="State Management with Redux/Zustand" source="Udemy" type="Course" />
            <RoadmapItem icon={Laptop} title="Build a Complex To-Do App" source="Personal Project" type="Project" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Phase 2: Backend Development</h3>
          <div className="space-y-4">
            <RoadmapItem icon={Video} title="Node.js, Express & MongoDB" source="Official Docs" type="Course" />
            <RoadmapItem icon={Laptop} title="Create a RESTful API for a Blog" source="Personal Project" type="Project" />
            <RoadmapItem icon={BookOpen} title="Read 'Designing Data-Intensive Applications'" source="Book" type="Reading" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Phase 3: DevOps & Deployment</h3>
          <div className="space-y-4">
            <RoadmapItem icon={Video} title="Docker & Kubernetes Basics" source="freeCodeCamp" type="Course" />
            <RoadmapItem icon={Laptop} title="Containerize and Deploy your Blog API" source="Personal Project" type="Project" />
          </div>
        </div>
      </div>
    </div>
  )
}

function RoadmapItem({ icon: Icon, title, source, type }: { icon: React.ElementType, title: string, source: string, type: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
      <Checkbox id={title} />
      <div className="flex items-center gap-4">
         <Icon className="h-6 w-6 text-primary" />
         <div className="grid gap-1">
            <label htmlFor={title} className="font-medium cursor-pointer">{title}</label>
            <p className="text-sm text-muted-foreground">{source} • {type}</p>
         </div>
      </div>
    </div>
  )
}
