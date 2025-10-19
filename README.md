# 🧠 AWS Gen AI Project — Blog Generator (Lambda + Bedrock + React + S3)

---

<img width="1408" height="673" alt="SCR-20251019-kusx" src="https://github.com/user-attachments/assets/67ece210-67d6-434b-88be-d8854efbec28" />

---
## 🧰 Tools & Setup
| Tool                             | Purpose                                      | Notes                                                                               |
| -------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------- |
| 🧑‍💻 **AWS Account**            | To create all resources                      | [Sign up here](https://aws.amazon.com/free/) if you don’t have one                  |
| ☁️ **IAM Role with Permissions** | To allow Lambda to use Bedrock & S3          | Attach: `AmazonS3FullAccess`, `AmazonBedrockFullAccess`, `CloudWatchLogsFullAccess` or Admin Access |
| 💽 **S3 Bucket**                 | To store generated blog outputs              | Example: `aws-bucket-name`                                              |
| 🔥 **AWS Lambda**                | Runs Python code calling Bedrock             | Runtime: `Python 3.13`                                                              |
| 🌐 **API Gateway**               | Connects frontend to Lambda                  | Must have CORS enabled if you want to test API with react app or if you are using postman don't do this                                                              |
| 🧠 **AWS Bedrock**               | Provides foundation models (Llama 3 / Titan) | Region: **N. Virginia us-east-1**                                                                |
| ⚛️ **React App**                 | Frontend for user interaction                | Built using `Vite`                                                                  |
| 🐳 **Docker** *(optional)*       | To deploy the React app on EC2               | Install from [Docker Docs](https://docs.docker.com/)                                |
| 🧩 **Node.js (v18+)**            | Build & run frontend                         | Check with `node -v`                                                                |

---

**Step 1: Create a S3 Bucket** 
<img width="3279" height="1946" alt="image" src="https://github.com/user-attachments/assets/05dd61d4-ca1e-4547-9a74-f0b0ee1e983d" />
<img width="3305" height="1974" alt="image" src="https://github.com/user-attachments/assets/e498626d-c543-46a3-9caf-07e9087e48c0" />
<img width="3323" height="1258" alt="image" src="https://github.com/user-attachments/assets/332fafbb-9acb-4366-b41d-0c2f9376ab41" />


**Step 1: Create a Lambda** 
<img width="3224" height="1929" alt="image" src="https://github.com/user-attachments/assets/129635eb-8ac5-4327-9db8-6053f0e94d79" />
<img width="3191" height="1925" alt="image" src="https://github.com/user-attachments/assets/c1b2f835-7192-4ef3-9c01-91333a338cd1" />
<img width="3300" height="1960" alt="image" src="https://github.com/user-attachments/assets/bd1cb5f3-fa5b-4986-8344-761174eee387" />

