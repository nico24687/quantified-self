const $ = require('jquery')



class Api {

  constructor() {
    this.foodUrl = ("https://dry-retreat-71730.herokuapp.com/api/v1/foods")
  }

  getFoods() {
    fetch(this.foodUrl)
      .then((response) => response.json())
      .then((rawFood) => {
        rawFood.reverse().forEach((currentFood) => {
          $('#all-food .food-list tbody').append(buildFoodRow(currentFood))
        })
      })
      .catch((error) => console.error({error}))
  }
}

module.exports = Api;
