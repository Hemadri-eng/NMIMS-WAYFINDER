def generate_route(block, floor, room):

    steps = []

    steps.append("Enter Academic Block")
    steps.append("Walk to Central Foyer")

    if block == "A":
        steps.append("Proceed towards A Wing")

    elif block == "B":
        steps.append("Proceed towards B Wing")

    elif block == "C":
        steps.append("Proceed towards C Wing")

    elif block == "D":
        steps.append("Proceed towards D Wing")

    if floor == "First":
        steps.append(f"Use Staircase {block}")
        steps.append("Reach First Floor")

    elif floor == "Second":
        steps.append(f"Use Staircase {block}")
        steps.append("Reach Second Floor")

    steps.append(f"Proceed to {room}")

    return steps