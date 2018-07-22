import axios from 'axios';
import { key, proxy } from '../config';



export default class Recipe {
	constructor(id){
		this.id = id;
	}


// data modal for recipe
    async getRecipe(){
        // const proxy = 'https://cors-anywhere.herokuapp.com/';
        // const key = '4ba13ea7bd24ebd1f8c47ab7bfed83dc';
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            // this.result = res.data.recipes;
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.image = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
             this.ingredients = res.data.recipe.ingredients;
            console.log(res);
        }catch (error) {
            console.log(error);
            alert('something went wrong...');
        }
    }

    calcTime(){
        // for every 3 ingredients we need 15 minutes
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }
}

// look for controller next
