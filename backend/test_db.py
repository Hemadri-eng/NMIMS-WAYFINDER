from database import connect_db

conn = connect_db()
cursor = conn.cursor()

cursor.execute("SELECT COUNT(*) FROM locations")
count = cursor.fetchone()[0]

print(f"Total Locations: {count}")

cursor.execute("""
SELECT code,name,block,floor
FROM locations
LIMIT 10
""")

rows = cursor.fetchall()

for row in rows:
    print(row)

conn.close()