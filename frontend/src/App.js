import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";

const API = "https://nmims-wayfinder.onrender.com";

function App() {

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState([]);
  const [route, setRoute] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // Load all locations
  // ==========================

  useEffect(() => {

    const loadLocations = async () => {

      try {

        const response = await fetch(`${API}/locations`);
        const data = await response.json();

        setLocations(data);
        setCategory(data);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

    loadLocations();

  }, []);

  // ==========================
  // Search
  // ==========================

  const searchLocation = async () => {

    if (!search.trim()) return;

    try {

      const response = await fetch(
        `${API}/search/${encodeURIComponent(search)}`
      );

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {

        setLocation(data[0]);
        setCategory([]);
        setRoute([]);

      }

      else {

        setLocation(null);
        setRoute([]);
        alert("Location not found.");

      }

    }

    catch (err) {

      console.log(err);

      alert("Unable to connect to server.");

    }

  };

  // ==========================
  // Category Filter
  // ==========================

  const searchCategory = (type) => {

    const filtered = locations.filter(
      item => item.type === type
    );

    setCategory(filtered);
    setLocation(null);
    setRoute([]);

  };

  // ==========================
  // Show All
  // ==========================

  const showAll = () => {

    setCategory(locations);

    setLocation(null);

    setRoute([]);

  };

  // ==========================
  // Navigation
  // ==========================

  const startNavigation = async () => {

    if (!location) return;

    try {

      const response = await fetch(

        `${API}/navigate/${encodeURIComponent(location.name)}`

      );

      const data = await response.json();

      if (data.steps) {

        setRoute(data.steps);

      }

      else {

        alert("Unable to generate navigation.");

      }

    }

    catch (err) {

      console.log(err);

    }

  };


  return (

    <div className="App" id="top">

      <Header />

      <Hero />

      {/* SEARCH */}

      <div className="search-box" id="search">

        <input
          type="text"
          placeholder="Search Room, Laboratory, Office or Code..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key==="Enter"){
              searchLocation();
            }
          }}
        />

        <button onClick={searchLocation}>
          Search
        </button>

      </div>


      {/* CATEGORY */}

      <h2>Browse Categories</h2>

      <div className="categories">

        <button onClick={()=>searchCategory("Lecture Room")}>
          Lecture Rooms
        </button>

        <button onClick={()=>searchCategory("Lab")}>
          Laboratories
        </button>

        <button onClick={()=>searchCategory("Faculty")}>
          Faculty Areas
        </button>

        <button onClick={showAll}>
          All Locations
        </button>

        <button
          onClick={() =>
            window.open(
              "https://maps.app.goo.gl/kxVDpiCJ6eryq1sP7",
              "_blank"
            )
          }
        >
          Campus Map
        </button>

      </div>



      {/* SEARCH RESULT */}

      {location && (

        <div className="card">

          <h2>{location.name}</h2>

          <p><strong>Block :</strong> {location.block}</p>

          <p><strong>Floor :</strong> {location.floor}</p>

          <p><strong>Type :</strong> {location.type}</p>

          <p><strong>Room Code :</strong> {location.code}</p>

          <button
            className="navigate-btn"
            onClick={startNavigation}
          >
            Start Navigation
          </button>

        </div>

      )}



      {/* ROUTE */}

      {route.length>0 && (

        <div className="card">

          <h2>Navigation Route</h2>

          <ol>

            {

              route.map((step,index)=>(

                <li
                  key={index}
                  style={{marginBottom:"12px"}}
                >
                  {step}
                </li>

              ))

            }

          </ol>

        </div>

      )}



      {/* LOADING */}

      {

        loading &&

        <div className="card">

          <h3>Loading Campus Locations...</h3>

        </div>

      }



      {/* ALL LOCATIONS */}

      {

        category.length>0 &&

        <div className="list">

          {

            category.map((item,index)=>(

              <div
                className="card"
                key={index}
              >

                <h3>{item.name}</h3>

                <p>

                  <strong>Block :</strong>

                  {" "}

                  {item.block}

                </p>

                <p>

                  <strong>Floor :</strong>

                  {" "}

                  {item.floor}

                </p>

                <p>

                  <strong>Type :</strong>

                  {" "}

                  {item.type}

                </p>

                <p>

                  <strong>Code :</strong>

                  {" "}

                  {item.code}

                </p>

              </div>

            ))

          }

        </div>

      }



      <footer
        className="footer"
        id="footer"
      >

        © 2026 NMIMS WayFinder | Developed by Hemadri Bhatnagar

      </footer>

    </div>

  );

}

export default App;