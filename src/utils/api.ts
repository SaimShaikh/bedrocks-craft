/**
 * API Configuration and Methods
 * 
 * IMPORTANT: Replace the API_URL below with your actual AWS API Gateway URL
 * before deploying to production.
 */

const API_URL = "https://bo3sjs1954.execute-api.us-east-1.amazonaws.com/dev/blog-gen";

export interface BlogGenerationRequest {
  blog_topic: string;
}

export interface BlogGenerationResponse {
  message: string;
  content: string;
}

/**
 * Generates a blog using AWS Bedrock API
 * 
 * @param topic - The blog topic to generate content for
 * @returns Promise containing the generated blog content
 * @throws Error if the API request fails
 */
export async function generateBlog(topic: string): Promise<BlogGenerationResponse> {
  // Validate input
  if (!topic || topic.trim().length === 0) {
    throw new Error("Blog topic cannot be empty");
  }

  try {
    // Note: The body is double-encoded as per AWS Lambda requirements
    // First encoding: blog_topic object
    // Second encoding: wrapping it in body string
    const payload = {
      body: JSON.stringify({
        blog_topic: topic.trim()
      })
    };

    console.log("Sending request to:", API_URL);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    // Handle non-200 HTTP responses
    if (!response.ok) {
      const responseText = await response.text();
      console.error("Error response:", responseText);
      
      if (response.status === 403 || response.status === 0) {
        throw new Error("CORS error - Your API Gateway needs CORS enabled. Check the README for instructions.");
      }
      if (response.status >= 500) {
        throw new Error("Server error - please try again later");
      }
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse the response
    const result = await response.json();
    
    // Parse the nested body string (Lambda response format)
    if (!result.body) {
      throw new Error("Invalid response format - missing body");
    }

    const parsedBody = JSON.parse(result.body);
    
    // Extract content or message
    const content = parsedBody.content || parsedBody.message || "";
    
    if (!content) {
      throw new Error("No content received from API");
    }

    return {
      message: parsedBody.message || "Blog generated successfully",
      content: content,
    };
  } catch (error) {
    console.error("API Error:", error);
    
    // Network errors (CORS, network offline, etc)
    if (error instanceof TypeError) {
      console.error("Network/CORS error details:", error.message);
      throw new Error("CORS error - Your AWS API Gateway needs CORS configured. See README for setup instructions.");
    }
    
    // JSON parsing errors
    if (error instanceof SyntaxError) {
      throw new Error("Unexpected response format - contact admin");
    }
    
    // Re-throw our custom errors
    if (error instanceof Error) {
      throw error;
    }
    
    // Unknown errors
    throw new Error("An unexpected error occurred");
  }
}
