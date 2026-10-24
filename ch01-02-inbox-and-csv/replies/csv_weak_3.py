import csv
import re


def clean_csv(input_path, output_path=None, delimiter=",", drop_duplicates=True,
              drop_empty_rows=True, strip_whitespace=True, normalize_headers=True,
              encoding="utf-8"):
    """Clean a CSV file and return the cleaned rows (header first).

    Operations:
      - strip leading/trailing whitespace from every cell
      - normalize headers to lowercase snake_case
      - drop fully empty rows
      - drop duplicate rows
      - pad/truncate rows so every row matches the header length

    If output_path is given, the cleaned data is written there.
    """
    with open(input_path, "r", newline="", encoding=encoding) as f:
        reader = csv.reader(f, delimiter=delimiter)
        rows = list(reader)

    if not rows:
        if output_path:
            with open(output_path, "w", newline="", encoding=encoding) as f:
                pass
        return []

    header, data = rows[0], rows[1:]

    if strip_whitespace:
        header = [h.strip() for h in header]
        data = [[c.strip() for c in row] for row in data]

    if normalize_headers:
        header = [re.sub(r"[^0-9a-zA-Z]+", "_", h).strip("_").lower() for h in header]

    width = len(header)
    cleaned = []
    seen = set()
    for row in data:
        if drop_empty_rows and not any(cell for cell in row):
            continue
        if len(row) < width:
            row = row + [""] * (width - len(row))
        elif len(row) > width:
            row = row[:width]
        if drop_duplicates:
            key = tuple(row)
            if key in seen:
                continue
            seen.add(key)
        cleaned.append(row)

    result = [header] + cleaned

    if output_path:
        with open(output_path, "w", newline="", encoding=encoding) as f:
            writer = csv.writer(f, delimiter=delimiter)
            writer.writerows(result)

    return result
