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


**Step 2: Create a Lambda** 
<img width="3224" height="1929" alt="image" src="https://github.com/user-attachments/assets/129635eb-8ac5-4327-9db8-6053f0e94d79" />
<img width="3191" height="1925" alt="image" src="https://github.com/user-attachments/assets/c1b2f835-7192-4ef3-9c01-91333a338cd1" />
<img width="3300" height="1960" alt="image" src="https://github.com/user-attachments/assets/bd1cb5f3-fa5b-4986-8344-761174eee387" />

---

*Lambda code is Avalible on*

---

**Step 3: Add Layer in Lambda but before adding layer in lambda we required latest boto3 file follow the steps**

```bash
python3 --version
pip --version

mkdir lambda_bedrock_blog
cd lambda_bedrock_blog

mkdir python
pip install boto3 botocore -t python/

This creates:
lambda_bedrock_blog/
├── python/
│   ├── boto3/
│   ├── botocore/
│   ├── ... (other libs)
└── lambda_function.py


zip -r9 ../lambda_bedrock_blog.zip .  zip your this file 
```
**Step 4: Now add Layer Lambda** 

<img width="3308" height="1977" alt="image" src="https://github.com/user-attachments/assets/f9271970-9d2d-4394-9ea6-1e884b49660d" />

<img width="3218" height="1870" alt="image" src="https://github.com/user-attachments/assets/32a57275-62fc-4068-9d4c-f34eb107f178" />

<img width="3185" height="1926" alt="image" src="https://github.com/user-attachments/assets/eb1eb85c-273e-4667-ba06-12f96eb5dedb" />

<img width="1680" height="1050" alt="Screenshot 2025-10-18 at 10 26 18 PM" src="https://github.com/user-attachments/assets/c1fd2fac-26f4-4503-b340-5b5ba42b7088" />

<img width="3164" height="1949" alt="image" src="https://github.com/user-attachments/assets/047c0723-545a-4870-9ac9-d8521b5abfd4" />

*Set the Time Out on 3 min*
<img width="3177" height="1930" alt="image" src="https://github.com/user-attachments/assets/d527af62-6dfa-4057-a5e8-031e62abf6ca" />

*Now Set the Env Variable*

<img width="3280" height="1979" alt="image" src="https://github.com/user-attachments/assets/62b077b7-d595-4db9-9ffe-1e02a463a536" />

```bash
MODEL_ID = meta.llama3-8b-instruct-v1:0  (or whatever exists in your region)
FALLBACK_MODEL_ID = amazon.titan-text-express-v1
BLOG_S3_BUCKET = your bucket
```

**Step 5: Create a API Getway** 
<img width="3210" height="2001" alt="image" src="https://github.com/user-attachments/assets/8ff4f617-da19-4571-81c3-b68926941565" />
<img width="3185" height="1718" alt="image" src="https://github.com/user-attachments/assets/782add4d-92ef-420e-ac33-7cef8cabe440" />
<img width="3230" height="1674" alt="image" src="https://github.com/user-attachments/assets/d69404a9-9f9c-4419-a7fd-46b55656403b" />

**Step 6: Create a Route for lambda to API Getway** 

<img width="3168" height="1730" alt="image" src="https://github.com/user-attachments/assets/32842d0f-1900-4db7-a906-b917ed169b47" />
<img width="3259" height="1947" alt="Screenshot 2025-10-18 at 10 32 16 PM" src="https://github.com/user-attachments/assets/c8275684-867e-4d60-8f0e-70a3c7119f88" />

**Step 7: *In Routes Check the Route Details in Select Integration and Attach Integration And Select Lambda* 
<img width="1902" height="989" alt="Screenshot 2025-10-18 at 7 21 29 PM (2)" src="https://github.com/user-attachments/assets/ff8e0749-79ae-4827-a497-23c08511acf6" />

**Step 8: Create a Stage for API Getway and Deploy** 
<img width="3287" height="1932" alt="image" src="https://github.com/user-attachments/assets/2eb0abec-44b3-410e-b594-06e016a61892" />
<img width="3191" height="1937" alt="image" src="https://github.com/user-attachments/assets/0525b677-7166-490b-80a5-7990a8a7719e" />
<img width="3321" height="1959" alt="Screenshot 2025-10-18 at 10 32 59 PM" src="https://github.com/user-attachments/assets/e68745c0-a3de-4c0d-bca9-e4cabb461f35" />
<img width="3319" height="1917" alt="Screenshot 2025-10-18 at 10 33 17 PM" src="https://github.com/user-attachments/assets/7bf3a6ba-6254-4e45-9ec9-40912e173f12" />
<img width="3272" height="1971" alt="Screenshot 2025-10-18 at 10 33 51 PM" src="https://github.com/user-attachments/assets/a7d8a9dc-1d16-46e5-9cd1-178c8b341263" />
<img width="1658" height="972" alt="Screenshot 2025-10-18 at 10 34 07 PM" src="https://github.com/user-attachments/assets/a35b4d30-8505-4fd8-91fb-dbe3214211bf" />
<img width="3269" height="1917" alt="Screenshot 2025-10-18 at 10 34 27 PM" src="https://github.com/user-attachments/assets/ea648153-5982-4905-b9ce-11135b4ebc25" />
<img width="1638" height="965" alt="Screenshot 2025-10-18 at 10 41 02 PM" src="https://github.com/user-attachments/assets/594aa98a-cdba-4961-9527-ec39ad7a1207" />
<img width="3295" height="1873" alt="Screenshot 2025-10-18 at 10 44 46 PM" src="https://github.com/user-attachments/assets/721dbaa4-e1ec-4f94-ba26-3c734a0edbbe" />

<img width="3277" height="1935" alt="Screenshot 2025-10-18 at 10 44 34 PM" src="https://github.com/user-attachments/assets/9522f7d4-b5ce-42cc-8af4-3eeb5a80acc9" />



