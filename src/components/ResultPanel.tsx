import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultPanelProps {
  content: string | null;
  error: string | null;
  timestamp: Date | null;
}

const ResultPanel = ({ content, error, timestamp }: ResultPanelProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Don't render anything if there's no content or error
  if (!content && !error) {
    return null;
  }

  const handleCopy = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Blog content has been copied successfully",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!content) return;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blog-${timestamp ? timestamp.getTime() : Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "Your blog has been downloaded as a text file",
    });
  };

  if (error) {
    return (
      <Card className="p-6 bg-destructive/10 border-destructive/50 animate-fade-in">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-destructive mb-1">Error</h3>
            <p className="text-sm text-destructive/90">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Tip: Check your API configuration and network connection, then try again.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border animate-fade-in">
      <div className="space-y-4">
        {/* Header with timestamp and actions */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-accent" />
            <div>
              <h3 className="font-semibold text-accent">Blog Generated Successfully</h3>
              {timestamp && (
                <p className="text-xs text-muted-foreground">
                  {timestamp.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="text-xs border-border hover:bg-secondary"
              aria-label="Copy blog content"
            >
              {copied ? (
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              ) : (
                <Copy className="h-3.5 w-3.5 mr-1.5" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="text-xs border-border hover:bg-secondary"
              aria-label="Download blog as text file"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download
            </Button>
          </div>
        </div>

        {/* Content display */}
        <div className="relative">
          <div
            className="p-4 bg-secondary/50 rounded-lg border border-border max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
            role="article"
            aria-label="Generated blog content"
          >
            <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
              {content}
            </pre>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultPanel;
