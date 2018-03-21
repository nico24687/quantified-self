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
          $('.food-list tbody').prepend(buildFoodRow(newFood));
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

module.exports = new ApplicationListeners()