/**
 * API Configuration and Methods
 * 
 * IMPORTANT: Replace the API_URL below with your actual AWS API Gateway URL
 * before deploying to production.
 */

const API_URL = "<PUT_YOUR_API_URL_HERE>";

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

  // Check if API URL has been configured
  if (API_URL === "<PUT_YOUR_API_URL_HERE>") {
    throw new Error("API URL not configured. Please update API_URL in src/utils/api.ts");
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

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Handle non-200 HTTP responses
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("CORS error - please enable CORS on API Gateway");
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
    // Network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error - check your connection");
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
