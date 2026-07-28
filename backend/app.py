from flask import Flask
from flask_cors import CORS
from models import create_tables
from routes import register_routes
import os

app = Flask(__name__)

CORS(app)

create_tables()
register_routes(app)

@app.route("/")
def home():
    return "NMIMS WayFinder API Running"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )