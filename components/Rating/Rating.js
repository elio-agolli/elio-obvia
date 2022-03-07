var Rating = function (_props, _hideComponents = false) {

    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
        }
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
        }

        const ratingStars = [...document.getElementsByClassName("fa-star")];
        function executeRating(stars) {
            const starClassActive = "fa fa-star checked";
            const starClassInactive = "fa fa-star";
            const starsLength = stars.length;
            let i;
            stars.map((star) => {
                star.onclick = () => {
                i = stars.indexOf(star);
        
                if (star.className===starClassInactive) {        
                    for (i; i >= 0; --i) stars[i].className = starClassActive;
                } else {
                    for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
                }
                };
            });     
            }
        executeRating(ratingStars)
}

this.template = function () {
    return "<div id='" + this.domID + "' class='rating'>" +
        "<p class='rating-header'>Product Rating</p>" +
        "<span class='fa fa-star'></span>" +
        "<span class='fa fa-star'></span>" +
        "<span class='fa fa-star'></span>" +
        "<span class='fa fa-star'></span>" +
        "<span class='fa fa-star'></span>" +
    "</div>";
};

let _defaultParams = {
};
_props = extend(false, false, _defaultParams, _props);


let r = Parent.call(this, _props, _hideComponents);
return r;

}
Rating.prototype.ctor = 'Rating';