import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavbarUser() {
  const [state, dispatch] = useContext(UserContext)

  let navigate = useNavigate()

  const logout = () => {
      console.log(state)
      dispatch({
          type: "LOGOUT"
      })
      navigate("/auth")
  }
  return (
    <Navbar bg="black" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#"><img src={logo} style={{  maxWidth: '80px' }} alt="" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className='groupnavmenu'>
            <Nav.Link as={Link} to="/user"style={{ color:'white' }}><button>Product</button></Nav.Link>
            <Nav.Link as={Link} to="/user/complain" style={{ color:'white' }}><button>Complain</button></Nav.Link>
            <Nav.Link as={Link} to="/user/profile" style={{ color:'white' }}><button>Profile</button></Nav.Link>
            <Nav.Link onClick={logout} style={{ color:'white' }} ><button>Logout</button></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarUser;