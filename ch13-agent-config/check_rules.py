"""Checks a reply's code for the three rules. Usage: python3 check_rules.py reply.txt"""
import re, sys
t = open(sys.argv[1]).read()
code = "\n".join(re.findall(r"```(?:\w+)?\n(.*?)```", t, flags=re.S)) or t
mods = set(re.findall(r"from\s+['\"]([^'\"]+)['\"]", code)) | set(re.findall(r"require\(['\"]([^'\"]+)['\"]\)", code))
ok_mods = {"express"}
new_pkgs = sorted(m for m in mods if m not in ok_mods and not m.startswith("node:") and not m.startswith("."))
errs = re.findall(r"json\(\s*\{\s*(\w+)\s*:", code)
bad_err = sorted(set(e for e in errs if e not in ("error", "ok", "users", "user", "id", "email", "name")))
logs_body = bool(re.search(r"console\.\w+\([^)]*req\.body", code))
print(f"new packages: {new_pkgs or 'none'} | json keys other than error/ok/data: {bad_err or 'none'} | logs req.body: {logs_body}")
