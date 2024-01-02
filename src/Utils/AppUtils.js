export function calculateGroceryList(recipes) {
    let allIngredients = {}
    recipes.map(({ ingredients }) => {
        ingredients.map(({ ingredient, quantity, quantityType }) => {
            let key = [ingredient, quantityType].join(',')
            if (key in allIngredients) {
                allIngredients[key] = (parseFloat(quantity) + parseFloat(allIngredients[key])).toFixed(1)
            } else {
                allIngredients[key] = parseFloat(quantity).toFixed(1)
            }
        })
    })

    allIngredients = sortObj(allIngredients)
    let refinedIngredients = []

    for (const [key, value] of Object.entries(allIngredients)) {
        refinedIngredients.push(
            {
                ingredient: camelize(key.substring(0, key.indexOf(','))),
                quantity: `${value} ${key.substring(key.indexOf(',') + 1)}`
            }
        )
    }

    return refinedIngredients
}

function sortObj(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}

function camelize(str) {
    const words = str.split(" ")
    return words.map((word) => {
        return word[0].toUpperCase() + word.substring(1);
    }).join(" ");
}
