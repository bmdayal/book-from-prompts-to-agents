"""Tiny eval for the 'shorten-an-email' library prompt.
For each case in cases.json it checks every saved reply (v1.0 = "reply", v1.1 = "reply_v1_1"):
  1. at least 25% shorter than the original email
  2. every must_keep fact is still there
  3. no number appears that was not in the original
A trailing "Softening removed:" line (added in v1.1) is not counted as part of the email.
To test a new model or prompt version, add its outputs to cases.json and run again."""
import json, re
def body(t): return re.split(r"\n\s*Softening removed:", t)[0]
def words(t): return len(t.split())
def nums(t): return set(re.findall(r"\d+(?:[,.]\d+)*", t))
ok_all = True
for key, label in (("reply", "v1.0"), ("reply_v1_1", "v1.1")):
    print(f"--- prompt {label}")
    for c in json.load(open("cases.json")):
        if key not in c: continue
        text = body(c[key])
        a, b = words(c["email"]), words(text)
        shorter = (a - b) / a
        missing = [f for f in c["must_keep"] if f.lower() not in text.lower()]
        new_nums = sorted(nums(text) - nums(c["email"]))
        passed = shorter >= 0.25 and not missing and not new_nums
        ok_all &= passed
        print(f"{c['id']:<14} {a:>3} -> {b:>3} words ({shorter:3.0%})  missing: {missing or 'none'}  new numbers: {new_nums or 'none'}  {'PASS' if passed else 'FAIL'}")
print("ALL PASS" if ok_all else "SOME FAILED")
