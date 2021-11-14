import { recipes } from './recipes.js'
const tRecettes = recipes

class ingredient {
  constructor (ingredient, quantity, unit) {
    this.ingredient = ingredient
    this.quantity = quantity
    this.unit = unit
  }
}
class Recette {
  constructor (id, name, servings, ingredients, time, description, appliance, ustensils, bAffiche) {
    this.id = id
    this.name = name
    this.servings = servings
    this.time = time
    this.description = description
    this.bAffiche = bAffiche
  }
}
function rechercheRecette (pRecherche) {
  let bIngredient = false
  let eltRecherche = pRecherche
  eltRecherche = eltRecherche.toLowerCase()
  if (eltRecherche.length > 2) {
    for (let i = 0; i < tRecettes.length; i++) {
      for (let j = 0; j < tRecettes[i].ingredients.length; j++) {
        if ((tRecettes[i].name.toLowerCase().indexOf(eltRecherche) !== -1) || (tRecettes[i].ingredients[j].ingredient.toLowerCase().indexOf(eltRecherche) !== -1)) {
          bIngredient = true
        }
      }
      if (bIngredient) {
        bIngredient = false
        creerCarte(tRecettes[i].id)
      }
    }
  }
}
document.getElementById('barreRecherche').addEventListener('input', function (e) {
  rechercheRecette(e.target.value)
})

function creerCarte (pId) {
  const recetteCourante = new Recette()
  const tIngredient = []
  let ingredientCourant
  for (let i = 0; i < tRecettes.length; i++) {
    if (tRecettes[i].id === pId) {
      recetteCourante.id = pId
      recetteCourante.name = tRecettes[i].name
      recetteCourante.time = tRecettes[i].time
      recetteCourante.description = tRecettes[i].description
      for (let j = 0; j < tRecettes[i].ingredients.length; j++) {
        ingredientCourant = new ingredient()
        ingredientCourant.ingredient = tRecettes[i].ingredients[j].ingredient
        ingredientCourant.quantity = tRecettes[i].ingredients[j].quantity
        ingredientCourant.unit = tRecettes[i].ingredients[j].unit?' '
        tIngredient.push(ingredientCourant)
      }
      break
    }
  }
  // Récupérer les recetes
  const idRecettes = document.getElementById('les-recettes')

  // création d'une div recette globale
  const recette = document.createElement('div')
  recette.classList.add('recette')
  recette.id = pId
  idRecettes.appendChild(recette)

  // Création div recette photo
  const recettePhoto = document.createElement('div')
  recettePhoto.classList.add('recette--photo')
  recette.appendChild(recettePhoto)

  // Création div recette detail
  const recetteDetail = document.createElement('div')
  recetteDetail.classList.add('recette--detail')
  recette.appendChild(recetteDetail)

  // Création div recette detail Nom Temps
  const recetteNomTemps = document.createElement('div')
  recetteNomTemps.classList.add('recette-nom-temps')
  recetteDetail.appendChild(recetteNomTemps)

  // Création p Nom de la recette
  const recetteNom = document.createElement('p')
  // recetteNom.classList.add('recette-nom-temps--nom')
  recetteNom.innerHTML = recetteCourante.name
  recetteNomTemps.appendChild(recetteNom)

  // Création p Temps de la recette
  const recetteTemps = document.createElement('p')
  recetteTemps.classList.add('recette-nom-temps--temps')
  recetteTemps.innerHTML = recetteCourante.time + ' min'
  recetteNomTemps.appendChild(recetteTemps)

  // Création div recette ingrédient description
  const recetteIngredientDescription = document.createElement('div')
  recetteIngredientDescription.classList.add('recette-ingredient-quantite-unite-description')
  recetteDetail.appendChild(recetteIngredientDescription)

  // Création div recette ingrédient
  const recetteIngredient = document.createElement('div')
  recetteIngredient.classList.add('recette-ingredient-quantite-unite')
  recetteIngredientDescription.appendChild(recetteIngredient)

  // Création p recette description
  const recetteDescription = document.createElement('p')
  recetteDescription.classList.add('recette-description')
  recetteDescription.innerHTML = recetteCourante.description
  recetteIngredientDescription.appendChild(recetteDescription)
}

function creerIngredient (pIdRecette) { // eslint-disable-line no-unused-vars
  const idRecette = document.getElementById(pIdRecette)
  
}
