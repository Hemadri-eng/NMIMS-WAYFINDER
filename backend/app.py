from flask import Flask
from flask_cors import CORS

from models import create_tables
from routes import register_routes

app = Flask(__name__)

# Allow requests from React
CORS(app, resources={r"/*": {"origins": "*"}})

create_tables()
register_routes(app)

@app.route("/")
def home():
    return "NMIMS WayFinder API Running"

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)