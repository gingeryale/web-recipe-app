import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';

// global state
// search obj, Current Recipe Obj, Shopping list obj, liked recipes,
const state = {};

// SEARCH Controller
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();

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

// event delagation choose the closest to the target 
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

        // create new recipe obj
        state.recipe = new Recipe(id);
        try {
            // get recipe data
            await state.recipe.getRecipe(); // will return a promise use async

            // calc servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe
            console.log(state.recipe);
        }
       catch(err){
        alert('error porcessing recipe');
       }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe)
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));