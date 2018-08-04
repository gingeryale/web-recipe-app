export default class Likes {
	constructor() {
		this.likes = [];
	}
	addLike(id, title, author, img){
		const like = {id, title, author, img};
		this.likes.push(like);

		// persist data localsStorage
		this.persistData();
		return like;
	}
	deleteLike(id){
		const index = this.likes.findIndex(el => el.id === id);
		this.likes.splice(index, 1);

		// persist 
		this.persistData();
	}

	isLiked(id) {
		return this.likes.findIndex(el => el.id === id) !== -1;
	}

	getNumberLikes() {
		return this.likes.length;
	}

	persistData() {
		localStorage.setItem('likes', JSON.stringify(this.likes));
	}
	readStorage() {
		const store = JSON.parse(localStorage.getItem('likes'));
		// store likes from the localStorage
		if(store) this.likes = store;
	}
}