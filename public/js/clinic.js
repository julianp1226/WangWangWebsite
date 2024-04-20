let date = document.getElementById('booking-date')
let time = document.getElementById('time')

function setDate(dayOfWeek, month, day) {
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    date.innerHTML = weekday[dayOfWeek] + ", " + month + " " +day
    console.log(weekday[dayOfWeek] + ", " + month + " " +day)
}

function setTime(newTime){
    time.innerHTML = newTime
}



