/**
 * API Configuration and Methods
 *
 * IMPORTANT:
 * Replace the API_URL below with your AWS API Gateway endpoint
 * (it already points to your Lambda).
 */

const API_URL = "Add your api here ";  /* ADD URL here .*/

export interface BlogGenerationRequest {
  blog_topic: string;
}

export interface BlogGenerationResponse {
  message: string;
  content: string;
}

/**
 * Generate a blog using AWS Bedrock Lambda via API Gateway.
 *
 * @param topic - The blog topic to generate
 * @returns Promise<BlogGenerationResponse>
 */
export async function generateBlog(topic: string): Promise<BlogGenerationResponse> {
  if (!topic || topic.trim().length === 0) {
    throw new Error("Blog topic cannot be empty");
  }

  try {
    // Payload directly matches Lambda's expected format
    const payload = {
      blog_topic: topic.trim(),
    };

    console.log("Sending request to:", API_URL);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Single encoding only — Lambda now reads body as plain JSON
      body: JSON.stringify(payload),
    });

    console.log("Response status:", response.status);

    // Handle non-success status
    if (!response.ok) {
      const text = await response.text();
      console.error("Error response:", text);

      if (response.status === 403 || response.status === 0) {
        throw new Error(
          "CORS error — Your API Gateway needs CORS enabled. Check AWS setup."
        );
      }
      if (response.status >= 500) {
        throw new Error("Server error — please try again later.");
      }
      throw new Error(`API failed with status ${response.status}`);
    }

    const result = await response.json();

    // Lambda proxy integration returns your JSON directly
    const content = result?.content || "";
    const message = result?.message || "Blog generated successfully";

    if (!content) {
      throw new Error("No content returned from API");
    }

    return {
      message,
      content,
    };
  } catch (error: any) {
    console.error("API Error:", error);

    if (error instanceof TypeError) {
      throw new Error(
        "Network or CORS error — check your API Gateway CORS configuration."
      );
    }
    if (error instanceof SyntaxError) {
      throw new Error("Unexpected response format — check Lambda response JSON.");
    }

    throw new Error(error.message || "Unknown error occurred.");
  }
}
