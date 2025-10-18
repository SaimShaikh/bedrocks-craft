import { useState } from "react";
import TopicForm from "@/components/TopicForm";
import ResultPanel from "@/components/ResultPanel";
import { generateBlog } from "@/utils/api";
import { Card } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [blogContent, setBlogContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (topic: string) => {
    setIsGenerating(true);
    setError(null);
    setBlogContent(null);

    try {
      const result = await generateBlog(topic);
      setBlogContent(result.content);
      setTimestamp(new Date());
      toast({
        title: "Success!",
        description: "Your blog has been generated successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <header className="text-center space-y-3 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <Brain className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Bedrock Blog Studio
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Generate AI blogs using AWS Bedrock
          </p>
        </header>

        {/* Main Card */}
        <Card className="p-6 md:p-8 bg-gradient-card backdrop-blur-sm border-border shadow-card">
          <TopicForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        </Card>

        {/* Results */}
        <ResultPanel content={blogContent} error={error} timestamp={timestamp} />

        {/* Footer Section */}
        <footer className="text-center text-sm text-muted-foreground animate-fade-in space-y-3 pt-6 border-t border-border mt-8">
          <p>
            Built by <span className="text-primary font-medium">Saime Shaikh</span> | 
            Powered by <span className="text-accent font-medium">AWS Bedrock</span>
          </p>

          {/* Social Links */}
          <div className="flex justify-center items-center gap-6 mt-3">
            {/* GitHub */}
            <a
              href="https://github.com/SaimShaikh"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-muted transition-all hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.43c.6.11.82-.26.82-.58v-2.1c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.21.09 1.85 1.24 1.85 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.25-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.67 1.64.24 2.86.12 3.16.77.85 1.24 1.93 1.24 3.25 0 4.64-2.81 5.66-5.49 5.96.43.38.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/saim-shaikh-devops/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-muted transition-all hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8.34 19H5.67v-9h2.67v9zM7 8.67c-.85 0-1.5-.69-1.5-1.54 0-.85.65-1.54 1.5-1.54s1.5.69 1.5 1.54c0 .85-.65 1.54-1.5 1.54zM19 19h-2.67v-4.86c0-1.16-.02-2.65-1.62-2.65-1.63 0-1.88 1.27-1.88 2.58V19h-2.67v-9h2.56v1.23h.04c.36-.68 1.25-1.39 2.57-1.39 2.74 0 3.25 1.8 3.25 4.15V19z" />
              </svg>
            </a>

            {/* Website */}
            <a
              href="https://saimeshaikh.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-muted transition-all hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.94 6h-3.37a15.9 15.9 0 00-.71-2.46A8.02 8.02 0 0118.94 8zM12 4c.72.82 1.3 2.04 1.67 4H10.3c.37-1.96.95-3.18 1.7-4zM4.26 14a7.96 7.96 0 010-4h3.48a17.5 17.5 0 000 4H4.26zm.8 2h3.37c.16.88.38 1.68.66 2.46A8.02 8.02 0 015.06 16zm3.37-8H5.06a8.02 8.02 0 013.23-2.46c-.28.78-.5 1.58-.66 2.46zm3.57 10c-.72-.82-1.3-2.04-1.67-4h3.37c-.37 1.96-.95 3.18-1.7 4zM12 20c-.72-.82-1.3-2.04-1.67-4h3.37c-.37 1.96-.95 3.18-1.7 4zM14.26 10c.14.66.22 1.36.26 2s-.12 1.34-.26 2H9.74a15.6 15.6 0 010-4h4.52zM18.94 16h-3.37c.28-.78.5-1.58.66-2.46A8.02 8.02 0 0118.94 16zm.8-2h-3.48a17.5 17.5 0 000-4h3.48a7.96 7.96 0 010 4z" />
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
