def average(numbers):
    if not numbers:
        raise ValueError("Cannot compute the average of an empty list")
    return sum(numbers) / len(numbers)
