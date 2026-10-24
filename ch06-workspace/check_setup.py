"""Five-minute setup check for a project that calls an AI API.
Run from the project folder:  python3 check_setup.py
It never prints a key. Standard library only."""
import os, re, subprocess, sys
from pathlib import Path

KEY_NAMES = ["ANTHROPIC_API_KEY", "OPENAI_API_KEY"]
KEY_SHAPE = re.compile(r"sk-(?:ant-)?[A-Za-z0-9_-]{20,}")
results = []

def check(ok, label, fix=""):
    results.append(ok)
    print(("PASS  " if ok else "FAIL  ") + label + ("" if ok else "\n      fix: " + fix))

def git(*args):
    return subprocess.run(["git", *args], capture_output=True, text=True)

if git("rev-parse", "--is-inside-work-tree").returncode != 0:
    sys.exit("This folder isn't a git repository yet. Run 'git init' first.")

env = Path(".env")
check(env.exists(), ".env file exists", "create .env and put your key in it")
check(git("check-ignore", "-q", ".env").returncode == 0, ".env is ignored by git",
      "add a line containing .env to .gitignore")
check(Path(".env.example").exists(), ".env.example exists (names only, no real values)",
      "copy .env to .env.example and blank out the values")

# a key must come from the environment or from .env, and must not be a placeholder
def has_key():
    for name in KEY_NAMES:
        if os.environ.get(name): return True
    if env.exists():
        for line in env.read_text().splitlines():
            n, _, v = line.partition("=")
            if n.strip() in KEY_NAMES and v.strip().strip('"\'') not in ("", "sk-ant-...", "sk-..."):
                return True
    return False
check(has_key(), "a key is set (environment or .env)", "put ANTHROPIC_API_KEY=... in .env")

# look for key-shaped text in every tracked file
leaks = []
for f in git("ls-files").stdout.splitlines():
    try:
        if KEY_SHAPE.search(Path(f).read_text(errors="ignore")): leaks.append(f)
    except OSError:
        pass
check(not leaks, "no key-shaped text in tracked files",
      "remove it from: " + ", ".join(leaks) + " and rotate that key, because it may already be copied")

print("\n" + ("All good." if all(results) else f"{results.count(False)} problem(s) to fix."))
sys.exit(0 if all(results) else 1)
