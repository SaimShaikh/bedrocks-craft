import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface TopicFormProps {
  onGenerate: (topic: string) => void;
  isGenerating: boolean;
}

const TopicForm = ({ onGenerate, isGenerating }: TopicFormProps) => {
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    if (topic.trim().length < 3) {
      setError("Topic must be at least 3 characters");
      return;
    }

    setError("");
    onGenerate(topic.trim());
  };

  const handleInputChange = (value: string) => {
    setTopic(value);
    if (error) setError(""); // Clear error on input change
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topic" className="text-foreground font-medium">
          Blog Topic
        </Label>
        <Input
          id="topic"
          type="text"
          placeholder="e.g., The Future of AI in DevOps"
          value={topic}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={isGenerating}
          className={`bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary transition-all ${
            error ? "border-destructive focus-visible:ring-destructive" : ""
          }`}
          maxLength={200}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "topic-error" : undefined}
        />
        {error && (
          <p id="topic-error" className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isGenerating || !topic.trim()}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all hover:shadow-glow"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Blog"
        )}
      </Button>
    </form>
  );
};

export default TopicForm;
