"""Check that the references an AI gave you exist and say what it claimed.
Usage:  python3 check_dois.py [refs_claimed.tsv]
The file needs a header row with the columns run, n, claimed_title, doi (tab separated).
Looks each DOI up in Crossref (https://api.crossref.org) and compares the title.
A match means the paper exists. It does NOT mean the paper supports your claim: open it and read."""
import csv, json, re, sys, urllib.request, urllib.error
path = sys.argv[1] if len(sys.argv) > 1 else "refs_claimed.tsv"
def norm(s): return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()
cache = {}
def lookup(doi):
    if doi in cache: return cache[doi]
    try:
        req = urllib.request.Request(f"https://api.crossref.org/works/{doi}", headers={"User-Agent": "book-from-prompts-to-agents/1.0"})
        msg = json.load(urllib.request.urlopen(req, timeout=30))["message"]
        title = (msg.get("title") or [""])[0]
        sub = (msg.get("subtitle") or [""])[0]
        cache[doi] = ("found", f"{title}: {sub}" if sub else title)
    except urllib.error.HTTPError as e:
        cache[doi] = ("NOT FOUND" if e.code == 404 else f"HTTP {e.code}", "")
    except Exception as e:
        cache[doi] = ("ERROR", str(e)[:60])
    return cache[doi]
rows = [r for r in csv.DictReader(open(path, encoding="utf-8"), delimiter="\t") if r["doi"].strip()]
bad = 0
for r in rows:
    doi = r["doi"].strip()
    state, actual = lookup(doi)
    if state == "found":
        a, c = norm(actual), norm(r["claimed_title"])
        ok = a == c or a.startswith(c) or c.startswith(a)
        status = "OK" if ok else "TITLE DIFFERS"
    else:
        ok, status = False, state
    bad += not ok
    line = f"{status:14} {r['run']:8} {doi}"
    print(line if ok else line + f"\n{'':14} claimed: {r['claimed_title'][:70]}\n{'':14} actual:  {actual[:70]}")
print(f"\n{len(rows) - bad} of {len(rows)} references have a DOI that exists and a matching title ({len(cache)} different papers).")
