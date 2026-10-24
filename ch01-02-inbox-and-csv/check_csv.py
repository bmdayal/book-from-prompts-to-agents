"""Written before the runs. Usage: python3 check_csv.py replies/csv_weak_1.py
Checks a reply that defines clean_csv(path). Score out of 5."""
import sys, ast, runpy
src = open(sys.argv[1]).read()
tree = ast.parse(src)
ns = runpy.run_path(sys.argv[1])
def attempt(label, fn):
    try: ok = bool(fn())
    except Exception as e: ok = False; label += f"  (raised {type(e).__name__})"
    print(("PASS  " if ok else "FAIL  ") + label); return ok
import pandas as pd
def out(): return ns["clean_csv"]("sample.csv")
def imports():
    names = set()
    for n in ast.walk(tree):
        if isinstance(n, ast.Import): names |= {a.name.split(".")[0] for a in n.names}
        if isinstance(n, ast.ImportFrom): names.add((n.module or "").split(".")[0])
    return names
def lowered():
    d = out()
    return all(v == v.lower() for c in d.select_dtypes(include="object") for v in d[c].dropna())
def has_doc():
    f = next(n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name == "clean_csv")
    return ast.get_docstring(f) is not None
checks = [
 ("returns a DataFrame",                 lambda: isinstance(out(), pd.DataFrame)),
 ("rows with missing values removed (2 rows left)", lambda: len(out()) == 3),
 ("string values lowercased",            lowered),
 ("only pandas imported",                lambda: imports() <= {"pandas"}),
 ("clean_csv has a docstring",           has_doc),
]
score = sum(attempt(l, fn) for l, fn in checks)
print(f"SCORE {score}/5")
