import { recipes } from './recipes.js'
const tRecettes = recipes

class Ingredient {
  constructor (ingredient, quantity, unit) {
    this.ingredient = ingredient
    this.quantity = quantity
    this.unit = unit
  }
}
class Recette {
  constructor (id, name, servings, time, description, bAffiche) {
    this.id = id
    this.name = name
    this.servings = servings
    this.time = time
    this.description = description
    this.bAffiche = bAffiche
  }
}
const tUstensils = []
const tIngredients = []
const tAppareils = []

function remplirUstensils () {
  for (let i = 0; i < tRecettes.length; i++) {
    for (let j = 0; j < tRecettes[i].ustensils.length; j++) {
      if (!tUstensils.includes(tRecettes[i].ustensils[j].toLowerCase())) {
        tUstensils.push(tRecettes[i].ustensils[j].toLowerCase())
      }
    }
  }
}

function remplirIngredients () {
  for (let i = 0; i < tRecettes.length; i++) {
    for (let j = 0; j < tRecettes[i].ingredients.length; j++) {
      if (!tIngredients.includes(tRecettes[i].ingredients[j].ingredient.toLowerCase())) {
        tIngredients.push(tRecettes[i].ingredients[j].ingredient.toLowerCase())
      }
    }
  }
}

function remplirAppareils () {
  for (let i = 0; i < tRecettes.length; i++) {
    if (!tAppareils.includes(tRecettes[i].appliance.toLowerCase())) {
      tAppareils.push(tRecettes[i].appliance.toLowerCase())
    }
  }
}

remplirUstensils()
remplirIngredients()
remplirAppareils()

function rechercheRecette (pRecherche) {
  let bIngredient = false
  let recetteDejaAffiche
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
        recetteDejaAffiche = document.getElementById(tRecettes[i].id)
        if (recetteDejaAffiche === null) {
          creerCarte(tRecettes[i].id)
        }
      }
    }
  }
}
document.getElementById('barreRecherche').addEventListener('input', function (e) {
  rechercheRecette(e.target.value)
})
document.getElementById('filtre--ingredient-id').addEventListener('click', function () {
  const idFiltreIngredient = document.getElementById('filtre--ingredient-id')
  const idPIngredients = document.getElementById('ingredients')
  const idInputIngredient = document.getElementById('input-ingredient')
  if (idPIngredients !== null) {
    idFiltreIngredient.removeChild(idPIngredients)
    idInputIngredient.style.display = 'initial'
  }
})
function creerCarte (pId) {
  const recetteCourante = new Recette()
  const tIngredientCourant = []
  let ingredientCourant
  for (let i = 0; i < tRecettes.length; i++) {
    if (tRecettes[i].id === pId) {
      recetteCourante.id = pId
      recetteCourante.name = tRecettes[i].name
      recetteCourante.time = tRecettes[i].time
      recetteCourante.description = tRecettes[i].description
      for (let j = 0; j < tRecettes[i].ingredients.length; j++) {
        ingredientCourant = new Ingredient()
        ingredientCourant.ingredient = tRecettes[i].ingredients[j].ingredient
        ingredientCourant.quantity = tRecettes[i].ingredients[j].quantity
        if (tRecettes[i].ingredients[j].unit === undefined) {
          ingredientCourant.unit = ''
        } else {
          ingredientCourant.unit = tRecettes[i].ingredients[j].unit
        }
        tIngredientCourant.push(ingredientCourant)
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
  recetteTemps.innerHTML = '<i class="far fa-clock"></i> ' + recetteCourante.time + ' min'
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
  for (let i = 0; i < tIngredientCourant.length; i++) {
    ingredientCourant = new Ingredient()
    ingredientCourant.ingredient = tIngredientCourant[i].ingredient
    if (tIngredientCourant[i].quantity !== undefined) {
      ingredientCourant.quantity = tIngredientCourant[i].quantity
    }
    if (tIngredientCourant[i].unit !== undefined) {
      ingredientCourant.unit = tIngredientCourant[i].unit
    }
    creerIngredient(ingredientCourant, recetteIngredient)
  }
}

function creerIngredient (pIngredientCourant, pDivAjout) { // eslint-disable-line no-unused-vars
  const recetteIngredient = document.createElement('p')
  recetteIngredient.classList.add('recette--detail--ingredient')
  recetteIngredient.innerHTML = '<b>' + pIngredientCourant.ingredient
  if (pIngredientCourant.quantity !== undefined) {
    recetteIngredient.innerHTML += ' : </b>' + pIngredientCourant.quantity
  }
  if (pIngredientCourant.unit !== undefined) {
    recetteIngredient.innerHTML += ' ' + pIngredientCourant.unit
  }
  pDivAjout.appendChild(recetteIngredient)
}
