import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";

function App() {

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState([]);
  const [route, setRoute] = useState([]);
  const [locations, setLocations] = useState([]);


  // Load all locations when website opens
  useEffect(() => {

    const loadLocations = async () => {

      try {

        const response = await fetch(
          "https://nmims-wayfinder.onrender.com/locations"
        );

        const data = await response.json();

        console.log("Locations Loaded:", data.length);

        setLocations(data);
        setCategory(data);

      } 
      catch(error) {

        console.log("Error loading locations:", error);

      }

    };


    loadLocations();

  }, []);



  // Search Location
  const searchLocation = async () => {

    if (!search.trim()) return;


    const response = await fetch(
      `https://nmims-wayfinder.onrender.com/search/${encodeURIComponent(search)}`
    );


    const data = await response.json();


    if (Array.isArray(data) && data.length > 0) {

      setLocation(data[0]);
      setCategory([]);
      setRoute([]);

    }

    else {

      setLocation(null);
      alert("Location Not Found");

    }

  };



  // Browse Categories
  const searchCategory = (type) => {


    const filtered = locations.filter(
      item => item.type === type
    );


    setCategory(filtered);
    setLocation(null);
    setRoute([]);

  };



  // Start Navigation
  const startNavigation = async () => {


    if (!location) return;


    const response = await fetch(
      `https://nmims-wayfinder.onrender.com/navigate/${encodeURIComponent(location.name)}`
    );


    const data = await response.json();


    console.log(data);


    if(data.steps){

      setRoute(data.steps);

    }

    else {

      alert("Unable to generate route.");

    }

  };



  return (

    <div className="App">


      <Header />


      <Hero />



      <div className="search-box">


        <input

          type="text"

          placeholder="Search Room, Laboratory, Office..."

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

        />


        <button onClick={searchLocation}>

          Search

        </button>


      </div>



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

  <button
    onClick={() =>
      window.open(
        "https://maps.app.goo.gl/kxVDpiCJ6eryq1sP7",
        "_blank"
      )
    }
  >
    Campus Location
  </button>

</div>

      {location && (

        <div className="card">


          <h2>{location.name}</h2>


          <p><b>Block:</b> {location.block}</p>

          <p><b>Floor:</b> {location.floor}</p>

          <p><b>Type:</b> {location.type}</p>

          <p><b>Code:</b> {location.code}</p>



          <button

            className="navigate-btn"

            onClick={startNavigation}

          >

            Start Navigation

          </button>


        </div>

      )}



      {route.length > 0 && (

        <div className="card">


          <h2>Navigation Route</h2>


          <ol>

            {

              route.map((step,index)=>(

                <li key={index}>

                  {step}

                </li>

              ))

            }

          </ol>


        </div>

      )}



      {category.length > 0 && (

        <div className="list">


          {category.map((item,index)=>(


            <div className="card" key={index}>


              <h3>{item.name}</h3>


              <p><b>Block:</b> {item.block}</p>

              <p><b>Floor:</b> {item.floor}</p>

              <p><b>Type:</b> {item.type}</p>

              <p><b>Code:</b> {item.code}</p>


            </div>


          ))}


        </div>

      )}



      <footer className="footer">

        Hemadri Bhatnagar

      </footer>


    </div>

  );

}


export default App;