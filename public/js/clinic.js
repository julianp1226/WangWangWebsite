let displayDate = document.getElementById('booking-date')
let date = document.getElementById('date')
let time = document.getElementById('time')

function setDate(dayOfWeek, month, day, year) {
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    date.setAttribute('value', month + " " +day + " " + year)
    displayDate.innerHTML = weekday[dayOfWeek] + ", " + month + " " +day
    //console.log(weekday[dayOfWeek] + ", " + month + " " +day)
}

function setTime(newTime){
    time.setAttribute('value', newTime)
}

