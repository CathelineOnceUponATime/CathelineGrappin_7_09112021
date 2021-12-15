/* eslint-env jquery */
import { recipes } from './recipes.js'
const tRecettes = recipes

class Ingredient {
  constructor (name, quantity, unit) {
    this.name = name
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
  constructor (name, type, bAffiche, bTrouve) {
    this.name = name
    this.type = type
    this.bAffiche = bAffiche
    this.bTrouve = bTrouve
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

const tTagsIngredient = []
const tTagsAppareil = []
const tTagsUstensile = []
const tTagsAffiches = []

let tFiltres = []
const tFiltresIngredient = []
const tFiltresAppareil = []
const tFiltresUstensile = []

let recherchePrincipal = ''
let bRecherche = false
const idBarreRecherche = document.getElementById('barreRecherche')

/*
  Fonction SupprimerToutesLesRecettes ne prenant aucun argument
  - permet de faire apparaître le message "aucune recette ne correspond aux critères saisis"
  - permet de supprimer toutes les recettes encore affichées s'il n'y a plus de tag, ni de mot clé
*/
function supprimerToutesLesRecettes () {
  const eltRecettes = document.getElementsByClassName('recette')
  const eltAlert = document.getElementsByClassName('alert-warning')

  if ((tTagsAffiches.length === 0) && (recherchePrincipal.length === 0)) {
    while (tRecettesAffichees.length > 0) {
      supprimerCarte(parseInt(tRecettesAffichees[tRecettesAffichees.length - 1].id, 10))
    }
  }
  if (eltRecettes.length === 0) {
    eltAlert[0].style.display = 'block'
  } else {
    eltAlert[0].style.display = 'none'
  }
}

/*
  Fonction RemplirIngAppUst prenant un paramètre, le type de filtre.
  - permet de remplir les tableaux d'objets pour ensuite constituer les filtres.
*/
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

/*
  Différents appels à la fonction ci-dessus RemplirIngAppUst
*/
remplirIngAppUst('ingredient')
remplirIngAppUst('appareil')
remplirIngAppUst('ustensile')

/*
  Fonction SupprimerToutTagRecherche prenant un paramètre facultatif.
  - pRecherche est une chaine de caractères correspondant à la recherche effectuée sur l'un des filtres.
  - permet de faire appel à la fonction SupprimerTagRecherche pour tous les filtres
*/
function supprimerToutTagRecherche (pRecherche = '') {
  let elmtRecherche = document.getElementsByClassName('ingredients')
  supprimerTagRecherche(elmtRecherche, tTagsIngredient, pRecherche)
  elmtRecherche = document.getElementsByClassName('appareils')
  supprimerTagRecherche(elmtRecherche, tTagsAppareil, pRecherche)
  elmtRecherche = document.getElementsByClassName('ustensiles')
  supprimerTagRecherche(elmtRecherche, tTagsUstensile, pRecherche)
}

/*
  Fonction SupprimerTagRecherche prenant 3 paramètres.
  - un pElmtRecherche qui est le tableau rempli des élèments des filtres voulu
  - ptTags qui est le tableau de tags
  - pRecherche qui est une chaine de caractères correspondant à la recherche effectuée sur l'un des filtres
  - permet d'enlever l'affichage des boutons dont les tags sont présents dans les filtres
*/
function supprimerTagRecherche (pElmtRecherche, ptTags, pRecherche) {
  for (let i = 0; i < pElmtRecherche.length; i++) {
    for (let j = 0; j < ptTags.length; j++) {
      if (ptTags[j].name.toLowerCase() === pElmtRecherche[i].innerText.toLowerCase()) {
        if (ptTags[j].bAffiche) {
          pElmtRecherche[i].style.display = 'none'
          break
        }
      }
    }
  }
  // S'il n'y a aucune recherche dans les filtres, aucun tag affiché et aucun mot clé
  // dans ce cas tous les filtres sont affichés.
  if ((pRecherche.length === 0) && (recherchePrincipal.length === 0) && (tTagsAffiches.length === 0)) {
    for (let i = 0; i < pElmtRecherche.length; i++) {
      pElmtRecherche[i].style.display = 'initial'
    }
  }
}

/*
  Fonction FiltreTag prenant en paramètre un Tag.
  -  permet en parcourant les différents filtres si l'un d'eux correspond au tag en paramètre
  si c'est le cas, la création de la recette est affichée puis un rafraîchissement des filtres est effectué
*/
function filtreTag (pTag) {
  let recetteDejaAffiche
  let bRecettePresente
  for (let i = 0; i < tRecettes.length; i++) {
    bRecettePresente = false
    switch (pTag.type) {
      case 'ingredient' :
        for (let j = 0; j < tRecettes[i].ingredients.length; j++) {
          if (tRecettes[i].ingredients[j].ingredient.toLowerCase() === pTag.name.toLowerCase()) {
            bRecettePresente = true
            break
          }
        }
        break
      case 'appareil' :
        if (tRecettes[i].appliance.toLowerCase() === pTag.name.toLowerCase()) {
          bRecettePresente = true
        }
        break
      case 'ustensile' :
        for (let j = 0; j < tRecettes[i].ustensils.length; j++) {
          if (tRecettes[i].ustensils[j].toLowerCase() === pTag.name.toLowerCase()) {
            bRecettePresente = true
            break
          }
        }
        break
    }
    if (bRecettePresente) {
      recetteDejaAffiche = document.getElementById(tRecettes[i].id)
      if (recetteDejaAffiche === null) {
        creerCarte(parseInt(tRecettes[i].id, 10))
        actualiserFiltres('ingredient')
        actualiserFiltres('appareil')
        actualiserFiltres('ustensile')
      }
    }
  }
  supprimerToutTagRecherche()
}

/*
  Fonction SupprimeRecettePasTag prenant aucun paramètre.
  - permet de supprimer les recettes affichées qui n'ont pas les tags voulus.
  - elle relance la recherche d'une recette par mot clé si le tag n'est pas le dernier évènement.
*/
function supprimeRecettePasTag () {
  let bTrouve = false
  if ((recherchePrincipal.length > 0) && (bRecherche)) {
    bRecherche = false
    rechercheRecette(recherchePrincipal)
  }
  for (let j = 0; j < tRecettesAffichees.length; j++) {
    for (let k = 0; k < tTagsAffiches.length; k++) {
      bTrouve = false
      switch (tTagsAffiches[k].type) {
        case 'ingredient' :
          for (let l = 0; l < tRecettesAffichees[j].tIngredient.length; l++) {
            if (tTagsAffiches[k].name.toLowerCase() === tRecettesAffichees[j].tIngredient[l].name.toLowerCase()) {
              bTrouve = true
              tTagsAffiches[k].bTrouve = true
              break
            }
          }
          break
        case 'appareil' :
          if (tTagsAffiches[k].name.toLowerCase() === tRecettesAffichees[j].appareil.toLowerCase()) {
            bTrouve = true
            tTagsAffiches[k].bTrouve = true
            break
          }
          break
        case 'ustensile' :
          for (let l = 0; l < tRecettesAffichees[j].tUstensiles.length; l++) {
            if (tTagsAffiches[k].name.toLowerCase() === tRecettesAffichees[j].tUstensiles[l].toLowerCase()) {
              bTrouve = true
              tTagsAffiches[k].bTrouve = true
              break
            }
          }
          break
      }
    }
    for (let e = 0; e < tTagsAffiches.length; e++) {
      if (tTagsAffiches[e].bTrouve === undefined) {
        bTrouve = false
      }
    }
    if (!bTrouve) {
      if (tTagsAffiches.length > 0) {
        supprimerCarte(parseInt(tRecettesAffichees[j].id, 10))
        j--
        actualiserFiltres('ingredient')
        actualiserFiltres('appareil')
        actualiserFiltres('ustensile')
      }
    }
    for (let e = 0; e < tTagsAffiches.length; e++) {
      tTagsAffiches[e].bTrouve = undefined
    }
  }
  supprimerToutTagRecherche()
  supprimerToutesLesRecettes()
}

/*
  Fonction RechercheFiltre prenant deux paramètres.
  - permet de rechercher dans les filtres un mot clé saisie.
  - mettre en invisible les mots ne correspondants pas à la recherche.
*/
function rechercheFiltre (pRecherche, pTypeRecherche) {
  let eltRecherche = pRecherche
  eltRecherche = eltRecherche.toLowerCase()
  let elmtRecherche
  tFiltres = []
  // const eltRecettes = document.getElementsByClassName('recette')
  switch (pTypeRecherche) {
    case 'ingredient' :
      elmtRecherche = document.getElementsByClassName('ingredients')
      tFiltres = tFiltresIngredient
      break
    case 'appareil' :
      elmtRecherche = document.getElementsByClassName('appareils')
      tFiltres = tFiltresAppareil
      break

    case 'ustensile' :
      elmtRecherche = document.getElementsByClassName('ustensiles')
      tFiltres = tFiltresUstensile
      break
  }
  for (let i = 0; i < elmtRecherche.length; i++) {
    for (let j = 0; j < tFiltres.length; j++) {
      if (elmtRecherche[i].innerText.toLowerCase().includes(eltRecherche)) {
        if (tFiltres[j].name === elmtRecherche[i].innerText.toLowerCase()) {
          if (tFiltres[j].bAffiche) {
            elmtRecherche[i].style.display = 'initial'
            break
          } else {
            elmtRecherche[i].style.display = 'none'
            break
          }
        }
      } else {
        elmtRecherche[i].style.display = 'none'
        break
      }
    }
  }
  supprimerToutTagRecherche(pRecherche)
}

/*
  fonction CreerTag prenant deux paramètres.
  - permet de créer le tag dans le DOM
*/
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

/*
  fonciton SupprimerTag prenant en paramètre un pElt.
  - permet de supprimer le tag du tableau des tags affichés
  - et repasser en bAffiche a faux dans le tableau des tags du type correspondant
  - faire apparaitre le tag dans les filtres
  - le supprimer du DOM
*/
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
            for (let l = 0; l < tTagsIngredient.length; l++) {
              if (elmtRecherche[i].innerText.toLowerCase() === tTagsIngredient[l].name.toLowerCase()) {
                tTagsIngredient[l].bAffiche = false
                break
              }
            }
            break
          case 'appareil' :
            elmtType = document.getElementsByClassName('appareils')
            for (let l = 0; l < tTagsAppareil.length; l++) {
              if (elmtRecherche[i].innerText.toLowerCase() === tTagsAppareil[l].name.toLowerCase()) {
                tTagsAppareil[l].bAffiche = false
                break
              }
            }
            break
          case 'ustensile' :
            elmtType = document.getElementsByClassName('ustensiles')
            for (let l = 0; l < tTagsUstensile.length; l++) {
              if (elmtRecherche[i].innerText.toLowerCase() === tTagsUstensile[l].name.toLowerCase()) {
                tTagsUstensile[l].bAffiche = false
                break
              }
            }
            break
        }
      }
      for (let k = 0; k < elmtType.length; k++) {
        if (pElt.toLowerCase() === elmtType[k].innerText.toLowerCase()) {
          elmtType[k].style.display = 'initial'
          break
        }
      }
      for (let e = 0; e < tTagsAffiches.length; e++) {
        if (elmtRecherche[i].innerText.toLowerCase() === tTagsAffiches[e].name.toLowerCase()) {
          tTagsAffiches.splice(e, 1)
          break
        }
      }
      for (let e = 0; e < tTagsAffiches.length; e++) {
        filtreTag(tTagsAffiches[e])
      }
      ensTag.removeChild(elmtRecherche[i])
      break
    }
  }
  bRecherche = true
  supprimeRecettePasTag()
}

/*
  Fonction CreerBouton prenant 3 paramètres.
  - permet de créer chaque bouton dans le DOM
  - chaque bouton correspondant à un filtre et à un futur tag
*/
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

/*
  Fonction AjouteElement prenant un paramètre.
  - permet d'ajouter dans chaque collapse un bouton correspondant à un filtre.
*/
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
        filtreCourant = new Filtre(tIngredients[i], 'ingredient', true)
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
        filtreCourant = new Filtre(tAppareils[i], 'appareil', true)
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
        filtreCourant = new Filtre(tUstensiles[i], 'ustensile', true)
        tFiltresUstensile.push(filtreCourant)
      }
      break
  }
}

ajouteElement('ingredient')
ajouteElement('appareil')
ajouteElement('ustensile')

/*
  Fonction AjouteEvtBoutonFiltre prenant un paramètre.
  - permet d'ajouter un évènement au clic sur un filtre pour la création du Tag.
*/
function ajouteEvtBoutonFiltre (pType) {
  let eltType
  let tagCourant = new Tag()
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
      tagCourant = new Tag()
      tagCourant.name = eltType[i].textContent
      tagCourant.type = pType
      tTagsAffiches.push(tagCourant)
      filtreTag(tagCourant)
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
      bRecherche = true
      supprimeRecettePasTag()
    })
  }
}

ajouteEvtBoutonFiltre('ingredient')
ajouteEvtBoutonFiltre('appareil')
ajouteEvtBoutonFiltre('ustensile')

/*
  Fonction RechercheRecette prenant un paramètre.
  - permet de créer ou supprimer une recette correspondant au mot clé recherché.
*/
function rechercheRecette (pRecherche) {
  let bTrouve = false
  let recetteDejaAffiche
  let eltRecherche = pRecherche
  eltRecherche = eltRecherche.toLowerCase()
  let eltRecettes = document.getElementsByClassName('recette')
  const eltAlert = document.getElementsByClassName('alert-warning')
  recherchePrincipal = pRecherche
  if (eltRecherche.length > 2) {
    eltRecettes = document.getElementsByClassName('recette')
    if (eltRecettes.length === 0) {
      eltAlert[0].style.display = 'block'
    } else {
      eltAlert[0].style.display = 'none'
    }
    tRecettes.forEach(recette => {
      recette.ingredients.forEach(unIngredient => {
        if ((recette.name.toLowerCase().indexOf(eltRecherche) !== -1) || (unIngredient.ingredient.toLowerCase().indexOf(eltRecherche) !== -1) || (recette.description.toLowerCase().indexOf(eltRecherche) !== -1)) {
          bTrouve = true
        }
      })
      if (bTrouve) {
        bTrouve = false
        recetteDejaAffiche = document.getElementById(recette.id)
        if (recetteDejaAffiche === null) {
          creerCarte(parseInt(recette.id, 10))
        }
      } else {
        recetteDejaAffiche = document.getElementById(recette.id)
        if (recetteDejaAffiche !== null) {
          supprimerCarte(parseInt(recette.id, 10))
        }
      }
    })
    actualiserFiltres('ingredient')
    actualiserFiltres('appareil')
    actualiserFiltres('ustensile')
    if (tTagsAffiches.length > 0) {
      supprimeRecettePasTag()
    }
  } else {
    if (tTagsAffiches.length === 0) {
      supprimerToutesLesRecettes()
      rechercheFiltre('', 'ingredient')
      rechercheFiltre('', 'appareil')
      rechercheFiltre('', 'ustensile')
    } else {
      tTagsAffiches.forEach(tag => {
        filtreTag(tag)
      })
      supprimeRecettePasTag()
    }
  }
}

/*
  Appel qui ajoute l'évènement sur l'input pour la recherche d'une recette par rapport au mot clé entré.
*/
idBarreRecherche.addEventListener('input', function (e) {
  rechercheRecette(e.target.value)
})

/*
  Evènement permettant de supprimer le comportement par défaut de la touche entrée sur l'input.
*/
idBarreRecherche.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    if (e.preventDefault) {
      e.preventDefault()
      e.stopPropagation()
    } else {
      e.cancelBubble = true
    }
  }
})

/*
  Fonction AjouteEvtInputFleche prenant un paramètre.
  - permet au clic sur la flèche du filtre qu'elle pivote, et rajoute un input à la place du texte et inversement.
*/
function ajouteEvtInputFleche (pType) {
  const idFleche = document.getElementById('btn' + pType.charAt(0).toUpperCase() + pType.slice(1) + 'Fleche')
  const idFiltre = document.getElementById('btn' + pType.charAt(0).toUpperCase() + pType.slice(1) + '')
  let input
  let idInput = document.getElementById('input' + pType.charAt(0).toUpperCase() + pType.slice(1) + '')
  idFleche.addEventListener('click', function () {
    idInput = document.getElementById('input' + pType.charAt(0).toUpperCase() + pType.slice(1) + '')
    if (idInput === null) {
      input = document.createElement('input')
      input.id = 'input' + pType.charAt(0).toUpperCase() + pType.slice(1) + ''
      input.classList.add('input')
      input.classList.add(pType)
      input.type = 'text'
      idFiltre.innerHTML = ''
      idFiltre.parentElement.insertBefore(input, idFleche)
      input.style.borderRadius = '0'
      idFiltre.style.width = '0%'
      idInput = document.getElementById('input' + pType.charAt(0).toUpperCase() + pType.slice(1) + '')
      if (pType === 'ingredient') {
        idInput.placeholder = 'Rechercher un ingrédient...'
      } else {
        idInput.placeholder = 'Rechercher un ' + pType + '...'
      }
      idInput.addEventListener('input', function (e) {
        rechercheFiltre(e.target.value, pType)
      })
      idInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          if (e.preventDefault) {
            e.preventDefault()
            e.stopPropagation()
          } else {
            e.cancelBubble = true
          }
        }
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
    idFiltre.parentElement.removeChild(idInput)
    idFiltre.style.width = '90%'
    idFleche.style.transform = 'rotate(0deg)'
    rechercheFiltre('', pType)
  })
}

ajouteEvtInputFleche('ingredient')
ajouteEvtInputFleche('appareil')
ajouteEvtInputFleche('ustensile')

/*
  Fonction ActualiserFiltres prenant un paramètre.
  - permet d'afficher uniquement les filtres correspondants aux différentes recettes affichées et supprimer les autres.
*/
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
              if (tRecettesAffichees[i].tIngredient[j].name.toLowerCase() === tFiltres[k].name.toLowerCase()) {
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

/*
  Fonction SupprimerCarte prenant un paramètre.
  - permet de supprimer la recette avec l'id du DOM et du tableau des recettes affichées.
*/
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
/*
  Fonction CreerRecette prenant un paramètre.
  - permet de créer l'objet Recette avec tous les attributs correspondants à celle-ci.
*/
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
        ingredientCourant.name = tRecettes[i].ingredients[j].ingredient
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

/*
  Fonction CreerCarte prenant un paramètre.
  - permet de créer et d'afficher la recette dans le DOM.
*/
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
    ingredientCourant.name = recetteCourante.tIngredient[i].name
    if (recetteCourante.tIngredient[i].quantity !== undefined) {
      ingredientCourant.quantity = recetteCourante.tIngredient[i].quantity
    }
    if (recetteCourante.tIngredient[i].unit !== undefined) {
      ingredientCourant.unit = recetteCourante.tIngredient[i].unit
    }
    creerIngredient(ingredientCourant, recetteIngredient)
  }
}
/*
  Fonction CreerIngredient prenant deux paramètres.
  - permet d'afficher chaque ingredient dans le DOM sur la carte de la recette.
*/
function creerIngredient (pIngredientCourant, pDivAjout) {
  const recetteIngredient = document.createElement('p')
  recetteIngredient.classList.add('recette--detail--ingredient')
  recetteIngredient.innerHTML = '<span class="font-weight-bold">' + pIngredientCourant.name
  if (pIngredientCourant.quantity !== undefined) {
    recetteIngredient.innerHTML += ' : </span>' + pIngredientCourant.quantity
  }
  if (pIngredientCourant.unit !== undefined) {
    recetteIngredient.innerHTML += ' ' + pIngredientCourant.unit
  }
  pDivAjout.appendChild(recetteIngredient)
}
