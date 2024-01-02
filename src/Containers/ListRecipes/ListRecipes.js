import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

import '../../index.css'
import { calculateGroceryList } from '../../Utils/AppUtils';

function ListRecipes({ recipes, changeRecipes }) {
    const [selectedRecipes, setSelectedRecipes] = useState([])
    const [show, setShow] = useState(false)

    const handleShow = () => {
        calculateGroceryList(selectedRecipes)
        setShow(true)
    }
    const handleClose = () => setShow(false)

    const handleSelectedRecipes = (ind) => {
        if (!selectedRecipes.includes(ind)) {
            setSelectedRecipes(selectedRecipes => [...selectedRecipes, ind])
        } else {
            setSelectedRecipes(selectedRecipes.filter(function (item) {
                return item.transactionId !== ind.transactionId
            }))
        }
    }

    const deleteRecipe = async (id) => {
        const opts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'transactionId': id })
        };

        try {
            await fetch('http://localhost:8081/v1/recipes/removeRecipe', opts)
            alert("Successfully removed recipe")
            changeRecipes(recipes.filter(function (ind) {
                return ind.transactionId !== id
            }))
        } catch (e) {
            console.log("Failed to remove recipe")
            alert('Failed to remove recipe. Talk to Alex.')
        }
    }

    return (
        <div className="standard-table">
            <h1>Recipes</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th></th>
                        <th>Recipe</th>
                        <th>Ingredients</th>
                        <th>Link</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        recipes.map((value, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <Form.Check
                                            key={index}
                                            type='checkbox'
                                            id={`default-checkbox`}
                                            onChange={() => handleSelectedRecipes(value)}
                                        />
                                    </td>
                                    <td>{value.recipeName}</td>
                                    <td>{value.ingredients.map(({ ingredient }) => `${ingredient}`).join(',')}</td>
                                    <td>
                                        <a href={value.recipeLink}>
                                            {
                                                value.recipeLink === "" || value.recipeLink === null ?
                                                    <Button variant="success" disabled>No Link Found</Button>
                                                    :
                                                    <Button variant="success">{new URL(value.recipeLink).hostname}</Button>
                                            }

                                        </a>
                                    </td>
                                    <td><Button variant="danger" onClick={() => deleteRecipe(value.transactionId)}>Remove</Button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <Button variant="success" onClick={handleShow}>Create Grocery List</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Grocery List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        calculateGroceryList(selectedRecipes).map((val, ind) => {
                            return (
                                <div className="inline-row">
                                    <p>
                                        <b>{val.ingredient}</b> - <i>{val.quantity}</i>
                                    </p>
                                </div>)
                        })
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ListRecipes;