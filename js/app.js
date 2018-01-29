var initialCats = [
        {
            clickCount : 0,
            name : 'Tabby',
            imgSrc : 'img/434164568_fea0ad4013_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/bigtallguy/434164568',
			nickNames: [{name: "Thing2"}, {name: "Thing3"}, {name: "Thing4"}, {name: "Thing5"}]
        },
        {
            clickCount : 0,
            name : 'Tiger',
            imgSrc : 'img/4154543904_6e2428c421_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/xshamx/4154543904',
			nickNames: [{name: "Tigre"}, {name: "Tyga"}]
        },
        {
            clickCount : 0,
            name : 'Scaredy',
            imgSrc : 'img/22252709_010df3379e_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/kpjas/22252709',
			nickNames: [{name: "Miedoso"}]
        },
        {
            clickCount : 0,
            name : 'Shadow',
            imgSrc : 'img/1413379559_412a540d29_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/malfet/1413379559',
			nickNames: [{name: "Darkness"}]
        },
        {
            clickCount : 0,
            name : 'Sleepy',
            imgSrc : 'img/9648464288_2516b35537_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/onesharp/9648464288',
			nickNames: [{name: "Dormilon"}]
        }
    ];

var Cat = function(data) {
	this.clickCount = ko.observable(data.clickCount);
	this.name = ko.observable(data.name);
	this.imgSrc = ko.observable(data.imgSrc);
	this.imgAttribution = ko.observable(data.imgAttribution);
	this.nickNames = ko.observableArray(data.nickNames);
	
	this.title = ko.computed(function() {
		var title;
		var clicks = this.clickCount();
		if(this.clickCount() < 10){
			title="Newborn";
		} else if (this.clickCount() < 50) {
			title="Infant";
		}else if (this.clickCount() < 100) {
			title="Child";
		}else if (this.clickCount() < 200) {
			title="Teen";
		}
		return title;
	}, this);
}

var viewModel = function() {
	var self = this;
	
	this.catList = ko.observableArray([]);
	
	initialCats.forEach(function(catItem) {
		self.catList.push( new Cat(catItem));
	})
	
	this.currentCat = ko.observable( this.catList()[0] );
	
	this.setCurrentCat = function(clickedCat) {
		self.currentCat(clickedCat)
	};
	
	this.incrementCounter = function() {
			self.currentCat().clickCount(self.currentCat().clickCount() + 1);
	};
	
}

ko.applyBindings(new viewModel());