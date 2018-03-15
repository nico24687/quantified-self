const $ = require('jquery');
const Food = require('./food');

const toFoodArray = (allFoodJson) => {
  return allFoodJson.map(food => new Food(food.id, food.name, food.calories))
}

const buildFoodRow = (food) => {
  const foodNode = $(`<td class="name">${food.name}</td>`)
  const caloriesNode = $(`<td>${food.calories}</td>`)
  const deleteNode = $(`<td><i class="far fa-trash-alt delete-food"></i></td>`)

  const rowNode = $(`<tr class="food" data-id="${food.id}"></tr>`).append(foodNode).append(caloriesNode).append(deleteNode)

  foodNode.prop("contentEditable", true)
  caloriesNode.prop("contentEditable", true)

  foodNode.on("blur", (event) => {
    updateFoodName(event.target.parentElement.dataset.id, event.target.innerText)
  });
  return rowNode
}

$(document).ready(() => {
  fetch("https://dry-retreat-71730.herokuapp.com/api/v1/foods")
    .then(response => response.json())
    .then(rawFood => toFoodArray(rawFood).reverse())
    .then(food => {
      food.forEach(currentFood => {
        $('.food-list tbody').append(buildFoodRow(currentFood));
      });
    })
    .catch(error => console.log(error))
});

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
    .then(rawFood => new Food(rawFood.id, rawFood.name, rawFood.calories))
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
