"""A tiny keyword retriever (BM25), standard library only. Real systems often use embeddings; this needs no accounts or downloads."""
import math, re, os, sys, json
STOP = set("a an the of to in on for is are do you i my can how what and or it be if at by with as from this that".split())
def tok(t): return [w for w in re.findall(r"[a-z0-9$']+", t.lower()) if w not in STOP]
def load(d="docs"): return {f: open(os.path.join(d, f)).read().strip() for f in sorted(os.listdir(d)) if f.endswith(".md")}
def bm25(docs, q, k1=1.5, b=0.75):
    toks = {f: tok(t) for f, t in docs.items()}; N = len(toks); avg = sum(len(v) for v in toks.values()) / N
    df = {}
    for v in toks.values():
        for w in set(v): df[w] = df.get(w, 0) + 1
    scores = {}
    for f, v in toks.items():
        s = 0.0
        for w in tok(q):
            if w in df:
                tf = v.count(w); idf = math.log(1 + (N - df[w] + .5) / (df[w] + .5))
                s += idf * tf * (k1 + 1) / (tf + k1 * (1 - b + b * len(v) / avg))
        scores[f] = s
    return sorted(scores.items(), key=lambda kv: -kv[1])
QUESTIONS = [
 "How many days do I have to return an item?",
 "How much do I have to spend to get free standard shipping?",
 "How long is the warranty on a tent?",
 "My tent zipper broke after 3 months. Can I get my money back?",
 "How many points do I earn per dollar, and what are 500 points worth?",
 "Do you offer gift wrapping?",
 "What is the CEO's name?"]
NEED = {1: ["01-returns.md"], 2: ["02-shipping.md"], 3: ["03-warranty.md"], 4: ["01-returns.md", "03-warranty.md"], 5: ["04-loyalty.md"]}
if __name__ == "__main__":
    docs = load(); hits = 0
    for i, q in enumerate(QUESTIONS, 1):
        top = [f for f, s in bm25(docs, q)[:3]]
        need = NEED.get(i)
        ok = "" if need is None else ("RETRIEVED ALL NEEDED" if all(n in top for n in need) else "MISSED: " + ",".join(n for n in need if n not in top))
        print(f"Q{i}: top3={top}  {ok}")
        if need and all(n in top for n in need): hits += 1
    print("answerable questions with every needed document in the top 3:", hits, "of", len(NEED))
