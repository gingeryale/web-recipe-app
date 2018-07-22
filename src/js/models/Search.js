import axios from 'axios';
import {key, proxy } from '../config';


export default class Search {
	constructor(query){
		this.query = query;
	}



    async getResults(query){
        // const proxy = 'https://cors-anywhere.herokuapp.com/';
        // const key = '4ba13ea7bd24ebd1f8c47ab7bfed83dc';
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
        }catch (error) {
            alert(error);
        }
    }
}

