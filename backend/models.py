from database import connect_db

def create_tables():
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS locations(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        block TEXT NOT NULL,
        floor TEXT NOT NULL,
        type TEXT NOT NULL,
        aliases TEXT
    )
    """)

    conn.commit()
    conn.close()