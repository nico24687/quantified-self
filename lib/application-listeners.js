const $ = require('jquery');
const Food = require('./food');
const Api = require('./api')
const Template = require(('./template'))

class ApplicationListeners {
  wireUpListeners() {
    $(".add-food").on("click", (event) => {
      event.preventDefault();
      $(".error").text("");

      const name = $(".add-food-form .food .form-control").val()
      const calories = $(".add-food-form .calories .form-control").val()
      let isValid = true
      if (name.length === 0) {
        isValid = false
        $('.add-food-form .food .error').text('Please enter a food name')
      }
      if (calories.length === 0) {
        isValid = false
        $('.add-food-form .calories .error').text('Please enter a calorie amount')
      }
      if (!isValid) {
        return
      }

      Api.createFood(name, calories)
        .then(newFood => {
          const foodRowNode = $(Template.foodRow(newFood))
          $('.food-list tbody').prepend(foodRowNode);
          wireUpFoodRow(foodRowNode)
          $('.add-food-form .form-control').val("");
        })
    });

    $(".food-list").on("click", ".delete-food", (event) => {
      Api.deleteFood(event.currentTarget.parentElement.parentElement.dataset.id)
        .then(() => { event.currentTarget.parentElement.parentElement.hidden = true })
    })

    $('.search-food-form .search .form-control').on("keyup", (event) => {
      $(".food-list .food .name").each((index, food) => {
        food.parentElement.hidden = food.innerText.toLowerCase().indexOf(event.target.value.toLowerCase()) === -1
      })
    })

    $(".add-to-meal").on("click", "button", (event) => {
      const selectedFood = $('.select-for-meal:checked')
      const mealId = event.currentTarget.dataset.id

      selectedFood.each((index, food) => {
        const foodId = food.closest("tr").dataset.id
        Api.addFoodToMeal(mealId, foodId)
        const mealName = event.currentTarget.innerText
        const meal = { id: mealId, name: mealName }
        const foodName = $(`.food[data-id='${foodId}'] .name`).text()
        const foodCalories = $(`.food[data-id='${foodId}'] .calories`).text()
        const foodJson = { id: foodId, name: foodName, calories: foodCalories }
        addFoodToMeal(meal, foodJson)
        $('input:checkbox').prop('checked', false)
      })

      recalculateCaloriesForMeal(mealId)
    })

    $('.calories-header').on("click", (event) => {
      const previousSortOrder = event.target.dataset.sortOrder
      let foodNodes = $(".food-list .food").toArray()

      if (previousSortOrder === "descending") {
        foodNodes = foodNodes.sort((a, b) => parseInt(b.dataset.id) - parseInt(a.dataset.id))
        event.target.dataset.sortOrder = "default"
      } else if (previousSortOrder === "ascending") {
        foodNodes = foodNodes.sort((a, b) => parseInt(b.children[1].innerText) - parseInt(a.children[1].innerText))
        event.target.dataset.sortOrder = "descending"
      } else {
        foodNodes = foodNodes.sort((a, b) => parseInt(a.children[1].innerText) - parseInt(b.children[1].innerText))
        event.target.dataset.sortOrder = "ascending"
      }


      $(".food-list tbody tr").remove()
      $(".food-list tbody").append(foodNodes)
    })
  }
}

const wireUpFoodRow = (node) => {
  const foodNode = $(node.find(".name")[0])
  const caloriesNode = $(node.find(".calories")[0])

  foodNode.prop("contentEditable", true)
  caloriesNode.prop("contentEditable", true)

  foodNode.on("blur", (event) => {
    Api.updateFoodName(event.target.parentElement.dataset.id, event.target.innerText)
  })
  caloriesNode.on("blur", (event) => {
    Api.updateFoodCalories(event.target.parentElement.dataset.id, event.target.innerText)
  })
}


const addFoodToMeal = (meal, food) => {
  $(`.meal[data-id=${meal.id}] tbody`).prepend(Template.foodRow(food))
}

const recalculateCaloriesForMeal = (mealId) => {
  mealId = parseInt(mealId)
  const calories = $(`.meal[data-id=${mealId}] .calories`)
  const totalCalories = parseInt(calories.toArray().map(cell => parseInt(cell.innerText)).reduce((total, current) => total + current, 0))

  updateCalories($(`.meal[data-id=${mealId}] .total-calories`), totalCalories)
  updateCalories(
    $(`.meal[data-id=${mealId}] .remaining-calories`),
    calorieGoalForMeal({ id: parseInt(mealId) }) - totalCalories
  )

  const totalCaloriesNodes = $('.total-calories')
  const totalCaloriesConsumed = parseInt(totalCaloriesNodes.toArray().map(cell => parseInt(cell.innerText) || 0).reduce((total, current) => total + current, 0))
  $('.calories-consumed').text(totalCaloriesConsumed)
  $('.total-remaining-calories').text(2000 - totalCaloriesConsumed)
}


const updateCalories = (node, value) => {
  node.text(value)
  emphasizeCalories(node)
}

const emphasizeCalories = (calorieNode) => {
  const color = (parseInt(calorieNode.text()) || 0) < 0 ? "crimson" : "green"
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

module.exports = new ApplicationListeners()