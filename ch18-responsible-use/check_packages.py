"""Check that package names an AI suggested exist on PyPI.
Usage:  python3 check_packages.py name1 name2 ...      or      python3 check_packages.py packages_claimed_round1.tsv
Existing is not the same as right: also look at the project page and the date of the last release."""
import csv, json, sys, urllib.request, urllib.error
args = sys.argv[1:] or ["packages_claimed_round1.tsv"]
names = []
for a in args:
    if a.endswith(".tsv"):
        names += [r["package_named"].strip() for r in csv.DictReader(open(a, encoding="utf-8"), delimiter="\t")]
    else:
        names.append(a)
for name in dict.fromkeys(n for n in names if n):
    try:
        info = json.load(urllib.request.urlopen(f"https://pypi.org/pypi/{name}/json", timeout=30))["info"]
        print(f"EXISTS     {name:20} v{info['version']:10} {(info['summary'] or '')[:60]}")
    except urllib.error.HTTPError as e:
        print(f"NOT FOUND  {name}" if e.code == 404 else f"HTTP {e.code}   {name}")
    except Exception as e:
        print(f"ERROR      {name}: {str(e)[:60]}")
