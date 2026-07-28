import logo from "../assets/nmims-university-logo.png";

function Header() {
  return (
    <header className="header">

      <div className="logo-section">
        <img src={logo} alt="NMIMS Logo" className="logo" />

        <div>
          <h1>NMIMS WayFinder</h1>
          <p>Smart Indoor Campus Navigation System</p>
        </div>
      </div>

      <nav>
        <a href="/">Home</a>
        <a href="/">Navigation</a>
        <a href="/">Campus Map</a>
        <a href="/">Help</a>
      </nav>

    </header>
  );
}

export default Header;