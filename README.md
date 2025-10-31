# 🧠 Bedrock Blog Studio

A production-ready React application for generating AI-powered blog content using AWS Bedrock. Features a beautiful dark UI with Tailwind CSS and seamless integration with your AWS Lambda + Bedrock pipeline.

![Bedrock Blog Studio](https://img.shields.io/badge/AWS-Bedrock-orange) ![React](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.0-cyan)

---
## Want to Know about AWS BedRock Visit This > [Click ](https://github.com/SaimShaikh/Cloud_Computing/tree/main/AWS/AWS_BedRock)
## ✨ Features

- **🎨 Modern Dark UI**: Beautiful gradient background with glass-morphic card design
- **⚡ Real-time Generation**: Instant blog creation with loading states and animations
- **📋 Copy & Download**: One-click copy to clipboard and download as .txt file
- **🔒 Type-Safe**: Built with TypeScript for reliability and better developer experience
- **📱 Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **♿ Accessible**: WCAG-compliant with proper ARIA labels and keyboard navigation
- **🚨 Error Handling**: Comprehensive error messages with helpful troubleshooting tips
- **⏱️ Timestamps**: Track when each blog was generated

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── TopicForm.tsx        # Input form with validation
│   ├── ResultPanel.tsx      # Display area for generated blogs
│   └── ui/                  # shadcn UI components
├── utils/
│   └── api.ts               # API configuration and methods
├── pages/
│   └── Index.tsx            # Main application page
├── index.css                # Tailwind + design system
└── main.tsx                 # Application entry point
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm installed ([install with nvm](https://github.com/nvm-sh/nvm))
- AWS API Gateway URL (from your Lambda + Bedrock backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd bedrock-blog-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your API URL** ⚠️ **IMPORTANT**
   
   Open `src/utils/api.ts` and replace the placeholder with your AWS API Gateway URL:
   
   ```typescript
   const API_URL = "<PUT_YOUR_API_URL_HERE>";
   ```
   
   Replace with your actual URL:
   
   ```typescript
   const API_URL = "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/generate-blog";
   ```
   <img width="1680" height="1050" alt="Screenshot 2025-10-19 at 5 39 18 PM" src="https://github.com/user-attachments/assets/2866fe2e-c887-4e80-b47d-c9d749148b3b" />

4. **Now Go To AWS API Getway We Need To Enable CORS and Then Re deploy**
   <img width="3269" height="1873" alt="Screenshot 2025-10-19 at 4 18 35 PM" src="https://github.com/user-attachments/assets/b31db7c1-e5c8-4899-85bc-d765058db74a" />

## ✅ Breakdown of what each header does:
   | Header                 | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| `Content-Type`         | Allows clients to send JSON, form data, etc. |
| `Authorization`        | Needed for Bearer tokens or IAM auth         |
| `X-Amz-Date`           | Required by AWS SDK/API signed requests      |
| `X-Api-Key`            | For API Gateway key-based auth               |
| `X-Amz-Security-Token` | For temporary STS session credentials        |
| `X-Amzn-Trace-Id`      | For AWS X-Ray tracing                        |


5. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:8080`

  <img width="3308" height="1996" alt="image" src="https://github.com/user-attachments/assets/9bb87c3e-0d0b-42fd-bf0a-b90cbacda6f5" />


### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

---

## 🔌 Backend Integration

### Expected API Response Format

Your AWS Lambda function should return the following JSON structure:

```json
{
  "statusCode": 200,
  "body": "{\"message\":\"Blog generated successfully\",\"content\":\"<generated blog text here>\"}"
}
```

### Request Format

The app sends a POST request with double-encoded JSON:

```json
{
  "body": "{\"blog_topic\": \"The Future of AI in DevOps\"}"
}

for Postman use this
{
  "blog_topic": ""
}
```

**Why double-encoding?** AWS Lambda expects the body as a string, and your backend parses it to extract the topic.

### API Configuration

All API logic is centralized in `src/utils/api.ts`:

- **Single source of truth** for the API URL
- **Type-safe** interfaces for requests/responses
- **Comprehensive error handling** for all failure scenarios
- **Input validation** before making requests

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **React 18.3** | UI framework with hooks |
| **TypeScript 5.0** | Type safety and better DX |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | High-quality UI components |
| **Lucide React** | Beautiful icon library |
| **React Query** | State management (installed) |

---

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:

1. **Enable CORS on your API Gateway:**
   - Go to AWS Console → API Gateway
   - Select your API → Actions → Enable CORS
   - Allow origin `*` for testing (or restrict to your domain in production)
   - Deploy your API after making changes

2. **Add CORS headers to your Lambda response:**
   ```python
   return {
       'statusCode': 200,
       'headers': {
           'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Headers': 'Content-Type',
           'Access-Control-Allow-Methods': 'POST, OPTIONS'
       },
       'body': json.dumps({
           'message': 'Blog generated successfully',
           'content': blog_text
       })
   }
   ```

### "API URL not configured" Error

Make sure you've replaced `<PUT_YOUR_API_URL_HERE>` in `src/utils/api.ts` with your actual API Gateway URL.

### Network Errors

- Check your internet connection
- Verify the API URL is correct and accessible
- Check AWS Lambda logs in CloudWatch for backend errors
- Ensure your API Gateway is deployed to a stage (e.g., `prod`)

---

## 🎨 Design System

The app uses a centralized design system defined in `src/index.css`:

- **Colors**: HSL-based for easy theming
- **Gradients**: Dark space gradient, glass-morphic cards
- **Shadows**: Glow effects for interactive elements
- **Animations**: Fade-in, pulse-glow, loading spinners

All styles use semantic tokens - no hardcoded colors in components!


---

## 🔐 Security Best Practices

- ✅ **No API keys in frontend** - Your AWS credentials stay in Lambda
- ✅ **Input validation** - Client-side and server-side validation
- ✅ **Rate limiting** - Implement on API Gateway to prevent abuse
- ✅ **HTTPS only** - Always use HTTPS in production
- ✅ **CORS configuration** - Restrict origins in production

---


### Code Style
- Functional components with TypeScript
- React hooks for state management
- Tailwind utility classes for styling
- Semantic HTML for accessibility



---


## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 💬 Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Review AWS CloudWatch logs for backend errors
3. Open an issue in this repository

---

**Built by Bedrock Blog Studio Team | Powered by AWS Bedrock** 🚀
