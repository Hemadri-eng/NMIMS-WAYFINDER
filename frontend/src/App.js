import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";

function App() {

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState([]);
  const [route, setRoute] = useState([]);

  // -----------------------------
  // Search Location
  // -----------------------------
  const searchLocation = async () => {

    if (!search.trim()) return;

    const response = await fetch(
      `http://localhost:5000/search/${encodeURIComponent(search)}`
    );

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {

      setLocation(data[0]);
      setCategory([]);
      setRoute([]);

    } else {

      setLocation(null);
      setRoute([]);
      alert("Location Not Found");

    }

  };

  // -----------------------------
  // Browse Categories
  // -----------------------------
  const searchCategory = async (type) => {

    const response = await fetch(
      "http://localhost:5000/locations"
    );

    const data = await response.json();

    const filtered = data.filter(
      item => item.type === type
    );

    setCategory(filtered);
    setLocation(null);
    setRoute([]);

  };

  // -----------------------------
  // Start Navigation
  // -----------------------------
  const startNavigation = async () => {

    if (!location) return;

    const response = await fetch(
      `http://localhost:5000/navigate/${encodeURIComponent(location.name)}`
    );

    const data = await response.json();

    if (data.steps) {

      setRoute(data.steps);

    } else {

      alert("Unable to generate route.");

    }

  };

  return (

    <div className="App">

      <Header />

      <Hero />

      {/* Search */}

      <div className="search-box">

        <input
          type="text"
          placeholder="Search Room, Laboratory, Office..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={searchLocation}>
          Search
        </button>

      </div>

      {/* Categories */}

      <h2>Browse Categories</h2>

      <div className="categories">

        <button onClick={() => searchCategory("Lecture Room")}>
          Lecture Rooms
        </button>

        <button onClick={() => searchCategory("Lab")}>
          Laboratories
        </button>

        <button onClick={() => searchCategory("Faculty")}>
          Faculty Areas
        </button>

      </div>

      {/* Search Result */}

      {location && (

        <div className="card">

          <h2>{location.name}</h2>

          <p><strong>Block:</strong> {location.block}</p>

          <p><strong>Floor:</strong> {location.floor}</p>

          <p><strong>Type:</strong> {location.type}</p>

          <p><strong>Room Code:</strong> {location.code}</p>

          <button
            className="navigate-btn"
            onClick={startNavigation}
          >
            Start Navigation
          </button>

        </div>

      )}

      {/* Navigation Steps */}

      {route.length > 0 && (

        <div className="card">

          <h2>Navigation Route</h2>

          <ol>

            {route.map((step, index) => (

              <li key={index}>
                {step}
              </li>

            ))}

          </ol>

        </div>

      )}

      {/* Category Results */}

      {category.length > 0 && (

        <div className="list">

          {category.map((item, index) => (

            <div className="card" key={index}>

              <h3>{item.name}</h3>

              <p><strong>Block:</strong> {item.block}</p>

              <p><strong>Floor:</strong> {item.floor}</p>

              <p><strong>Type:</strong> {item.type}</p>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default App;