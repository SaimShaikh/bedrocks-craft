"""
✅ AWS Bedrock Blog Generator (Universal Version)
- Runs locally, on EC2, or as AWS Lambda
- Generates 200-word blogs using AWS Bedrock (Llama → Titan fallback)
- Cleans model artifacts ([INST], </s>, etc.)
- Optional: saves to S3
- Fully CORS compatible for API Gateway
"""

import os
import json
import boto3
import botocore.config
from datetime import datetime
from botocore.exceptions import ClientError


# ---------------------------------------------------------------------
# 🧠 Extract & Clean Bedrock Response
# ---------------------------------------------------------------------
def _extract_text_from_response(decoded: str) -> str:
    """Extract and clean text from Bedrock response."""
    try:
        data = json.loads(decoded)
    except Exception:
        data = decoded

    text = ""
    if isinstance(data, str):
        text = data
    elif isinstance(data, dict):
        for path in [
            ("generation",), ("generation", "text"), ("generation", "content"),
            ("generation", "generated_text"), ("outputs", 0, "text"),
            ("outputs", 0, "content"), ("choices", 0, "text"),
            ("result",), ("response",), ("completion",), ("output",)
        ]:
            try:
                val = data
                for p in path:
                    val = val[p]
                if isinstance(val, str):
                    text = val
                    break
            except Exception:
                continue
    else:
        text = str(data)

    # Clean Bedrock tokens
    text = (
        text.replace("[INST]", "")
            .replace("[/INST]", "")
            .replace("<s>", "")
            .replace("</s>", "")
            .strip()
    )

    if "[INST" in text:
        text = text.split("[INST")[0].strip()

    return text


# ---------------------------------------------------------------------
# 🚀 Blog Generator
# ---------------------------------------------------------------------
def blog_generate_using_bedrock(blogtopic: str) -> str:
    """Generate a 200-word blog using AWS Bedrock."""
    primary_model = os.environ.get("MODEL_ID", "meta.llama3-8b-instruct-v1:0")
    fallback_model = os.environ.get("FALLBACK_MODEL_ID", "amazon.titan-text-express-v1")
    region = os.environ.get("AWS_REGION", "us-east-1")

    prompt = f"Write a clear, 200-word blog post on the topic: {blogtopic}."

    body_meta = {"prompt": prompt, "max_gen_len": 512, "temperature": 0.5, "top_p": 0.9}
    body_titan = {"input": prompt, "max_tokens_to_sample": 512, "temperature": 0.5}

    client = boto3.client(
        "bedrock-runtime",
        region_name=region,
        config=botocore.config.Config(read_timeout=300, retries={"max_attempts": 3}),
    )

    attempts = [
        (primary_model, body_meta),
        (fallback_model, body_titan),
    ]

    for model_id, body in attempts:
        try:
            print(f"Invoking Bedrock model: {model_id}")
            response = client.invoke_model(
                modelId=model_id,
                contentType="application/json",
                accept="application/json",
                body=json.dumps(body),
            )

            raw_body = response.get("body")
            if not raw_body:
                print("No response body — trying fallback.")
                continue

            if hasattr(raw_body, "read"):
                decoded = raw_body.read().decode("utf-8", errors="ignore")
            else:
                decoded = str(raw_body)

            blog_text = _extract_text_from_response(decoded)
            if blog_text.strip():
                print("✅ Blog generated successfully!")
                return blog_text.strip()
        except Exception as e:
            print(f"❌ Error with model {model_id}: {e}")

    print("⚠️ All models failed or returned no text.")
    return ""


# ---------------------------------------------------------------------
# 💾 Save to S3 (optional)
# ---------------------------------------------------------------------
def save_blog_to_s3(bucket: str, content: str):
    if not bucket:
        print("⚠️ No S3 bucket specified — skipping upload.")
        return

    s3_key = f"blog-output/{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}.txt"
    s3 = boto3.client("s3", region_name=os.environ.get("AWS_REGION", "us-east-1"))
    s3.put_object(Bucket=bucket, Key=s3_key, Body=content.encode("utf-8"))
    print(f"✅ Saved to s3://{bucket}/{s3_key}")
    return s3_key


# ---------------------------------------------------------------------
# ⚙️ Lambda Entrypoint
# ---------------------------------------------------------------------
def lambda_handler(event, context):
    print("Event received:", json.dumps(event))
    try:
        body = event.get("body", "{}")
        if isinstance(body, str):
            body = json.loads(body)
    except Exception:
        body = {}

    topic = body.get("blog_topic", "AI in Modern DevOps")
    blog_text = blog_generate_using_bedrock(topic)

    resp = {
        "message": "Blog Generation completed",
        "generated": bool(blog_text),
        "content": blog_text if blog_text else None,
    }

    # Optional S3 upload
    bucket = os.environ.get("BLOG_S3_BUCKET", "")
    if blog_text and bucket:
        key = save_blog_to_s3(bucket, blog_text)
        if key:
            resp["s3_key"] = key

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
        },
        "body": json.dumps(resp),
    }


# ---------------------------------------------------------------------
# 🧪 Local or EC2 Test Mode
# ---------------------------------------------------------------------
if __name__ == "__main__":
    print("\n=== LOCAL TEST RUN ===")
    topic = input("Enter a blog topic: ").strip() or "What is DevOps?"
    print(f"🧠 Generating blog for topic: {topic}\n")

    result = blog_generate_using_bedrock(topic)
    print("\n=== GENERATED BLOG ===\n")
    print(result)

    bucket = os.environ.get("BLOG_S3_BUCKET", "")
    if bucket and result:
        save_blog_to_s3(bucket, result)
