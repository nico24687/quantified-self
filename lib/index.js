const $ = require('jquery');
const Food = require('./food');
const Api = require('./api')
const Template = require(('./template'))
const ApplicationListeners = require(('./application-listeners'))

const buildMealFoodRow = (food) => {
  const rowNode = $(Template.mealFoodRow(food))
  const nameNode = rowNode.find(".name")
  const caloriesNode = rowNode.find(".calories")

  nameNode.prop("contentEditable", true)
  caloriesNode.prop("contentEditable", true)

  nameNode.on("blur", (event) => {
    Api.updateFoodName(event.target.parentElement.dataset.id, event.target.innerText)
  })

  caloriesNode.on("blur", (event) => {
    Api.updateFoodCalories(event.target.parentElement.dataset.id, event.target.innerText)
  })

  return rowNode
}

const getMealFoods = () => {
  Api.getAllFood()
    .then((rawFood) => {
      rawFood.reverse().forEach((currentFood) => {
        $('#meal .food-list tbody').append(buildMealFoodRow(currentFood))
      })
    })
    .catch((error) => console.error({ error}))
}

getMealFoods();

Api.getMeals()
  .then((meals) => {
    meals.forEach((meal) => {
      $('.add-to-meal').append(Template.addToMealButton(meal))
    })

    return meals
  }).then((meals) => {
    meals.forEach(meal => $('.meals').append( Template.mealTable(meal) ) )
    return meals
  }).then((meals) => {
    meals.forEach(meal => renderFoodForMeal(meal))
    return meals
  }).then((meals) => {
    meals.forEach(meal => recalculateCaloriesForMeal(meal.id))
    return meals
  }).then((meals) => {
    $(".meal-list").on("click", ".delete-food", (event) => {
      const foodNode = event.currentTarget.closest("tr")
      const foodId = foodNode.dataset.id
      const mealId = event.currentTarget.closest(".meal").dataset.id
      Api.deleteFoodFromMeal(mealId, foodId)
        .then( () => {
          foodNode.remove()
          recalculateCaloriesForMeal(mealId)
        })

    })
  })

const recalculateCaloriesForMeal = (mealId) =>{
  mealId = parseInt(mealId)
  const calories = $(`.meal[data-id=${mealId}] .calories`)
  const totalCalories = parseInt( calories.toArray().map(cell => parseInt(cell.innerText)).reduce((total, current) => total + current, 0) )
  
  updateCalories($(`.meal[data-id=${mealId}] .total-calories`), totalCalories)
  updateCalories(
    $(`.meal[data-id=${mealId}] .remaining-calories`),
    calorieGoalForMeal({ id: parseInt(mealId) }) - totalCalories
  )

  const totalCaloriesNodes = $('.total-calories')
  const totalCaloriesConsumed = parseInt(totalCaloriesNodes.toArray().map(cell => parseInt(cell.innerText) || 0).reduce((total,current) => total + current, 0) )
  $('.calories-consumed').text(totalCaloriesConsumed)
  $('.total-remaining-calories').text(2000 - totalCaloriesConsumed)
}

const renderFoodForMeal = (meal) => {
  meal.foods.forEach(food => {
    addFoodToMeal(meal, food)
  })
}

const addFoodToMeal = (meal, food) => {
  $(`.meal[data-id=${meal.id}] tbody`).prepend(Template.foodRow(food))
}

const updateCalories = (node, value) => {
  node.text(value)
  emphasizeCalories(node)
}

const emphasizeCalories = (calorieNode) => {
  const color = (parseInt(calorieNode.text()) || 0) < 0 ? "red" : "green"
  calorieNode.css("color", color)
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

ApplicationListeners.wireUpListeners()