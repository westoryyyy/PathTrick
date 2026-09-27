import json

log_path = "/Users/paulinasmacbook/.gemini/antigravity-ide/brain/0eab532b-e941-411d-ad38-9554adcc3d91/.system_generated/logs/transcript_full.jsonl"
with open(log_path, 'r') as f:
    lines = f.readlines()

for line in reversed(lines):
    try:
        data = json.loads(line)
        if data.get("type") == "TOOL_RESPONSE":
            content = data.get("content", "")
            if "The following code has been modified to include a line number" in content and "src/app/docs/page.tsx" in content:
                print("Found view_file output!")
                with open("/tmp/docs_recovered_view.txt", "w") as out:
                    out.write(content)
                break
    except:
        pass
