import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

import './index.css'
import AddRecipe from './Containers/AddRecipe/AddRecipe';
import { ADD_RECIPE_PAGE, RECIPES_PAGE } from './Utils/AppConts';
import ListRecipes from './Containers/ListRecipes/ListRecipes';

function App() {
  const [page, setPage] = useState(RECIPES_PAGE)
  const [recipes, setRecipes] = useState([])

  const handleSetPage = (newPage) => {
    setPage(newPage)
  }

  const handleSetRecipes = (newRecipes) => {
    setRecipes(newRecipes)
  }

  useEffect(() => {
    async function getData() {
      const opts = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      };

      try {
        const response = await fetch('http://localhost:8081/v1/recipes/getAll', opts)
        const data = await response.json()
        console.log(data)
        setRecipes(data)
      } catch (e) {
        console.log("Failed to get data")
        alert('Failed to get recipes. Talk to Alex.')
      }
    }
    getData();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand>Nug Recipe App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link onClick={() => setPage(RECIPES_PAGE)}>Recipes</Nav.Link>
                <Nav.Link onClick={() => setPage(ADD_RECIPE_PAGE)}>Add New Recipe</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      {
        page === 0 ?
          <ListRecipes recipes={recipes} changeRecipes={handleSetRecipes} />
          :
          <AddRecipe changePage={handleSetPage} updateRecipes={handleSetRecipes} currentRecipes={recipes} />
      }
    </div>
  );
}

export default App;
