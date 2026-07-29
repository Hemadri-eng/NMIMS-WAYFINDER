from flask import jsonify
from database import connect_db
from navigation import generate_route


def create_aliases(name):

    name = name.lower().strip()

    aliases = {name}

    numbers = ''.join(filter(str.isdigit, name))

    # -----------------------------
    # Lecture Rooms
    # -----------------------------
    if "lr" in name or "lecture room" in name:

        if numbers:

            aliases.update([
                f"lr{numbers}",
                f"lr {numbers}",
                f"lecture room {numbers}",
                f"lecture room{numbers}",
                f"classroom {numbers}",
                f"class room {numbers}",
                f"room {numbers}"
            ])

    # -----------------------------
    # Programming Labs
    # -----------------------------
    if "programming lab" in name:

        aliases.update([
            f"pl{numbers}",
            f"pl {numbers}",
            f"programming lab {numbers}",
            f"programming laboratory {numbers}",
            f"prog lab {numbers}"
        ])

    # -----------------------------
    # Project Labs
    # -----------------------------
    if "project lab" in name:

        aliases.update([
            f"pr{numbers}",
            f"pr {numbers}",
            f"project lab {numbers}",
            f"project laboratory {numbers}"
        ])

    # -----------------------------
    # Advanced Programming Lab
    # -----------------------------
    if "advanced programming" in name:

        aliases.update([
            "apl",
            "apl lab",
            "advanced programming lab"
        ])

    # -----------------------------
    # Database Lab
    # -----------------------------
    if "database lab" in name:

        aliases.update([
            "db lab",
            "database laboratory"
        ])

    # -----------------------------
    # Software Engineering Lab
    # -----------------------------
    if "software engineering" in name:

        aliases.update([
            "se lab",
            "software lab"
        ])

    # -----------------------------
    # Computer Networks Lab
    # -----------------------------
    if "computer networks" in name:

        aliases.update([
            "cn lab",
            "network lab"
        ])

    # -----------------------------
    # Data Structures
    # -----------------------------
    if "data structure" in name:

        aliases.update([
            "dsa lab",
            "dsa"
        ])

    # -----------------------------
    # Cyber Security
    # -----------------------------
    if "cyber security" in name:

        aliases.update([
            "cs lab",
            "cyber lab"
        ])

    # -----------------------------
    # Artificial Intelligence
    # -----------------------------
    if "aiml" in name:

        aliases.update([
            "ai lab",
            "ml lab",
            "artificial intelligence lab"
        ])

    # -----------------------------
    # ARVR
    # -----------------------------
    if "arvr" in name:

        aliases.update([
            "vr lab",
            "ar lab"
        ])

    # -----------------------------
    # Pharmacy
    # -----------------------------
    if "pharmaceutics" in name:

        aliases.update([
            "pc lab",
            "pharm lab",
            "pharma lab"
        ])

    if "pc2" in name:

        aliases.update([
            "pharmaceutical chemistry lab 2",
            "pc lab 2"
        ])

    if "pc3" in name:

        aliases.update([
            "pharmaceutical chemistry lab 3",
            "pc lab 3"
        ])

    if "pc analysis" in name:

        aliases.update([
            "pharmaceutical analysis",
            "analysis lab"
        ])

    if "pc chem" in name:

        aliases.update([
            "pharmaceutical chemistry lab",
            "chemistry lab"
        ])

    if "quality ass" in name:

        aliases.update([
            "quality assurance lab",
            "qa lab"
        ])

    if "pc tech" in name:

        aliases.update([
            "pharmaceutics technology lab",
            "technology lab"
        ])

    # -----------------------------
    # Faculty
    # -----------------------------
    if "faculty" in name:

        aliases.update([
            "faculty",
            "faculty room",
            "faculty cabin",
            "cabin"
        ])

    # -----------------------------
    # Office
    # -----------------------------
    if "office" in name:

        aliases.update([
            "admin office",
            "administration",
            "office"
        ])

    # -----------------------------
    # Lab
    # -----------------------------
    if "lab" in name:

        aliases.update([
            "laboratory",
            "lab"
        ])

    return list(aliases)


def register_routes(app):


    # =============================
    # ALL LOCATIONS
    # =============================

    @app.route("/locations")
    def get_locations():

        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT code,name,block,floor,type
            FROM locations
        """)

        rows = cursor.fetchall()

        conn.close()


        data = []

        for row in rows:

            data.append({

                "code": row[0],
                "name": row[1],
                "block": row[2],
                "floor": row[3],
                "type": row[4]

            })


        return jsonify(data)



    # =============================
    # SMART SEARCH
    # =============================

    @app.route("/search/<query>")
    def search(query):

        query = query.lower().strip()

        conn = connect_db()
        cursor = conn.cursor()


        cursor.execute("""
            SELECT code,name,block,floor,type
            FROM locations
        """)


        rows = cursor.fetchall()

        conn.close()


        results = []


        for row in rows:


            aliases = create_aliases(row[1])


            match = False


            for alias in aliases:

                if query in alias:

                    match = True
                    break



            if match:


                results.append({

                    "code": row[0],
                    "name": row[1],
                    "block": row[2],
                    "floor": row[3],
                    "type": row[4]

                })



        if len(results)==0:

            return jsonify({
                "message":"Location Not Found"
            }),404



        return jsonify(results)




    # =============================
    # NAVIGATION
    # =============================

    @app.route("/navigate/<query>")
    def navigate(query):


        conn = connect_db()
        cursor = conn.cursor()


        cursor.execute("""
            SELECT code,name,block,floor,type
            FROM locations
            WHERE LOWER(name)=LOWER(?)
        """,(query,))


        row = cursor.fetchone()


        conn.close()



        if row is None:

            return jsonify({
                "message":"Location Not Found"
            }),404




        steps = generate_route(

            row[2],
            row[3],
            row[1]

        )



        return jsonify({

            "destination": row[1],
            "code": row[0],
            "block": row[2],
            "floor": row[3],
            "type": row[4],
            "steps": steps

        })