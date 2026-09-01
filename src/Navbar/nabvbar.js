import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Logo from './Untitled-2.png'
import NavDropdown from 'react-bootstrap/NavDropdown';
import './navbar.css'
import { Link, NavLink } from "react-router-dom";

function CollapsibleExample() {
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" className="bg-gray-900 py-2 fixed top-0" variant="dark" style={{ zIndex: 999, fontSize: 17 }}>
        <Container>
          <Navbar.Brand as={Link} to={"/"} className="text-white" style={{ fontWeight: 'bold', fontSize: 30 }}><img src={Logo} alt="Site logo" className='h-24 mr-3'/> </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">

              <Nav.Link as={NavLink} to={"/"}
                style={({ isActive }) => ({
                  color: isActive ? "skyblue" : "white"
                })
                }
              >Home</Nav.Link>

              <Nav.Link as={NavLink} to={"/about"}
                style={({ isActive }) => ({
                  color: isActive ? "skyblue" : "white"
                })}
                className="home"
              >About</Nav.Link>
              <div className="hover-me">


                <NavDropdown title="Portfolio" id="collapsible-nav-dropdown" st>

                  <NavDropdown title="Consultancy" id="collapsible-nav-dropdend1" drop={'end'} st>
                    <NavDropdown.Item as={NavLink} to={"/assetmanagement"} id="consultancy-1">Asset Management</NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to={"/projectmanagement"} id="consultancy-2">
                      Project Management
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to={"/energymanagement"} id="consultancy-3">Energy Management</NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to={"/value"} id="consultancy-4">Value Engineering</NavDropdown.Item>
                  </NavDropdown>


                  


                  <NavDropdown.Item as={NavLink} to={"/manufacturing"} id="sales-nav">Manufacturing</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3" id="sales-nav">Sales</NavDropdown.Item>


                  <NavDropdown title="Services" id="collapsible-nav-dropdend3" drop={'end'}  st>
                    <NavDropdown.Item as={NavLink} to={"/energyaudit"} id="services-1">Energy Audit</NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to={"/valuation"} id="services-2">
                      Valuation
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to={"/techadv"} id="services-3">
                      Technical Advisory
                    </NavDropdown.Item>
                  </NavDropdown>


                  {/* <NavDropdown.Item href="#action/3.2">
                Manufacturing
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Sales</NavDropdown.Item> */}
                </NavDropdown>
              </div>

              <Nav.Link as={NavLink} to={"/contact"}
                style={({ isActive }) => ({
                  color: isActive ? "skyblue" : "white"
                })}
              >Contact</Nav.Link>
              <Nav.Link as={NavLink} to={"/gallery"}
                style={({ isActive }) => ({
                  color: isActive ? "skyblue" : "white"
                })}>Gallery</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default CollapsibleExample;
