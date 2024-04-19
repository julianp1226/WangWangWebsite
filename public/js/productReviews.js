window.onload = function() {
    // Accessing the products array and reviews object from the rendered HTML
    var ratingList = document.getElementsByClassName('rating');
    ratingList = [...ratingList,...document.getElementsByClassName('simRating')]
    for (var i = 0; i < ratingList.length; i++){
        let rating = ratingList[i];
        let reviews = JSON.parse(rating.getAttribute('reviews'))
        console.log(reviews)
        if (reviews.length == 0) {
            rating.innerHTML = "-"
        } else{
            let starRating = 0
            for (var j = 0; j < reviews.length; j++){
                if(reviews[j].stars){
                    starRating += parseInt(reviews[j].stars)
                }
                
            }
            starRating /= reviews.length
            rating.innerHTML = starRating.toPrecision(2)
        }
    }

};