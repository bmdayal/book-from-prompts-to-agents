import csv


def clean_csv(input_path, output_path=None, delimiter=",", drop_duplicates=True,
              drop_empty_rows=True, fill_value=None, lowercase_headers=True):
    """Clean a CSV file and return the cleaned rows (list of dicts).

    - Strips whitespace from headers and cell values.
    - Normalizes headers (lowercase, spaces replaced with underscores).
    - Optionally drops empty rows and duplicate rows.
    - Optionally fills empty cells with fill_value.
    - Writes the result to output_path if provided.
    """
    with open(input_path, newline="", encoding="utf-8-sig") as f:
        reader = csv.reader(f, delimiter=delimiter)
        try:
            raw_headers = next(reader)
        except StopIteration:
            return []

        headers = []
        for h in raw_headers:
            h = h.strip()
            if lowercase_headers:
                h = h.lower()
            headers.append("_".join(h.split()))

        cleaned = []
        seen = set()
        for row in reader:
            row = [cell.strip() for cell in row]
            if drop_empty_rows and not any(row):
                continue
            # Pad or trim row to match header length
            if len(row) < len(headers):
                row += [""] * (len(headers) - len(row))
            else:
                row = row[:len(headers)]
            if fill_value is not None:
                row = [c if c != "" else fill_value for c in row]
            key = tuple(row)
            if drop_duplicates:
                if key in seen:
                    continue
                seen.add(key)
            cleaned.append(dict(zip(headers, row)))

    if output_path:
        with open(output_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=headers, delimiter=delimiter)
            writer.writeheader()
            writer.writerows(cleaned)

    return cleaned
