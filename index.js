/* eslint-env jquery */
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
const tUstensiles = []
const tIngredients = []
const tAppareils = []

function remplirUstensiles () {
  for (let i = 0; i < tRecettes.length; i++) {
    for (let j = 0; j < tRecettes[i].ustensils.length; j++) {
      if (!tUstensiles.includes(tRecettes[i].ustensils[j].toLowerCase())) {
        tUstensiles.push(tRecettes[i].ustensils[j].toLowerCase())
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

remplirUstensiles()
remplirIngredients()
remplirAppareils()

function rechercheFiltre (pRecherche, pTypeRecherche) {
  let eltRecherche = pRecherche
  eltRecherche = eltRecherche.toLowerCase()
  let elmtRecherche
  switch (pTypeRecherche) {
    case 'ingredient' :
      elmtRecherche = document.getElementsByClassName('ingredients')
      break
    case 'appareil' :
      elmtRecherche = document.getElementsByClassName('appareils')
      break

    case 'ustensile' :
      elmtRecherche = document.getElementsByClassName('ustensiles')
      break
  }
  for (let i = 0; i < elmtRecherche.length; i++) {
    if (eltRecherche.length > 2) {
      if (!elmtRecherche[i].innerHTML.toLowerCase().includes(eltRecherche)) {
        elmtRecherche[i].style.display = 'none'
      } else {
        elmtRecherche[i].style.display = 'initial'
      }
    } else {
      elmtRecherche[i].style.display = 'initial'
    }
  }
}
function creerTag (pElt, pNomElt) {
  const ensTag = document.getElementById('ensembleTag')
  const eltTag = document.createElement('div')
  const eltBtn = document.createElement('button')
  const eltDel = document.createElement('i')
  eltTag.classList.add('tag')
  eltTag.classList.add(pNomElt)
  eltTag.innerHTML = pElt
  ensTag.appendChild(eltTag)
  eltBtn.classList.add('btn')
  eltTag.appendChild(eltBtn)
  eltDel.classList.add('far')
  eltDel.classList.add('fa-times-circle')
  eltBtn.appendChild(eltDel)
  eltTag.addEventListener('click', function () {
    supprimerTag(pElt)
  })
}

function supprimerTag (pElt) {
  const ensTag = document.getElementById('ensembleTag')
  const elmtRecherche = document.getElementsByClassName('tag')
  let elmtType
  for (let i = 0; i < elmtRecherche.length; i++) {
    if (elmtRecherche[i].innerText.toLowerCase() === pElt.toLowerCase()) {
      for (let j = 0; j < elmtRecherche[i].classList.length; j++) {
        switch (elmtRecherche[i].classList[j].toLowerCase()) {
          case 'ingredient' :
            elmtType = document.getElementsByClassName('ingredients')
            break
          case 'appareil' :
            elmtType = document.getElementsByClassName('appareils')
            break
          case 'ustensile' :
            elmtType = document.getElementsByClassName('ustensiles')
            break
        }
      }
      for (let k = 0; k < elmtType.length; k++) {
        if (pElt.toLowerCase() === elmtType[k].innerText.toLowerCase()) {
          elmtType[k].style.display = 'initial'
          break
        }
      }
      ensTag.removeChild(elmtRecherche[i])
      break
    }
  }
}
function creerBouton (pElmt, pElmts, pNomElmt) {
  const eltBtn = document.createElement('button')
  eltBtn.classList.add('list-group-item')
  eltBtn.classList.add('col-12')
  eltBtn.classList.add('col-md-4')
  eltBtn.classList.add('col-lg-3')
  eltBtn.classList.add('list-group-item-action')
  if (pElmt !== null) {
    eltBtn.classList.add(pElmt)
  }
  if (pElmts !== null) {
    eltBtn.classList.add(pElmts)
  }
  eltBtn.innerHTML = pNomElmt.charAt(0).toUpperCase() + pNomElmt.slice(1)
  return eltBtn
}

function ajouteElement (pElmt) {
  let idCollapse
  let eltChildren
  let eltBtn
  switch (pElmt) {
    case 'ingredient':
      idCollapse = document.getElementById('collapseIngredient')
      eltChildren = idCollapse.firstElementChild
      for (let i = 0; i < tIngredients.length; i++) {
        eltBtn = creerBouton('ingredients', 'ingredient', tIngredients[i])
        eltChildren.appendChild(eltBtn)
      }
      break
    case 'appareil':
      idCollapse = document.getElementById('collapseAppareil')
      eltChildren = idCollapse.firstElementChild
      for (let i = 0; i < tAppareils.length; i++) {
        eltBtn = creerBouton('appareils', 'appareil', tAppareils[i])
        eltChildren.appendChild(eltBtn)
      }
      break
    case 'ustensile':
      idCollapse = document.getElementById('collapseUstensile')
      eltChildren = idCollapse.firstElementChild
      for (let i = 0; i < tUstensiles.length; i++) {
        eltBtn = creerBouton('ustensiles', 'ustensile', tUstensiles[i])
        eltChildren.appendChild(eltBtn)
      }
      break
  }
}

ajouteElement('ingredient')
ajouteElement('appareil')
ajouteElement('ustensile')

const eltIng = document.getElementsByClassName('ingredients')
for (let i = 0; i < eltIng.length; i++) {
  eltIng[i].addEventListener('click', function () {
    creerTag(eltIng[i].textContent, 'ingredient')
    eltIng[i].style.display = 'none'
    $('#collapseIngredient').collapse('hide')
  })
}
const eltApp = document.getElementsByClassName('appareils')
for (let i = 0; i < eltApp.length; i++) {
  eltApp[i].addEventListener('click', function () {
    creerTag(eltApp[i].textContent, 'appareil')
    eltApp[i].style.display = 'none'
    $('#collapseAppareil').collapse('hide')
  })
}

const eltUst = document.getElementsByClassName('ustensiles')
for (let i = 0; i < eltUst.length; i++) {
  eltUst[i].addEventListener('click', function () {
    creerTag(eltUst[i].textContent, 'ustensile')
    eltUst[i].style.display = 'none'
    $('#collapseUstensile').collapse('hide')
  })
}

function rechercheRecette (pRecherche) {
  let bIngredient = false
  let recetteDejaAffiche
  let eltRecherche = pRecherche
  eltRecherche = eltRecherche.toLowerCase()
  if (eltRecherche.length > 2) {
    for (let i = 0; i < tRecettes.length; i++) {
      for (let j = 0; j < tRecettes[i].ingredients.length; j++) {
        if ((tRecettes[i].name.toLowerCase().indexOf(eltRecherche) !== -1) || (tRecettes[i].ingredients[j].ingredient.toLowerCase().indexOf(eltRecherche) !== -1) || (tRecettes[i].description.toLowerCase().indexOf(eltRecherche) !== -1)) {
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

document.getElementById('btnIngredientFleche').addEventListener('click', function () {
  const idFleche = document.getElementById('btnIngredientFleche')
  const idFiltreIngredient = document.getElementById('btnIngredient')
  const idInputIngredient = document.getElementById('inputIngredient')
  if (idInputIngredient === null) {
    idFiltreIngredient.innerHTML = '<input type="text" class="input ingredient" id="inputIngredient" placeholder="Rechercher un ingrédient...">'
    document.getElementById('inputIngredient').addEventListener('input', function (e) {
      rechercheFiltre(e.target.value, 'ingredient')
    })
  }
  idFleche.style.transform = 'rotate(180deg)'
})

$('#collapseIngredient').on('hidden.bs.collapse', function () {
  const idFiltreIngredient = document.getElementById('btnIngredient')
  const idFleche = document.getElementById('btnIngredientFleche')
  idFiltreIngredient.innerHTML = 'Ingrédients'
  idFleche.style.transform = 'rotate(0deg)'
})

document.getElementById('btnAppareilFleche').addEventListener('click', function () {
  const idFiltreAppareil = document.getElementById('btnAppareil')
  const idInputAppareil = document.getElementById('inputAppareil')
  const idFleche = document.getElementById('btnAppareilFleche')
  if (idInputAppareil === null) {
    idFiltreAppareil.innerHTML = '<input type="text" class="input appareil" id="inputAppareil" placeholder="Rechercher un appareil...">'
    document.getElementById('inputAppareil').addEventListener('input', function (e) {
      rechercheFiltre(e.target.value, 'appareil')
    })
  }
  idFleche.style.transform = 'rotate(180deg)'
})

$('#collapseAppareil').on('hidden.bs.collapse', function () {
  const idFiltreIngredient = document.getElementById('btnAppareil')
  const idFleche = document.getElementById('btnAppareilFleche')
  idFiltreIngredient.innerHTML = 'Appareils'
  idFleche.style.transform = 'rotate(0deg)'
})

document.getElementById('btnUstensileFleche').addEventListener('click', function () {
  const idFiltreUstensile = document.getElementById('btnUstensile')
  const idInputUstensile = document.getElementById('inputUstensile')
  const idFleche = document.getElementById('btnUstensileFleche')
  if (idInputUstensile === null) {
    idFiltreUstensile.innerHTML = '<input type="text" class="input ustensile" id="inputUstensile" placeholder="Rechercher un ustensile...">'
    document.getElementById('inputUstensile').addEventListener('input', function (e) {
      rechercheFiltre(e.target.value, 'ustensile')
    })
  }
  idFleche.style.transform = 'rotate(180deg)'
})

$('#collapseUstensile').on('hidden.bs.collapse', function () {
  const idFiltreIngredient = document.getElementById('btnUstensile')
  const idFleche = document.getElementById('btnUstensileFleche')
  idFiltreIngredient.innerHTML = 'Ustensiles'
  idFleche.style.transform = 'rotate(0deg)'
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

function creerIngredient (pIngredientCourant, pDivAjout) {
  const recetteIngredient = document.createElement('p')
  recetteIngredient.classList.add('recette--detail--ingredient')
  recetteIngredient.innerHTML = '<span class="font-weight-bold">' + pIngredientCourant.ingredient
  if (pIngredientCourant.quantity !== undefined) {
    recetteIngredient.innerHTML += ' : </span>' + pIngredientCourant.quantity
  }
  if (pIngredientCourant.unit !== undefined) {
    recetteIngredient.innerHTML += ' ' + pIngredientCourant.unit
  }
  pDivAjout.appendChild(recetteIngredient)
}
