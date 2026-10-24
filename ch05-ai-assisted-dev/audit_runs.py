"""Mutation check: break each AI-written endpoint on purpose and see if its own tests notice.
Also checks the 72-byte bcrypt limit. Copies each run to a temp folder; originals are untouched."""
import shutil, subprocess, tempfile, re, os, sys
from pathlib import Path
HERE = Path(__file__).parent
MUT = {  # name -> {run: (file, old, new)}
 "store plain password": {"run1": ("src/services/authService.js", "await bcrypt.hash(password, bcryptRounds)", "password"),
                          "run2": ("src/services/authService.js", "await bcrypt.hash(password, bcryptRounds)", "password")},
 "ignore duplicate email": {"run1": ("src/repositories/userRepository.js", "if (err.code === PG_UNIQUE_VIOLATION)", "if (false)"),
                          "run2": ("src/services/authService.js", "if (await userRepository.findByEmail(email)) throw new ConflictError();", "")},
 "skip validation": {"run1": ("src/middleware/validate.js", "const body = req.body", "return next(); const body = req.body"),
                     "run2": ("src/middleware/validate.js", "const result = schema.safeParse(req.body);", "return next(); const result = schema.safeParse(req.body);")},
 "token never expires": {"run1": ("src/services/tokenService.js", "{ subject: String(user.id), expiresIn }", "{ subject: String(user.id) }"),
                         "run2": ("src/services/tokenService.js", "{ algorithm: 'HS256', expiresIn }", "{ algorithm: 'HS256' }")},
 "do not lowercase email": {"run1": ("src/services/authService.js", ".toLowerCase()", ""),
                            "run2": ("src/validators/auth.js", ".toLowerCase()", "")},
 "weak bcrypt (1 round)": {"run1": ("src/services/authService.js", "bcryptRounds)", "1)"),
                           "run2": ("src/services/authService.js", "bcryptRounds)", "1)")},
}
def jest(d):
    r = subprocess.run(["npx", "jest", "--silent"], cwd=d, capture_output=True, text=True)
    m = re.search(r"Tests:\s+(?:(\d+) failed, )?(?:\d+ skipped, )?(\d+) passed", r.stderr + r.stdout)
    failed = int(m.group(1) or 0) if m else -1
    return failed
for run in ("run1", "run2"):
    for name, per in MUT.items():
        f, old, new = per[run]
        d = Path(tempfile.mkdtemp()) / run
        shutil.copytree(HERE / run, d, ignore=shutil.ignore_patterns("node_modules"))
        os.symlink(HERE / run / "node_modules", d / "node_modules")
        p = d / f; s = p.read_text()
        assert old in s, (run, name, "pattern missing")
        p.write_text(s.replace(old, new, 1))
        n = jest(d)
        print(f"{run} | {name:24} | {'CAUGHT (%d tests fail)' % n if n else 'NOT CAUGHT, all tests still pass'}")
# bcrypt 72-byte limit: passwords that differ only after byte 72 are treated as equal
import json
code = r'''
const bcrypt = require(process.argv[1]);
(async()=>{ const a="é".repeat(40); const b="é".repeat(36)+"zzzz";
 const h=await bcrypt.hash(a,4); console.log("chars",a.length,"bytes",Buffer.byteLength(a),"| different password accepted:",await bcrypt.compare(b,h)); })();'''
for run, lib in (("run1","bcryptjs"),("run2","bcrypt")):
    r = subprocess.run(["node","-e",code,lib], cwd=HERE/run, capture_output=True, text=True)
    print(run, lib, r.stdout.strip() or r.stderr.strip()[:200])
