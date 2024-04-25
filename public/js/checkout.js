window.onload = function () {
    let costs = document.getElementsByClassName("cartPrice")
    let totalelem = document.getElementById("total")
    let subelem = document.getElementById("subtotal")
    let tax = document.getElementById("tax")
    let delivery = document.getElementById("delivery")
    if (subelem) {
        let total = 0
        for(let i = 0; i < costs.length; i++){
            total += parseFloat(costs[i].getAttribute('cost')) * parseFloat(costs[i].getAttribute('amt')).toFixed(2)
        }
        console.log(total)
        subelem.innerHTML = "$"+total.toString();
        if (tax) tax.innerHTML = "$" + (total * 0.0625).toFixed(2).toString();
        if (delivery) delivery.innerHTML = "$10";
        if (totalelem) totalelem.innerHTML = "$" + ((total * 0.0625) + total + 10).toFixed(2)
    }
    
}