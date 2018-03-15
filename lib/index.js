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
  });
  return rowNode
}

const getFoods = () => {
  fetch("https://dry-retreat-71730.herokuapp.com/api/v1/foods")
    .then(response => response.json())
    .then(rawFood => {
      rawFood.reverse().forEach(currentFood => {
        $('.food-list tbody').append(buildFoodRow(currentFood))
      })
    })
    .catch(error => console.log(error))
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
  .then(rawFood => new Food(rawFood.id, rawFood.name, rawFood.calories))
}


$('.search-food-form .search .form-control').on("keyup", (event) => {
  $(".food-list .food .name").each((index, food) => {
    food.parentElement.hidden = food.innerText.toLowerCase().indexOf(event.target.value.toLowerCase()) === -1
  })
})
