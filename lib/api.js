class Api {
  getAllFood() {
    return fetch("https://dry-retreat-71730.herokuapp.com/api/v1/foods")
      .then((response) => response.json())
  }

  createFood(name, calories) {
    const newFood = { food: { name: name, calories: calories } };

    return fetch("https://dry-retreat-71730.herokuapp.com/api/v1/foods", {
      method: 'POST',
      body: JSON.stringify(newFood),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
  }

  deleteFood(id) {
    return fetch(`https://dry-retreat-71730.herokuapp.com/api/v1/foods/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
  }

  updateFoodName(id, name) {
    const updatedFood = { food: { name: name } };
    return fetch(`https://dry-retreat-71730.herokuapp.com/api/v1/foods/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFood)
    })
      .then(response => response.json())
  }

  updateFoodCalories(id, calories) {
    const updatedFood = { food: { calories: calories } };
    return fetch(`https://dry-retreat-71730.herokuapp.com/api/v1/foods/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFood)
    })
      .then(response => response.json())
  }

  addFoodToMeal(mealId, foodId) {
    return fetch(`https://dry-retreat-71730.herokuapp.com/api/v1/meals/${mealId}/foods/${foodId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
  }

  getMeals() {
    return fetch('https://dry-retreat-71730.herokuapp.com/api/v1/meals')
      .then((response) => response.json())
  }

  deleteFoodFromMeal(mealId, foodId) {
    return fetch(`https://dry-retreat-71730.herokuapp.com/api/v1/meals/${mealId}/foods/${foodId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': "application/json" }
    })
  }
}

module.exports = new Api()