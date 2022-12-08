import Nav from "react-bootstrap/Nav";
import Link from "next/link";

function Navbar() {
  return (
    <Nav>
      <Nav.Item>
        <Link className="nav-link" href="/">
          Home
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link className="nav-link" href="/links">
          Links
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link className="nav-link" href="/import">
          Import
        </Link>
      </Nav.Item>
      <Nav.Item className="ms-auto">
        <Link className="nav-link" href="/api/auth/signout">
          Sign out
        </Link>
      </Nav.Item>
    </Nav>
  );
}

export default Navbar;
