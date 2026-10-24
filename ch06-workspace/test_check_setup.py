"""Builds four throwaway repos and confirms check_setup.py reports what it should."""
import os, subprocess, tempfile, shutil
from pathlib import Path
HERE = Path(__file__).parent
FAKE = "sk-ant-" + "x" * 30          # obviously fake, built so scanners ignore this file
def run(setup):
    d = Path(tempfile.mkdtemp())
    subprocess.run(["git", "init", "-q"], cwd=d)
    shutil.copy(HERE / ".env.example", d / ".env.example")
    setup(d)
    env = {k: v for k, v in os.environ.items() if "API_KEY" not in k}
    r = subprocess.run(["python3", HERE / "check_setup.py"], cwd=d, capture_output=True, text=True, env=env)
    return r.returncode, r.stdout
def good(d):
    (d / ".gitignore").write_text(".env\n"); (d / ".env").write_text(f"ANTHROPIC_API_KEY={FAKE}\n")
def not_ignored(d):
    (d / ".env").write_text(f"ANTHROPIC_API_KEY={FAKE}\n")
def leaked(d):
    good(d); (d / "app.py").write_text(f'key = "{FAKE}"\n'); subprocess.run(["git", "add", "app.py"], cwd=d)
def placeholder(d):
    (d / ".gitignore").write_text(".env\n"); (d / ".env").write_text("ANTHROPIC_API_KEY=sk-ant-...\n")
cases = [("good", good, 0, []), ("env not ignored", not_ignored, 1, [".env is ignored"]),
         ("key committed in app.py", leaked, 1, ["no key-shaped text"]), ("placeholder key", placeholder, 1, ["a key is set"])]
ok = True
for name, fn, code, fails in cases:
    rc, out = run(fn)
    failed = [l for l in out.splitlines() if l.startswith("FAIL")]
    good_ = rc == code and len(failed) == len(fails) and all(any(f in l for l in failed) for f in fails)
    leak_printed = FAKE in out
    ok &= good_ and not leak_printed
    print(f"{name:26} exit={rc} fails={len(failed)} {'OK' if good_ else 'WRONG'}{'  KEY PRINTED!' if leak_printed else ''}")
print("ALL TESTS PASS" if ok else "TESTS FAILED")
