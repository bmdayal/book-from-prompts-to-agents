import pandas as pd


def clean_csv(file_path: str) -> pd.DataFrame | None:
    """Read a CSV file and return a cleaned DataFrame.

    Cleaning steps:
        1. Read the CSV into a pandas DataFrame.
        2. Drop every row that contains at least one missing value.
        3. Convert the values in all string columns to lowercase.

    Args:
        file_path: Path to the CSV file to read.

    Returns:
        The cleaned DataFrame, or None if the file does not exist, is empty,
        or cannot be parsed as CSV.
    """
    try:
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        print(f"Error: file not found: {file_path}")
        return None
    except pd.errors.EmptyDataError:
        print(f"Error: file is empty: {file_path}")
        return None
    except pd.errors.ParserError as exc:
        print(f"Error: could not parse CSV {file_path}: {exc}")
        return None

    df = df.dropna(how="any")
    string_cols = df.select_dtypes(include=["object", "string"]).columns
    for col in string_cols:
        df[col] = df[col].apply(lambda v: v.lower() if isinstance(v, str) else v)
    return df
