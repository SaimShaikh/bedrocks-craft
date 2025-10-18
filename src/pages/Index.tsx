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

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground animate-fade-in">
          <p>
            Built by <span className="text-primary font-medium">Bedrock Blog Studio Team</span> | 
            Powered by <span className="text-accent font-medium">AWS Bedrock</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
