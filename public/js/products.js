textInput = document.getElementById("num")
plusButton = document.getElementById("up")
minusButton = document.getElementById("down")
reviewLink = document.getElementById("giveReview")
product = document.getElementById("product")
main=document.getElementById("main")
stars=0
function down(event) {
    event.preventDefault();
    if (!textInput.value || parseInt(textInput.value) < 2){
        textInput.value = 2
    }
    textInput.value = parseInt(textInput.value) - 1;
}
function up(event) {
    event.preventDefault();
    if (!textInput.value){
        textInput.value = "0"
    }
    textInput.value = (parseInt(textInput.value) + 1).toString();
}
function reset(event) {
    event.preventDefault();
    if (!textInput.value || !parseInt(textInput.value) || parseInt(textInput.value) <1){
        textInput.value = "1"
    }
}
function closeBox(event){
    event.preventDefault();
    blockBox = document.getElementById("coverBox")
    blockBox.remove();
    infoBox = document.getElementById("infoBox");
    infoBox.remove();
}
function newReview(event) {
    event.preventDefault();
    blockBox = document.createElement("span")
    blockBox.setAttribute("class","coverBox");
    blockBox.setAttribute("id","coverBox");
    main.appendChild(blockBox)

    infoBox = document.createElement("div");
    infoBox.setAttribute("class","infoBox");
    infoBox.setAttribute("id","infoBox");
    main.appendChild(infoBox)

    xOut = document.createElement("a")
    xOut.setAttribute("href","/")
    xOut.setAttribute("class","xOut")
    xOut.innerHTML = "X"
    xOut.addEventListener("click",closeBox)
    infoBox.appendChild(xOut)

    title =  document.createElement("h1")
    title.innerHTML = "Leave A Review!"
    infoBox.appendChild(title)
    reviewForm = document.createElement("form")
    reviewForm.innerHTML = `<p id="ratingTex">Stars:</p>
    <div class="star-rating">
    <input type="radio" id="star5" name="rating" value="5">
    <label for="star5"></label>
    <input type="radio" id="star4" name="rating" value="4">
    <label for="star4"></label>
    <input type="radio" id="star3" name="rating" value="3">
    <label for="star3"></label>
    <input type="radio" id="star2" name="rating" value="2">
    <label for="star2"></label>
    <input type="radio" id="star1" name="rating" value="1">
    <label for="star1"></label>
    </div>
    <label for="text" id="moreText">Tell us more! (Optional)</label>
    <textarea id="reviewText" name="reviewText"></textarea>
    <button id="ratingbutton">Submit</button>`
    reviewForm.setAttribute("id","reviewForm")
    infoBox.appendChild(reviewForm)
    revSub = document.getElementById("reviewForm")
    console.log(revSub)
    revSub.addEventListener("submit",closeBox)
}
plusButton.addEventListener("click",up)
minusButton.addEventListener("click",down)
textInput.addEventListener("blur",reset)
reviewLink.addEventListener("click",newReview)