const $ = require('jquery');
const Food = require('./food');

const buildFoodRow = (food) => {
  const foodNode = $(`<td class="name">${food.name}</td>`)
  const caloriesNode = $(`<td>${food.calories}</td>`)
  const deleteNode = $(`<td><i class="far fa-trash-alt delete-food"></i></td>`)

  const rowNode = $(`<tr class="food" data-id="${food.id}"></tr>`).append(foodNode).append(caloriesNode).append(deleteNode)

  foodNode.prop("contentEditable", true)
  caloriesNode.prop("contentEditable", true)

  foodNode.on("blur", (event) => {
    updateFoodName(event.target.parentElement.dataset.id, event.target.innerText)
  })
  caloriesNode.on("blur", (event) => {
    updateFoodCalories(event.target.parentElement.dataset.id, event.target.innerText)
  })
  return rowNode
}

const getFoods = () => {
  fetch("https://dry-retreat-71730.herokuapp.com/api/v1/foods")
    .then((response) => response.json())
    .then((rawFood) => {
      rawFood.reverse().forEach((currentFood) => {
        $('.food-list tbody').append(buildFoodRow(currentFood))
      })
    })
    .catch((error) => console.error({ error}))
}

const buildMealFoodRow = (food) => {
  const foodNode = $(`<td class="name">${food.name}</td>`)
  const caloriesNode = $(`<td>${food.calories}</td>`)
  const checkNode = $('<td><input class="select-for-meal" type="checkbox"></td>')

  const rowNode = $(`<tr class="food" data-id="${food.id}"></tr>`).append(foodNode).append(caloriesNode).append(checkNode)

  foodNode.prop("contentEditable", true)
  caloriesNode.prop("contentEditable", true)

  foodNode.on("blur", (event) => {
    updateFoodName(event.target.parentElement.dataset.id, event.target.innerText)
  })
  caloriesNode.on("blur", (event) => {
    updateFoodCalories(event.target.parentElement.dataset.id, event.target.innerText)
  })
  return rowNode
}

const getMealFoods = () => {
  fetch("https://dry-retreat-71730.herokuapp.com/api/v1/foods")
    .then((response) => response.json())
    .then((rawFood) => {
      rawFood.reverse().forEach((currentFood) => {
        $('.meal-food-list tbody').append(buildMealFoodRow(currentFood))
      })
    })
    .catch((error) => console.error({ error}))
}


const postFood = (name, calories) => {
  const newFood = { food: { name: name, calories: calories } };

  return fetch("https://dry-retreat-71730.herokuapp.com/api/v1/foods", {
      method: 'POST',
      body: JSON.stringify(newFood),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
}


$(".add-food").on("click", (event) => {
  event.preventDefault();
  $(".error").text("");

  const name = $(".add-food-form .food .form-control").val()
  const calories = $(".add-food-form .calories .form-control").val()
  let isValid = true
  if(name.length === 0) {
    isValid = false
    $('.add-food-form .food .error').text('Please enter a food name')
  }
  if(calories.length === 0 ){
    isValid = false
    $('.add-food-form .calories .error').text('Please enter a calorie amount')
  }
  if(!isValid){
    return
  }
  postFood(name, calories)
    .then(newFood => {
      $('.food-list tbody').prepend(buildFoodRow(newFood));
      $('.add-food-form .form-control').val("");
    })

});

const deleteFood = (id) => {
  return fetch(`https://dry-retreat-71730.herokuapp.com/api/v1/foods/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
}

$(".food-list").on("click", ".delete-food", (event) => {
  deleteFood(event.currentTarget.parentElement.parentElement.dataset.id)
    .then(() => { event.currentTarget.parentElement.parentElement.hidden = true })
})

const updateFoodName = (id, name) => {
  const updatedFood = { food: { name: name } };
  return fetch(`https://dry-retreat-71730.herokuapp.com/api/v1/foods/${id}`,{
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedFood)
  })
  .then(response => response.json())
}

const updateFoodCalories = (id, calories) => {
  const updatedFood = { food: { calories: calories } };
  return fetch(`https://dry-retreat-71730.herokuapp.com/api/v1/foods/${id}`,{
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedFood)
  })
  .then(response => response.json())
}


$('.search-food-form .search .form-control').on("keyup", (event) => {
  $(".food-list .food .name").each((index, food) => {
    food.parentElement.hidden = food.innerText.toLowerCase().indexOf(event.target.value.toLowerCase()) === -1
  })
})

getFoods();
getMealFoods();

const getMeals = () => {
  return fetch('https://dry-retreat-71730.herokuapp.com/api/v1/meals')
    .then((response) => response.json())
}

getMeals()
  .then((meals) => {
    meals.forEach((meal) => {
      $('.add-to-meal').append(`<button type="button" class="btn btn-default" data-id="${meal.id}">${meal.name}</button>`)
    })

    return meals
  }).then((meals) => {
    meals.forEach(meal => $('.meals').append( generateMealTable(meal) ) )
    return meals
  }).then((meals) => {
    meals.forEach(meal => renderFoodForMeal(meal))
  })

const renderFoodForMeal = (meal) => {
  meal.foods.forEach(food => {
    addFoodToMeal(meal, food)
  })
}

const addFoodToMeal = (meal, food) => {
  $(`.meal[data-id=${meal.id}] tbody`).prepend(generateFoodRow(food))
}

const generateFoodRow = (food) => {
  return `<tr><td>${food.name}</td><td>${food.calories}</td><td></td></tr>`
}

const generateMealTable = (meal) => {

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
            <td class="remaining-calories"></td>
          </tr>
        </tbody>
      </table>

    </div >
  </div >`
}
