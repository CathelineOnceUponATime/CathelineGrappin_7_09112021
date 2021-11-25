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
  constructor (id, name, servings, time, description, appareil, bAffiche) {
    this.id = id
    this.name = name
    this.servings = servings
    this.time = time
    this.description = description
    this.bAffiche = bAffiche
    this.appareil = appareil
    this.tIngredient = []
    this.tUstensiles = []
  }
}

class Tag {
  constructor (name, type, bAffiche) {
    this.name = name
    this.type = type
    this.bAffiche = bAffiche
  }
}

class Filtre {
  constructor (name, type, bAffiche) {
    this.name = name
    this.type = type
    this.bAffiche = bAffiche
  }
}

const tUstensiles = []
const tIngredients = []
const tAppareils = []

const tRecettesAffichees = []

let tTags = []
const tTagsIngredient = []
const tTagsAppareil = []
const tTagsUstensile = []

let tFiltres = []
const tFiltresIngredient = []
const tFiltresAppareil = []
const tFiltresUstensile = []

function remplirIngAppUst (pType) {
  for (let i = 0; i < tRecettes.length; i++) {
    switch (pType) {
      case 'ingredient' :
        for (let j = 0; j < tRecettes[i].ingredients.length; j++) {
          if (!tIngredients.includes(tRecettes[i].ingredients[j].ingredient.toLowerCase())) {
            tIngredients.push(tRecettes[i].ingredients[j].ingredient.toLowerCase())
          }
        }
        break
      case 'appareil' :
        if (!tAppareils.includes(tRecettes[i].appliance.toLowerCase())) {
          tAppareils.push(tRecettes[i].appliance.toLowerCase())
        }
        break
      case 'ustensile' :
        for (let j = 0; j < tRecettes[i].ustensils.length; j++) {
          if (!tUstensiles.includes(tRecettes[i].ustensils[j].toLowerCase())) {
            tUstensiles.push(tRecettes[i].ustensils[j].toLowerCase())
          }
        }
        break
    }
  }
}

remplirIngAppUst('ingredient')
remplirIngAppUst('appareil')
remplirIngAppUst('ustensile')

/*
  Fonction qui prend en paramètre un pElmtRecherche qui est le tableau rempli des élèments des filtres voulu
  il enlève l'affichage des boutons dont les tags sont présents dans les filtres
*/
function supprimerTagRecherche (pElmtRecherche) {
  for (let i = 0; i < pElmtRecherche.length; i++) {
    for (let j = 0; j < tTags.length; j++) {
      if (tTags[j].name.toLowerCase() === pElmtRecherche[i].innerText.toLowerCase()) {
        if (tTags[j].bAffiche) {
          pElmtRecherche[i].style.display = 'none'
          break
        }
      }
    }
  }
}

function rechercheFiltre (pRecherche, pTypeRecherche) {
  let eltRecherche = pRecherche
  eltRecherche = eltRecherche.toLowerCase()
  let elmtRecherche
  tTags = []
  tFiltres = []
  const eltRecettes = document.getElementsByClassName('recette')
  switch (pTypeRecherche) {
    case 'ingredient' :
      elmtRecherche = document.getElementsByClassName('ingredients')
      tTags = tTagsIngredient
      tFiltres = tFiltresIngredient
      break
    case 'appareil' :
      elmtRecherche = document.getElementsByClassName('appareils')
      tTags = tTagsAppareil
      tFiltres = tFiltresAppareil
      break

    case 'ustensile' :
      elmtRecherche = document.getElementsByClassName('ustensiles')
      tTags = tTagsUstensile
      tFiltres = tFiltresUstensile
      break
  }
  for (let i = 0; i < elmtRecherche.length; i++) {
    for (let j = 0; j < tFiltres.length; j++) {
      if (eltRecherche.length > 2) {
        if (elmtRecherche[i].innerText.toLowerCase().includes(eltRecherche)) {
          if (tFiltres[j].name === elmtRecherche[i].innerText.toLowerCase()) {
            if (!tFiltres[j].bAffiche) {
              elmtRecherche[i].style.display = 'none'
              break
            } else {
              elmtRecherche[i].style.display = 'initial'
              break
            }
          }
        } else {
          elmtRecherche[i].style.display = 'none'
        }
      } else {
        if (tFiltres[j].name === elmtRecherche[i].innerText.toLowerCase()) {
          if (eltRecettes.length === 0) {
            elmtRecherche[i].style.display = 'initial'
            break
          } else {
            if (!tFiltres[j].bAffiche) {
              elmtRecherche[i].style.display = 'none'
              break
            } else {
              elmtRecherche[i].style.display = 'initial'
              break
            }
          }
        }
      }
    }
  }
  supprimerTagRecherche(elmtRecherche)
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

  eltBtn.addEventListener('click', function () {
    supprimerTag(pElt)
  })
}

function supprimerTag (pElt) {
  const ensTag = document.getElementById('ensembleTag')
  const elmtRecherche = document.getElementsByClassName('tag')
  let elmtType
  tTags = []
  for (let i = 0; i < elmtRecherche.length; i++) {
    if (elmtRecherche[i].innerText.toLowerCase() === pElt.toLowerCase()) {
      for (let j = 0; j < elmtRecherche[i].classList.length; j++) {
        switch (elmtRecherche[i].classList[j].toLowerCase()) {
          case 'ingredient' :
            elmtType = document.getElementsByClassName('ingredients')
            tTags = tTagsIngredient
            break
          case 'appareil' :
            elmtType = document.getElementsByClassName('appareils')
            tTags = tTagsAppareil
            break
          case 'ustensile' :
            elmtType = document.getElementsByClassName('ustensiles')
            tTags = tTagsUstensile
            break
        }
      }
      for (let k = 0; k < elmtType.length; k++) {
        if (pElt.toLowerCase() === elmtType[k].innerText.toLowerCase()) {
          elmtType[k].style.display = 'initial'
          break
        }
      }
      for (let l = 0; l < tTags.length; l++) {
        if (elmtRecherche[i].innerText.toLowerCase() === tTags[l].name.toLowerCase()) {
          tTags[l].bAffiche = false
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
  eltBtn.classList.add('btn-tags')
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
  let tagCourant
  let filtreCourant
  switch (pElmt) {
    case 'ingredient':
      idCollapse = document.getElementById('collapseIngredient')
      eltChildren = idCollapse.firstElementChild
      for (let i = 0; i < tIngredients.length; i++) {
        eltBtn = creerBouton('ingredients', 'ingredient', tIngredients[i])
        eltChildren.appendChild(eltBtn)
        // Création du Tag
        tagCourant = new Tag(tIngredients[i], 'ingredient', false)
        tTagsIngredient.push(tagCourant)
        // Création du Filtre
        filtreCourant = new Filtre(tIngredients[i], 'ingredient')
        tFiltresIngredient.push(filtreCourant)
      }
      break
    case 'appareil':
      idCollapse = document.getElementById('collapseAppareil')
      eltChildren = idCollapse.firstElementChild
      for (let i = 0; i < tAppareils.length; i++) {
        eltBtn = creerBouton('appareils', 'appareil', tAppareils[i])
        eltChildren.appendChild(eltBtn)
        // Création du Tag
        tagCourant = new Tag(tAppareils[i], 'appareil', false)
        tTagsAppareil.push(tagCourant)
        // Création du Filtre
        filtreCourant = new Filtre(tAppareils[i], 'appareil')
        tFiltresAppareil.push(filtreCourant)
      }
      break
    case 'ustensile':
      idCollapse = document.getElementById('collapseUstensile')
      eltChildren = idCollapse.firstElementChild
      for (let i = 0; i < tUstensiles.length; i++) {
        eltBtn = creerBouton('ustensiles', 'ustensile', tUstensiles[i])
        eltChildren.appendChild(eltBtn)
        // Création du Tag
        tagCourant = new Tag(tUstensiles[i], 'ustensile', false)
        tTagsUstensile.push(tagCourant)
        // Création du Filtre
        filtreCourant = new Filtre(tUstensiles[i], 'ustensile')
        tFiltresUstensile.push(filtreCourant)
      }
      break
  }
}

ajouteElement('ingredient')
ajouteElement('appareil')
ajouteElement('ustensile')

function ajouteEvtBoutonFiltre (pType) {
  let eltType
  switch (pType) {
    case 'ingredient' :
      eltType = document.getElementsByClassName('ingredients')
      break
    case 'appareil' :
      eltType = document.getElementsByClassName('appareils')
      break
    case 'ustensile' :
      eltType = document.getElementsByClassName('ustensiles')
      break
  }
  for (let i = 0; i < eltType.length; i++) {
    eltType[i].addEventListener('click', function () {
      creerTag(eltType[i].textContent, pType)
      switch (pType) {
        case 'ingredient' :
          for (let j = 0; j < tTagsIngredient.length; j++) {
            if (tTagsIngredient[j].name.toLowerCase() === eltType[i].textContent.toLowerCase()) {
              tTagsIngredient[j].bAffiche = true
              break
            }
          }
          break
        case 'appareil' :
          for (let j = 0; j < tTagsAppareil.length; j++) {
            if (tTagsAppareil[j].name.toLowerCase() === eltType[i].textContent.toLowerCase()) {
              tTagsAppareil[j].bAffiche = true
              break
            }
          }
          break
        case 'ustensile' :
          for (let j = 0; j < tTagsUstensile.length; j++) {
            if (tTagsUstensile[j].name.toLowerCase() === eltType[i].textContent.toLowerCase()) {
              tTagsUstensile[j].bAffiche = true
              break
            }
          }
          break
      }
      eltType[i].style.display = 'none'
      $('#collapse' + pType.charAt(0).toUpperCase() + pType.slice(1) + '').collapse('hide')
    })
  }
}

ajouteEvtBoutonFiltre('ingredient')
ajouteEvtBoutonFiltre('appareil')
ajouteEvtBoutonFiltre('ustensile')

function rechercheRecette (pRecherche) {
  let bTrouve = false
  let recetteDejaAffiche
  let eltRecherche = pRecherche
  eltRecherche = eltRecherche.toLowerCase()
  let eltRecettes = document.getElementsByClassName('recette')
  const eltAlert = document.getElementsByClassName('alert-warning')
  if (eltRecherche.length > 2) {
    for (let i = 0; i < tRecettes.length; i++) {
      eltRecettes = document.getElementsByClassName('recette')
      if (eltRecettes.length === 0) {
        eltAlert[0].style.display = 'block'
      } else {
        eltAlert[0].style.display = 'none'
      }
      for (let j = 0; j < tRecettes[i].ingredients.length; j++) {
        if ((tRecettes[i].name.toLowerCase().indexOf(eltRecherche) !== -1) || (tRecettes[i].ingredients[j].ingredient.toLowerCase().indexOf(eltRecherche) !== -1) || (tRecettes[i].description.toLowerCase().indexOf(eltRecherche) !== -1)) {
          bTrouve = true
        }
      }
      if (bTrouve) {
        bTrouve = false
        recetteDejaAffiche = document.getElementById(tRecettes[i].id)
        if (recetteDejaAffiche === null) {
          creerCarte(parseInt(tRecettes[i].id, 10))
          actualiserFiltres('ingredient')
          actualiserFiltres('appareil')
          actualiserFiltres('ustensile')
        }
      } else {
        recetteDejaAffiche = document.getElementById(tRecettes[i].id)
        if (recetteDejaAffiche !== null) {
          supprimerCarte(parseInt(tRecettes[i].id, 10))
          actualiserFiltres('ingredient')
          actualiserFiltres('appareil')
          actualiserFiltres('ustensile')
        }
      }
    }
  } else {
    eltRecettes = document.getElementsByClassName('recette')
    while (eltRecettes.length > 0) {
      supprimerCarte(parseInt(eltRecettes[eltRecettes.length - 1].id, 10))
    }
    if (eltRecettes.length === 0) {
      eltAlert[0].style.display = 'block'
    }
    rechercheFiltre('', 'ingredient')
    rechercheFiltre('', 'appareil')
    rechercheFiltre('', 'ustensile')
  }
}

document.getElementById('barreRecherche').addEventListener('input', function (e) {
  rechercheRecette(e.target.value)
})

function ajouteEvtInputFleche (pType) {
  const idFleche = document.getElementById('btn' + pType.charAt(0).toUpperCase() + pType.slice(1) + 'Fleche')
  const idFiltre = document.getElementById('btn' + pType.charAt(0).toUpperCase() + pType.slice(1) + '')
  let idInput = document.getElementById('input' + pType.charAt(0).toUpperCase() + pType.slice(1) + '')
  idFleche.addEventListener('click', function () {
    idInput = document.getElementById('input' + pType.charAt(0).toUpperCase() + pType.slice(1) + '')
    if (idInput === null) {
      idFiltre.innerHTML = '<input type="text" class="input ' + pType + '" id="input' + pType.charAt(0).toUpperCase() + pType.slice(1) + '">'
      idInput = document.getElementById('input' + pType.charAt(0).toUpperCase() + pType.slice(1) + '')
      if (pType === 'ingredient') {
        idInput.placeholder = 'Rechercher un ingrédient...'
      } else {
        idInput.placeholder = 'Rechercher un ' + pType + '...'
      }
      idInput.addEventListener('input', function (e) {
        rechercheFiltre(e.target.value, pType)
      })
    }
    idFleche.style.transform = 'rotate(180deg)'
  })
  $('#collapse' + pType.charAt(0).toUpperCase() + pType.slice(1) + '').on('hidden.bs.collapse', function () {
    if (pType === 'ingredient') {
      idFiltre.innerHTML = 'Ingrédients'
    } else {
      idFiltre.innerHTML = pType.charAt(0).toUpperCase() + pType.slice(1) + 's'
    }
    idFleche.style.transform = 'rotate(0deg)'
    rechercheFiltre('', pType)
  })
}

ajouteEvtInputFleche('ingredient')
ajouteEvtInputFleche('appareil')
ajouteEvtInputFleche('ustensile')

function actualiserFiltres (pType) {
  let eltType
  tFiltres = []
  switch (pType) {
    case 'ingredient' :
      eltType = document.getElementsByClassName('ingredients')
      tFiltres = tFiltresIngredient
      break
    case 'appareil' :
      eltType = document.getElementsByClassName('appareils')
      tFiltres = tFiltresAppareil
      break
    case 'ustensile' :
      eltType = document.getElementsByClassName('ustensiles')
      tFiltres = tFiltresUstensile
      break
  }

  if (tRecettesAffichees.length > 0) {
    for (let e = 0; e < eltType.length; e++) {
      eltType[e].style.display = 'none'
    }
    for (let f = 0; f < tFiltres.length; f++) {
      tFiltres[f].bAffiche = false
    }

    for (let i = 0; i < tRecettesAffichees.length; i++) {
      for (let k = 0; k < tFiltres.length; k++) {
        switch (pType) {
          case 'ingredient' :
            for (let j = 0; j < tRecettesAffichees[i].tIngredient.length; j++) {
              if (tRecettesAffichees[i].tIngredient[j].ingredient.toLowerCase() === tFiltres[k].name.toLowerCase()) {
                tFiltres[k].bAffiche = true
                break
              }
            }
            break
          case 'appareil' :
            if (tRecettesAffichees[i].appareil.toLowerCase() === tFiltres[k].name.toLowerCase()) {
              tFiltres[k].bAffiche = true
              break
            }
            break
          case 'ustensile' :
            for (let j = 0; j < tRecettesAffichees[i].tUstensiles.length; j++) {
              if (tRecettesAffichees[i].tUstensiles[j].toLowerCase() === tFiltres[k].name.toLowerCase()) {
                tFiltres[k].bAffiche = true
                break
              }
            }
            break
        }
      }
    }

    for (let i = 0; i < tFiltres.length; i++) {
      for (let j = 0; j < eltType.length; j++) {
        if (eltType[j].textContent.toLowerCase() === tFiltres[i].name.toLowerCase()) {
          if (tFiltres[i].bAffiche) {
            eltType[j].style.display = 'initial'
            break
          }
        }
      }
    }
  }
}
function supprimerCarte (pId) {
  const idRecettes = document.getElementById('les-recettes')
  const idRecetteSupprimer = document.getElementById(pId)

  for (let i = 0; i < tRecettesAffichees.length; i++) {
    if (tRecettesAffichees[i].id === pId) {
      tRecettesAffichees.splice(i, 1)
      break
    }
  }

  if (idRecetteSupprimer !== null) {
    idRecettes.removeChild(idRecetteSupprimer)
  }
}

function creerRecette (pId) {
  const recetteCourante = new Recette()
  let ingredientCourant
  for (let i = 0; i < tRecettes.length; i++) {
    if (tRecettes[i].id === pId) {
      recetteCourante.id = pId
      recetteCourante.name = tRecettes[i].name
      recetteCourante.time = tRecettes[i].time
      recetteCourante.description = tRecettes[i].description
      recetteCourante.appareil = tRecettes[i].appliance
      for (let j = 0; j < tRecettes[i].ingredients.length; j++) {
        ingredientCourant = new Ingredient()
        ingredientCourant.ingredient = tRecettes[i].ingredients[j].ingredient
        ingredientCourant.quantity = tRecettes[i].ingredients[j].quantity
        if (tRecettes[i].ingredients[j].unit === undefined) {
          ingredientCourant.unit = ''
        } else {
          ingredientCourant.unit = tRecettes[i].ingredients[j].unit
        }
        recetteCourante.tIngredient.push(ingredientCourant)
      }
      for (let j = 0; j < tRecettes[i].ustensils.length; j++) {
        if (tRecettes[i].ustensils[j] !== undefined) {
          recetteCourante.tUstensiles.push(tRecettes[i].ustensils[j])
        }
      }
      break
    }
  }
  return recetteCourante
}

function creerCarte (pId) {
  let ingredientCourant
  let bRecettePresente = false
  const recetteCourante = creerRecette(pId)

  for (let i = 0; i < tRecettesAffichees.length; i++) {
    if (tRecettesAffichees[i].id === pId) {
      bRecettePresente = true
      break
    }
  }

  if (!bRecettePresente) {
    tRecettesAffichees.push(recetteCourante)
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

  for (let i = 0; i < recetteCourante.tIngredient.length; i++) {
    ingredientCourant = new Ingredient()
    ingredientCourant.ingredient = recetteCourante.tIngredient[i].ingredient
    if (recetteCourante.tIngredient[i].quantity !== undefined) {
      ingredientCourant.quantity = recetteCourante.tIngredient[i].quantity
    }
    if (recetteCourante.tIngredient[i].unit !== undefined) {
      ingredientCourant.unit = recetteCourante.tIngredient[i].unit
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
