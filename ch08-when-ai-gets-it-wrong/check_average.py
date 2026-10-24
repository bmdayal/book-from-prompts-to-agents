"""Five checks, written before any run. Usage: python3 check_average.py plain.py
Each reply file holds only the AI's code. Prints PASS/FAIL per check and a score out of 5."""
import sys, runpy
ns = runpy.run_path(sys.argv[1])
f = ns["average"]
def attempt(label, fn):
    try: ok = bool(fn())
    except Exception as e: ok = False; label += f"  (raised {type(e).__name__})"
    print(("PASS  " if ok else "FAIL  ") + label); return ok
checks = [
 ("average([1, 2, 3]) == 2.0",            lambda: f([1, 2, 3]) == 2.0),
 ("average([]) is None",                  lambda: f([]) is None),
 ("average([1, None, 3]) == 2.0",         lambda: f([1, None, 3]) == 2.0),
 ("average([1, 2, 2]) == 1.67 (2 places)", lambda: f([1, 2, 2]) == 1.67),
 ("average([2, 4]) is a float 3.0",       lambda: f([2, 4]) == 3.0 and isinstance(f([2, 4]), float)),
]
score = sum(attempt(l, fn) for l, fn in checks)
print(f"SCORE {score}/5")
