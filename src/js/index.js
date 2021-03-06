import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as likesView from './views/likesView';
import * as listView from './views/listView';


// global state
// search obj, Current Recipe Obj, Shopping list obj, liked recipes,
const state = {};


// SEARCH Controller
const controlSearch = async () => {
    // 1) Get query from view
    recipeView.clearRecipe();
    listView.clearListView();
    
    const query = searchView.getInput();
    // TESTING
    //const query = 'pizza';

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await state.search.getResults();
    
            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Something wrong with the search...');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// TESTING
// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    //console.log(e.target);
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        //console.log(goToPage);
    }
});


// Recipe Controller

// testing
// const r = new Recipe(46956);
//     r.getRecipe();
//     console.log(r);
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    console.log(id);
    if(id){
        // prepare UI for change
        renderLoader(elements.recipe);

        // highlightedSelection
        if (state.search) searchView.highlightedSelection(id);

        // create new recipe obj
        state.recipe = new Recipe(id);
        // TESTING
        //window.r = state.recipe;
        try {
            // get recipe data
            await state.recipe.getRecipe(); // will return a promise use async
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            // calc servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe
            console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
        }
       catch(err){
        console.log(err);
        alert('error porcessing recipe');
       }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe)
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


//list controller

const controlList = () => {
    // create a list if none exist
        if(!state.list) state.list = new List();
    // add each ingredient to list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// handle deleting from list items
elements.shopping.addEventListener('click', e=>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle delete
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        // delte from state
        state.list.deleteItem(id);
        // delete UI
        listView.deleteItem(id);
        // handle update count
    } else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
})


// Like Controller
//state.likes = new Likes();
//likesView.toggleLikeMenu(state.likes.getNumberLikes());
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
        const currentID = state.recipe.id;
         // No likes yet
        if(!state.likes.isLiked(currentID)) {
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image
            );
       
            // toggle the like btn
            likesView.toggleLikeBtn(true);
            console.log(state.likes);
            // add like to UI list
            likesView.renderLike(newLike);

        } else {
            // likes already exist

            // remove from state
            state.likes.deleteLike(currentID);
            // toggle the button
            likesView.toggleLikeBtn(false);
            // remove from UI
            likesView.deleteLike(currentID);
             console.log(state.likes);
        }
        likesView.toggleLikeMenu(state.likes.getNumberLikes());
}

// restore liked recipes localStorage on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like button
    likesView.toggleLikeMenu(state.likes.getNumberLikes());

    // render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


// attach e.lsitener and update
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // increase
         state.recipe.updateServings('inc');
         recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        // add ing to shopping list
        controlList();
    }else if (e.target.matches('.recipe__love, .recipe__love *')){
        // like controller
        controlLike();
    }
    //console.log(state.recipe);
});

// const l = new List();
// window.l = l;
//window.l = new List();






