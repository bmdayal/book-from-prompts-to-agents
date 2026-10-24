# Chapter 18: check what an AI tells you

Two small scripts for the two checks the chapter recommends. Python 3 and an internet connection; no extra packages.

## References

`python3 check_dois.py` reads `refs_claimed.tsv` and looks every DOI up in Crossref. It reports whether the DOI exists and whether the title matches what the AI claimed. A match means the paper exists. It does not mean the paper supports your claim: open it and read it.

`refs_claimed.tsv` holds the 19 references four fresh sessions gave when asked for peer-reviewed papers on rubber duck debugging and novice programmers (two sessions asked plainly, two told to include only references they were confident were real). They cover 8 different papers, since the sessions kept reaching for the same ones. All 19 DOIs exist. One reply had a title with one wrong word ("quite ugly" for "quirky"), which the script flags.

Check your own list: save it as a tab-separated file with the columns `run`, `n`, `claimed_title`, `doi` and run `python3 check_dois.py yourfile.tsv`.

## Packages

`python3 check_packages.py` reads `packages_claimed_round1.tsv` and checks each package name on PyPI. You can also pass names: `python3 check_packages.py pyxlsb teletext`. Existing is not the same as right: look at the project page and the date of the last release too.

`packages_claimed_round1.tsv` holds the package names two sessions gave for five niche tasks. All nine distinct names exist. `packages_round2.md` records a harder round (two invented file formats, an obscure ID number, a rarely used subtitle format): no session invented a package.

These were small tests on one kind of model, with no tools and no internet access.
