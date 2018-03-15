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