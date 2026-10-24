import csv


def clean_csv(input_path, output_path=None, delimiter=",", drop_duplicates=True,
              drop_empty_rows=True, fill_missing=None, encoding="utf-8"):
    """Clean a CSV file.

    - Strips leading/trailing whitespace from headers and cells
    - Normalizes headers (lowercase, spaces to underscores)
    - Removes completely empty rows (optional)
    - Removes duplicate rows (optional)
    - Fills missing values with `fill_missing` if provided
    - Pads/truncates rows to match the header length

    Returns the cleaned rows as a list of lists (header first).
    If output_path is given, writes the cleaned data to that file.
    """
    with open(input_path, newline="", encoding=encoding) as f:
        reader = csv.reader(f, delimiter=delimiter)
        rows = list(reader)

    if not rows:
        return []

    header = [h.strip().lower().replace(" ", "_") for h in rows[0]]
    width = len(header)
    cleaned = [header]
    seen = set()

    for row in rows[1:]:
        row = [cell.strip() for cell in row]

        if drop_empty_rows and not any(row):
            continue

        if len(row) < width:
            row += [""] * (width - len(row))
        elif len(row) > width:
            row = row[:width]

        if fill_missing is not None:
            row = [cell if cell != "" else fill_missing for cell in row]

        if drop_duplicates:
            key = tuple(row)
            if key in seen:
                continue
            seen.add(key)

        cleaned.append(row)

    if output_path:
        with open(output_path, "w", newline="", encoding=encoding) as f:
            writer = csv.writer(f, delimiter=delimiter)
            writer.writerows(cleaned)

    return cleaned
