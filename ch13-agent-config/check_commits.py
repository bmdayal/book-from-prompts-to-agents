"""Scores commit messages. Usage: python3 check_commits.py reply.txt
Expects three messages in order. Checks per message: subject <60 chars, no file name in subject, body lines <=72, imperative first word (heuristic: not ending in 'ed'/'ing'/'s').
Message 2 (mixed changes) should also mention splitting."""
import re, sys
t = open(sys.argv[1]).read()
parts = re.split(r"(?im)^\s*(?:#+\s*)?(?:\*\*)?(?:staged\s+change|commit(?:\s+message)?|message)\s*#?\s*\d+[^\n]*\n", t)
parts = [p for p in parts if p.strip()]
if len(parts) != 3: print("PARSE: expected 3 messages, got", len(parts)); parts = (parts + [""]*3)[:3]
for i, p in enumerate(parts, 1):
    lines = [l for l in p.strip().split("\n") if l.strip() and not l.strip().startswith(("```","---"))]
    subj = lines[0].strip().strip("`*").removeprefix("Subject:").strip() if lines else ""
    first = re.sub(r"[^A-Za-z]", "", subj.split(" ")[0]).lower() if subj else ""
    imper = not (first.endswith("ed") or first.endswith("ing") or (first.endswith("s") and first not in ("pass","process","address","focus")))
    has_file = bool(re.search(r"\b[\w/.-]+\.(js|jsx|md|json|py|ts)\b", subj))
    body = lines[1:]
    wide = [l for l in body if len(l) > 72 and not re.match(r"\s*[-*]", l) is None or len(l) > 72]
    split_mention = bool(re.search(r"split|separate commits|unrelated|two commits|separately", p, flags=re.I))
    print(f"msg{i}: subject {len(subj):>3} chars {'OK' if len(subj)<60 else 'LONG'} | file name in subject: {has_file} | imperative: {imper} | body lines >72: {len(wide)} | mentions splitting: {split_mention}")
