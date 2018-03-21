class Template {
  foodRow(food) {
    return `<tr data-id="${food.id}"><td>${food.name}</td><td class="calories">${food.calories}</td><td><i class="far fa-trash-alt delete-food"></i></td></tr>`
  }

  mealFoodRow(food) {
    return `
      <tr class="food" data-id="${food.id}">
        <td class="name">${food.name}</td>
        <td class="calories">${food.calories}</td>
        <td><input class="select-for-meal" type="checkbox"></td>
      </tr>
    `
  }

  mealTable(meal) {
    return `<div class="row meal" data-id=${meal.id}>
    <div class="col-xs-12" >

      <h2>${meal.name}</h2>
      <table class="table meal-list ">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Calories</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Calories</td>
            <td class="total-calories"></td>
          </tr>
          <tr>
            <td>Remaining Calories</td>
            <td class="remaining-calories">${calorieGoalForMeal(meal)}</td>
          </tr>
        </tbody>
      </table>

    </div >
  </div >`
  }

  addToMealButton(meal) {
    return `<button type="button" class="btn btn-default" data-id="${meal.id}">${meal.name}</button>`
  }
}

const calorieGoalForMeal = (meal) => {
  if (meal.id === 1) {
    return 400
  }
  if (meal.id === 2) {
    return 200
  }
  if (meal.id === 3) {
    return 600
  }
  if (meal.id === 4) {
    return 800
  }
}

module.exports = new Template()