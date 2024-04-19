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
    let blockBox = document.getElementById("coverBox")
    blockBox.remove();
    let infoBox = document.getElementById("infoBox");
    infoBox.remove();
}
function submitReview(event){
    event.preventDefault();
    let errMessage = document.getElementById("err");
    let starval = document.querySelector('input[name="rating"]:checked')
    let reviewText = document.getElementById("reviewText").value
    let url = window.location.href
    let id = product.getAttribute("prodid")
    if (!starval){
        errMessage.innerText = "Error: Please Provide A Rating"
    }else{
        errMessage.innerText = ""
        //Review should be fine, now submit!
        let submitForm = document.createElement("form")
        submitForm.innerHTML = "<input type=\"hidden\" name=\"rating\" value=\""+starval.value.toString()+"\">" +
        "<input type=\"hidden\" name=\"reviewText\" value=\"" + reviewText + "\">"
        submitForm.setAttribute("action", "/shop/review/"+id)
        submitForm.setAttribute("method","POST")
        main.appendChild(submitForm)
        submitForm.submit()
    }
    
}
function newReview(event) {
    event.preventDefault();
    let blockBox = document.createElement("span")
    blockBox.setAttribute("class","coverBox");
    blockBox.setAttribute("id","coverBox");
    main.appendChild(blockBox)

    let infoBox = document.createElement("div");
    infoBox.setAttribute("class","infoBox");
    infoBox.setAttribute("id","infoBox");
    main.appendChild(infoBox)

    let xOut = document.createElement("a")
    xOut.setAttribute("href","/")
    xOut.setAttribute("class","xOut")
    xOut.innerHTML = "X"
    xOut.addEventListener("click",closeBox)
    infoBox.appendChild(xOut)

    let title =  document.createElement("h1")
    title.innerHTML = "Leave A Review!"
    infoBox.appendChild(title)
    let errmessage = document.createElement("h3")
    errmessage.setAttribute("id","err")
    infoBox.appendChild(errmessage)
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
    let revSub = document.getElementById("reviewForm")
    revSub.addEventListener("submit",submitReview)
}
plusButton.addEventListener("click",up)
minusButton.addEventListener("click",down)
textInput.addEventListener("blur",reset)
reviewLink.addEventListener("click",newReview)