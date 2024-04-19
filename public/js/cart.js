window.onload = function () {
    let costs = document.getElementsByClassName("cartPrice")
    let total = 0
    for(let i = 0; i < costs.length; i++){
        total += parseFloat(costs[i].getAttribute('cost')) * parseFloat(costs[i].getAttribute('amt'))
    }
    console.log(total)
    let totalelem = document.getElementById("total")
    totalelem.innerHTML = "Total: $"+total.toString()
}