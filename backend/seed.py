import csv
from database import connect_db

conn = connect_db()
cursor = conn.cursor()

# Optional: Remove old data before inserting new data
cursor.execute("DELETE FROM locations")

with open("locations.csv", "r", newline="", encoding="utf-8") as file:
    reader = csv.DictReader(file)

    for row in reader:
        cursor.execute("""
            INSERT INTO locations (code, name, block, floor, type)
            VALUES (?, ?, ?, ?, ?)
        """, (
            row["code"],
            row["name"],
            row["block"],
            row["floor"],
            row["type"]
        ))

conn.commit()
conn.close()

print("✅ All locations imported successfully!")