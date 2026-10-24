def average(numbers):
    values = [n for n in numbers if n is not None]
    if not values:
        return None
    return round(sum(values) / len(values), 2)
