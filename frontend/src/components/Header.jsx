import logo from "../assets/nmims-university-logo.png";

function Header() {
  return (
    <header className="header">

      <div className="logo-section">
        <img
          src={logo}
          alt="NMIMS Logo"
          className="logo"
        />

        <div>
          <h1>NMIMS WayFinder</h1>
          <p>Smart Indoor Campus Navigation System</p>
        </div>
      </div>

      <nav>

        <a href="#top">
          Home
        </a>

        <a href="#search">
          Navigation
        </a>

        <a
          href="https://maps.app.goo.gl/kxVDpiCJ6eryq1sP7"
          target="_blank"
          rel="noopener noreferrer"
        >
          Campus Map
        </a>

        <a href="#footer">
          Help
        </a>

      </nav>

    </header>
  );
}

export default Header;