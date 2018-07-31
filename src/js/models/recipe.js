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

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'lbs' ];
        // unify the units to be the same
        const newIngredients = this.ingredients.map(el => {
            
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, index)=>{
                ingredient = ingredient.replace(unit, unitsShort[index]);
            });

            // remove /()/
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            // parse ingredients into count, unit and item
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

            let objIng;
            // ingredient object

            if(unitIndex > -1) {
                // found a unit truthy
                const arrCount = arrIng.slice(0, unitIndex); // ex. 4 1/2 cups 
                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng={
                    count,
                    unit: arrIng[unitIndex],
                    ingredient:arrIng.slice(unitIndex+1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // no unit but 1st elm is number

                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // no unit, no number falsey
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }












}

// look for controller next
