# sanitized_bedrock_blog_generator.py
"""
Sanitized Bedrock blog generator.
- No personal/account-specific values are hard-coded.
- Configure via environment variables or IAM role.
- Before publishing: set MODEL_ID, FALLBACK_MODEL_ID, BLOG_S3_BUCKET in environment,
  or rely on the defaults below which are placeholders.
"""

import os
import json
import boto3
import botocore.config
from datetime import datetime
from botocore.exceptions import ClientError


def _extract_text_from_response(decoded: str) -> str:
    """Extract generated text from common Bedrock response shapes."""
    try:
        data = json.loads(decoded)
    except Exception:
        return decoded

    if isinstance(data, str):
        return data.strip()

    if isinstance(data, dict):
        if "generation" in data:
            gen = data["generation"]
            if isinstance(gen, str):
                return gen.strip()
            if isinstance(gen, dict):
                for k in ("text", "content", "generated_text"):
                    if k in gen:
                        return str(gen[k]).strip()
            if isinstance(gen, list) and gen:
                first = gen[0]
                if isinstance(first, dict) and "text" in first:
                    return str(first["text"]).strip()
            return str(gen).strip()

        if "outputs" in data and isinstance(data["outputs"], list) and data["outputs"]:
            out = data["outputs"][0]
            if isinstance(out, dict):
                if "text" in out:
                    return str(out["text"]).strip()
                if "content" in out:
                    c = out["content"]
                    if isinstance(c, str):
                        return c.strip()
                    if isinstance(c, list) and c and isinstance(c[0], dict) and "text" in c[0]:
                        return str(c[0]["text"]).strip()

        if "choices" in data and isinstance(data["choices"], list) and data["choices"]:
            choice = data["choices"][0]
            return str(choice.get("text", "")).strip()

        for k in ("result", "response", "completion", "output"):
            if k in data:
                val = data[k]
                if isinstance(val, str):
                    return val.strip()
                if isinstance(val, dict) and "text" in val:
                    return str(val["text"]).strip()

    # fallback: pretty JSON or raw decoded
    try:
        return json.dumps(data)
    except Exception:
        return decoded


def blog_generate_using_bedrock(blogtopic: str) -> str:
    """
    Generate a ~200-word blog.
    Uses environment variable MODEL_ID (defaults to a placeholder).
    Falls back to FALLBACK_MODEL_ID if the primary model fails.
    """
    primary_model = os.environ.get(
        "MODEL_ID", "meta.llama4-maverick-17b-instruct-v1:0"
    )
    fallback_model = os.environ.get(
        "FALLBACK_MODEL_ID", "amazon.titan-text-express-v1"
    )

    prompt = f"<s>[INST]Human: Write a 200-word blog on the topic: {blogtopic}\nAssistant:[/INST]"

    # payload for models that accept the "meta" style
    body_meta = {
        "prompt": prompt,
        "max_gen_len": 512,
        "temperature": 0.5,
        "top_p": 0.9,
    }

    # payload for Titan-style models
    body_titan = {
        "input": prompt,
        "max_tokens_to_sample": 512,
        "temperature": 0.5,
    }

    # Use region from env or default placeholder. Lambda typically doesn't need region set
    aws_region = os.environ.get("AWS_REGION", "us-east-1")

    client = boto3.client(
        "bedrock-runtime",
        region_name=aws_region,
        config=botocore.config.Config(read_timeout=300, retries={"max_attempts": 3}),
    )

    for model_id, body in ((primary_model, body_meta), (fallback_model, body_titan)):
        try:
            print(f"Invoking model: {model_id}")
            response = client.invoke_model(
                modelId=model_id,
                contentType="application/json",
                accept="application/json",
                body=json.dumps(body),
            )

            raw_bytes = response.get("body")
            if raw_bytes is None:
                print("No response body; trying next model.")
                continue

            decoded = raw_bytes.read().decode("utf-8", errors="ignore")
            blog_text = _extract_text_from_response(decoded)

            if blog_text and blog_text.strip():
                print("✅ Blog generated successfully")
                return blog_text.strip()
            else:
                print("Received empty blog text; trying next model.")
                continue

        except ClientError as e:
            code = e.response.get("Error", {}).get("Code", "")
            msg = e.response.get("Error", {}).get("Message", str(e))
            print(f"❌ Bedrock invoke failed for {model_id}: {code} — {msg}")
            # try next model in loop
            continue
        except Exception as e:
            print(f"❌ Unexpected error invoking model {model_id}: {e}")
            continue

    print("⚠️ All models failed.")
    return ""


def save_blog_details_s3(s3_key: str, s3_bucket: str, generated_blog: str):
    """
    Save blog text to S3.
    - s3_bucket: must be provided (no hard-coded bucket names).
    """
    s3_bucket = (s3_bucket or "").strip()
    if not s3_bucket:
        raise ValueError("S3 bucket name is empty. Set BLOG_S3_BUCKET env var or pass one.")

    s3 = boto3.client("s3", region_name=os.environ.get("AWS_REGION", "us-east-1"))
    try:
        s3.put_object(Bucket=s3_bucket, Key=s3_key, Body=generated_blog.encode("utf-8"))
        print(f"✅ Blog saved to s3://{s3_bucket}/{s3_key}")
    except ClientError as e:
        print(f"❌ Error saving to S3: {e}")
        raise


def lambda_handler(event, context):
    """
    Lambda entrypoint (compatible with AWS Lambda).
    Expects event['body'] to be JSON with optional key 'blog_topic'.
    Environment variables:
      - BLOG_S3_BUCKET : destination bucket name (required)
      - MODEL_ID       : optional Bedrock model id (primary)
      - FALLBACK_MODEL_ID : optional fallback model id
      - AWS_REGION     : optional (defaults to us-east-1)
    """
    try:
        body = event.get("body", "{}")
        if isinstance(body, str):
            body = json.loads(body)
    except Exception:
        body = {}

    blog_topic = body.get("blog_topic", "AI in Modern DevOps")
    print(f"🧠 Generating blog on: {blog_topic}")

    blog_text = blog_generate_using_bedrock(blog_topic)

    if blog_text:
        current_time = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
        s3_key = f"blog-output/{current_time}.txt"
        s3_bucket = os.environ.get("BLOG_S3_BUCKET", "")  # must be set in environment
        save_blog_details_s3(s3_key, s3_bucket, blog_text)
    else:
        print("⚠️ No blog was generated")

    return {"statusCode": 200, "body": json.dumps("Blog Generation is completed")}


if __name__ == "__main__":
    # Local test (ensure environment variables are set locally if needed)
    sample = "How DevOps is Revolutionizing Cloud Scalability"
    out = blog_generate_using_bedrock(sample)
    print("\n=== GENERATED ===\n", out)
