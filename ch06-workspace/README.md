# Chapter 6: check your API key setup

- `check_setup.py`: copy it into a project folder and run `python3 check_setup.py`. It checks that a `.env` file exists and is ignored by git, that `.env.example` exists, that a real key is set, and that no key-shaped text appears in any file git tracks. It never prints a key.
- `.env.example` and `.gitignore`: the two small files the chapter describes, ready to copy.
- `test_check_setup.py`: builds four throwaway repositories (correct, `.env` not ignored, key committed, placeholder key) and confirms the checker reports exactly the right problem in each. Run: `python3 test_check_setup.py`.

The checker only recognizes the usual key shapes. Treat it as a smoke alarm, not a security audit. If a key is ever committed, assume it is compromised: create a new one and disable the old one.
