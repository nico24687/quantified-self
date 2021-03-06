const $ = require('jquery');
const Food = require('./food');
const Api = require('./api')
const Template = require(('./template'))

const buildFoodRow = (food) => {
  const foodNode = $(`<td class="name">${food.name}</td>`)
  const caloriesNode = $(`<td class="calories">${food.calories}</td>`)
  // const deleteNode = $(`<td><img src="./trash-alt.svg" alt="delete"></td>`)
  const deleteNode = $(`<td><i class="far fa-trash-alt delete-food"></i></td>`)

  const rowNode = $(`<tr class="food" data-id="${food.id}"></tr>`).append(foodNode).append(caloriesNode).append(deleteNode)

  foodNode.prop("contentEditable", true)
  caloriesNode.prop("contentEditable", true)

  foodNode.on("blur", (event) => {
    Api.updateFood(event.target.parentElement.dataset.id, $(event.target.parentElement).find(".name").text(), $(event.target.parentElement).find(".calories").text())
  })
  caloriesNode.on("blur", (event) => {
    Api.updateFood(event.target.parentElement.dataset.id, $(event.target.parentElement).find(".name").text(), $(event.target.parentElement).find(".calories").text())
  })
  return rowNode
}

const getFoods = () => {
  Api.getAllFood()
    .then((rawFood) => {
      rawFood.sort((a,b) => {a.id - b.id}).reverse().forEach((currentFood) => {
        $('#all-food .food-list tbody').append(buildFoodRow(currentFood))
      })
    })
    .catch((error) => console.error({ error }))
}

getFoods();