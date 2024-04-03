textInput = document.getElementById("num")
plusButton = document.getElementById("up")
minusButton = document.getElementById("down")

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
plusButton.addEventListener("click",up)
minusButton.addEventListener("click",down)
textInput.addEventListener("blur",reset)