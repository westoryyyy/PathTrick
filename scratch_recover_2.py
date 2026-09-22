import json

log_path = "/Users/paulinasmacbook/.gemini/antigravity-ide/brain/0eab532b-e941-411d-ad38-9554adcc3d91/.system_generated/logs/transcript_full.jsonl"
with open(log_path, 'r') as f:
    lines = f.readlines()

for line in reversed(lines):
    try:
        data = json.loads(line)
        if data.get("type") == "TOOL_RESPONSE":
            content = data.get("content", "")
            if "sc_deployed_address" in content and "tech_stack" in content and "ai_riasec" in content:
                print("Found match!")
                with open("/tmp/docs_recovered.txt", "a") as out:
                    out.write(content + "\n====================\n")
    except:
        pass
