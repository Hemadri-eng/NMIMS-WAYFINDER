from flask import jsonify
from database import connect_db
from navigation import generate_route


def create_aliases(name):

    name = name.lower().strip()

    aliases = [name]

    # -------------------------
    # Lecture Rooms
    # -------------------------
    if "lr" in name:

        number = ''.join(
            filter(str.isdigit, name)
        )

        if number:

            aliases.extend([
                f"lr{number}",
                f"lr {number}",
                f"lecture room {number}",
                f"lecture room{number}",
                f"classroom {number}",
                f"class room {number}",
                f"room {number}"
            ])


    # -------------------------
    # Programming Labs
    # -------------------------
    if "programming lab" in name:

        number = ''.join(
            filter(str.isdigit, name)
        )

        aliases.extend([
            "pl" + number,
            "pl " + number,
            "programming laboratory " + number,
            "prog lab " + number
        ])


    # -------------------------
    # Project Labs
    # -------------------------
    if "project lab" in name:

        number = ''.join(
            filter(str.isdigit, name)
        )

        aliases.extend([
            "pr" + number,
            "pr " + number,
            "project laboratory " + number
        ])


    # -------------------------
    # Pharmaceutics
    # -------------------------
    if (
        "pharm" in name
        or "pc" in name
        or "pharma" in name
    ):

        aliases.extend([
            "pc",
            "pharm",
            "pharma",
            "pharmaceutics",
            "pharm lab",
            "pharma lab"
        ])


    # -------------------------
    # Faculty
    # -------------------------
    if "faculty" in name:

        aliases.extend([
            "faculty",
            "faculty area",
            "faculty room",
            "faculty cabin",
            "cabin"
        ])


    # -------------------------
    # Labs
    # -------------------------
    if "lab" in name:

        aliases.extend([
            "lab",
            "laboratory"
        ])


    return aliases




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