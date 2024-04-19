window.onload = function () {
    let costs = document.getElementsByClassName("cartPrice")
    let totalelem = document.getElementById("total")
    if (totalelem) {
        let total = 0
        for(let i = 0; i < costs.length; i++){
            total += parseFloat(costs[i].getAttribute('cost')) * parseFloat(costs[i].getAttribute('amt'))
        }
        console.log(total)
        totalelem.innerHTML = "Total: $"+total.toString()
    }
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
}