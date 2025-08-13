
'use client';
import { useState, useRef, useEffect } from 'react';
import { mockInterview, MockInterviewOutput } from '@/ai/flows/mock-interviewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send, Bot, User, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


type Message = {
  role: 'user' | 'assistant';
  content: string;
  feedback?: string;
};

export default function MockInterviewPage() {
  const [jobRole, setJobRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [interviewContext, setInterviewContext] = useState('');

  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollableNode = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollableNode) {
            scrollableNode.scrollTo({ top: scrollableNode.scrollHeight, behavior: 'smooth'});
        }
    }
  }, [messages, isLoading]);

  const startInterview = async () => {
    if (!jobRole || !experienceLevel) {
      toast({
        title: "Missing Information",
        description: "Please provide a job role and experience level.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await mockInterview({ jobRole, experienceLevel });
      setMessages([{ role: 'assistant', content: result.question }]);
      setInterviewContext(result.interviewContext);
      setInterviewStarted(true);
    } catch (error) {
      toast({
        title: "Failed to Start Interview",
        description: "Could not connect to the AI interviewer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendResponse = async () => {
    if (!currentResponse.trim()) return;

    const userMessage: Message = { role: 'user', content: currentResponse };
    setMessages(prev => [...prev, userMessage]);
    const responseToSend = currentResponse;
    setCurrentResponse('');
    setIsLoading(true);

    try {
        const result = await mockInterview({
            jobRole,
            experienceLevel,
            userResponse: responseToSend,
            previousInterviewContext: interviewContext
        });

        const assistantMessage: Message = { role: 'assistant', content: result.question, feedback: result.feedback };
        setMessages(prev => [...prev, assistantMessage]);
        setInterviewContext(result.interviewContext);
    } catch (error) {
        toast({
            title: "Error",
            description: "An error occurred while getting the next question.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  };

  if (!interviewStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Mock Interview Setup</CardTitle>
          <CardDescription>Prepare for your interview by simulating a real one with our AI.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="job-role">Job Role</Label>
            <Input id="job-role" placeholder="e.g., Software Engineer" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="experience-level">Experience Level</Label>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger id="experience-level">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entry-level">Entry-level</SelectItem>
                <SelectItem value="Mid-level">Mid-level</SelectItem>
                <SelectItem value="Senior-level">Senior-level</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={startInterview} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Start Interview
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[calc(100vh-10rem)] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center space-x-4">
                 <Avatar>
                    <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium leading-none">AI Interviewer</p>
                    <p className="text-sm text-muted-foreground">{jobRole} ({experienceLevel})</p>
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
             <ScrollArea className="h-full" ref={scrollAreaRef}>
                 <div className="space-y-6 p-6">
                    {messages.map((message, index) => (
                    <div key={index} className={cn("flex items-start gap-4", message.role === 'user' && 'justify-end')}>
                        {message.role === 'assistant' && (
                            <Avatar>
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn("max-w-[75%] rounded-lg p-3", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                            <p className="text-sm">{message.content}</p>
                            {message.feedback && (
                                <div className="mt-3 border-t pt-3 border-accent/50">
                                    <p className="text-xs font-semibold flex items-center gap-1.5 text-accent-foreground"><Sparkles className="h-3.5 w-3.5 text-accent" /> Feedback</p>
                                    <p className="text-xs text-muted-foreground mt-1">{message.feedback}</p>
                                </div>
                            )}
                        </div>
                         {message.role === 'user' && (
                            <Avatar>
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-4">
                            <Avatar>
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                            <div className="max-w-lg rounded-lg p-3 bg-muted flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        </div>
                    )}
                </div>
             </ScrollArea>
        </CardContent>
        <CardFooter className="border-t pt-4">
            <div className="flex items-center gap-2 w-full">
                <Textarea
                    placeholder="Type your response..."
                    value={currentResponse}
                    onChange={(e) => setCurrentResponse(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendResponse();
                        }
                    }}
                    rows={1}
                    className="flex-1 resize-none min-h-[40px]"
                    disabled={isLoading}
                />
                <Button onClick={handleSendResponse} disabled={isLoading || !currentResponse.trim()} size="icon">
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                </Button>
            </div>
        </CardFooter>
    </Card>
  )
}
