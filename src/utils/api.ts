const API_URL =
  "https://g5cshzpy7k.execute-api.us-east-1.amazonaws.com/dev/blog-gen";

export interface BlogGenerationRequest {
  blog_topic: string;
}

export interface BlogGenerationResponse {
  message: string;
  content: string;
}

export async function generateBlog(topic: string): Promise<BlogGenerationResponse> {
  if (!topic || topic.trim().length === 0) {
    throw new Error("Blog topic cannot be empty");
  }

  const payload = { blog_topic: topic.trim() };
  console.log("Sending request to:", API_URL);
  console.log("Payload:", JSON.stringify(payload, null, 2));

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    mode: "cors",
  });

  console.log("Response status:", response.status, response.statusText);
  const raw = await response.text();
  console.log("Raw response body:", raw);

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${raw || response.statusText}`);
  }

  const data = raw ? JSON.parse(raw) : null;
  if (!data) throw new Error("Empty JSON from API");

  // Backend returns { content, message, ... }
  const content = data.content ?? data.blog ?? "";
  const message = data.message ?? "Blog generated successfully";

  if (!content) throw new Error("No content returned from API");

  return { message, content };
}
