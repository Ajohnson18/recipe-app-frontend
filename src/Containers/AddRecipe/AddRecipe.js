import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

import Ingredients from '../../ingredient-list.json'
import { RECIPES_PAGE } from '../../Utils/AppConts';

function AddRecipe({ changePage, updateRecipes, currentRecipes }) {
    const [currentIngredient, setCurrentIngredient] = useState(null)
    const [recipeName, setRecipeName] = useState("")
    const [newIngredients, setNewIngredients] = useState([])
    const [hide, setHide] = useState(true)
    const [recipeLink, setRecipeLink] = useState("")
    const [search, setSearch] = useState("")
    const [quantity, setQuantity] = useState(0)
    const [quantityType, setQuantityType] = useState(null)

    const handleQuantity = (e) => setQuantity(e.target.value)
    const handleQuantityType = (e) => setQuantityType(e.target.value)
    const handleRecipeName = (e) => setRecipeName(e.target.value)
    const handleRecipeLink = (e) => setRecipeLink(e.target.value)
    const removeItem = (ind) => setNewIngredients(newIngredients.filter((_, i) => i !== ind))
    const validateIngredientInput = () => (search === null || search === "" || quantity === 0 || quantityType === null)

    const handleSelector = (e) => {
        setCurrentIngredient(e.target.value)
        setSearch(e.target.value)
        setHide(true)
    }

    const handleSearch = (e) => {
        setHide(false)
        setSearch(e.target.value)
    }

    const handleAddNewIngredients = () => {
        if (validateIngredientInput()) {
            alert("Please fill out all required fields")
            return
        }

        let item = {
            ingredient: currentIngredient === null ? search : currentIngredient,
            quantity: quantity,
            quantityType: quantityType
        }

        setNewIngredients([...newIngredients, item])

        setSearch("")
        setCurrentIngredient(null)
        setQuantity(0)
    }

    const handleCreateRecipe = async () => {
        console.log(recipeLink)

        try {
            if (recipeLink !== "" && recipeLink !== null) {
                new URL(recipeLink)
            }
        } catch (e) {
            console.log(e)
            alert('Please enter a valid URL')
            return
        }

        const body = {
            recipeName: recipeName,
            ingredients: newIngredients,
            uuid: 'current-meg-uuid',
            recipeLink: recipeLink
        }

        const opts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };

        try {
            const response = await fetch('https://recipe-app-backend-production-692a.up.railway.app/v1/recipes/addRecipe', opts)
            const data = await response.json()
            console.log(data)
            alert('Recipe Added!')
            updateRecipes([...currentRecipes, data])
            changePage(RECIPES_PAGE)
        } catch (e) {
            console.log("Failed to send data")
            alert('Failed to add recipe. Talk to Alex.')
        }
    }


    return (
        <div className="standard-table">
            <Form.Control size='lg' type="recipe-name" placeholder="Recipe Name" onChange={handleRecipeName} />
            <br />
            <Form.Control size='md' type="recipe-link" placeholder="Recipe Link (Optional)" onChange={handleRecipeLink} />
            <br />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Ingredient</th>
                        <th>Quantity</th>
                        <th>Units</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <Form.Control type="recipe-name" placeholder="Search..." onChange={handleSearch} value={search} />
                            {
                                search !== "" && hide === false ?
                                    <Form.Select aria-label="Choose an ingredient" onChange={handleSelector}>
                                        <option>Choose an ingredient</option>
                                        {
                                            Ingredients.map((value, key) => {
                                                if (value.searchValue.includes(search.toLowerCase())) {
                                                    return (<option key={key} value={value.searchValue}>{value.searchValue}</option>)
                                                } else {
                                                    return <></>
                                                }
                                            })
                                        }
                                    </Form.Select>
                                    :
                                    <></>
                            }
                        </td>
                        <td>
                            <Form.Control type="number" placeholder="Add Quantity" onChange={handleQuantity} value={quantity} />
                        </td>
                        <td>
                            <Form.Select aria-label="Choose Quantity Type" onChange={handleQuantityType}>
                                <option>Choose a quantity type</option>
                                <option value="na">n/a</option>
                                <option value="Cups">Cups</option>
                                <option value="Teaspoons">Teaspoons</option>
                                <option value="Tablespoons">Tablespoons</option>
                                <option value="Pounds">Pounds</option>
                            </Form.Select>
                        </td>
                        <td><Button variant="secondary" onClick={handleAddNewIngredients}>Add Ingredient</Button></td>
                    </tr>
                    {
                        newIngredients.map((value, index) =>
                            <tr key={index}>
                                <td>{value.ingredient}</td>
                                <td>{value.quantity}</td>
                                <td>{value.quantityType}</td>
                                <td><Button variant="danger" onClick={() => removeItem(index)}>Remove</Button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
            <Button variant="primary" disabled={recipeName === "" || newIngredients.length < 1} onClick={handleCreateRecipe}>Add Recipe</Button>
        </div>
    );

}

export default AddRecipe;