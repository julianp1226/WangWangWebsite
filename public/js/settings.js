
// WIP
function darkMode() {
    var checkbox = document.getElementById('dark_mode');
    var page = document.getElementById('flex_container');
    var nav_btns = document.getElementsByClassName('nav_btns');

    if (checkbox.checked) {
        page.style.backgroundColor = "#565656";
        page.style.color = "white";
        for (var i = 0; i < nav_btns.length; i++) {
            nav_btns[i].style.backgroundColor = "#565656";
        }
    } else {
        page.style.backgroundColor = "white";
        page.style.color = "#1E1E1E";
        for (var i = 0; i < nav_btns.length; i++) {
            nav_btns[i].style.backgroundColor = "white";
        }
    }
}

function select(c, b) {
    var pages = document.getElementsByClassName('pages');
    var btns = document.getElementsByClassName('nav_btns');

    for (var i = 0; i < pages.length; i++) {
        if (pages[i].id == c) {
            pages[i].style.display = "flex";
        } else {
            pages[i].style.display = "none";
        }
    }

    for (var i = 0; i < btns.length; i++) {
        if (btns[i].id == b) {
            btns[i].style.color = "#1E1E1E";
            btns[i].style.backgroundColor = "rgb(224, 224, 224)";
        } else if ('delete_btn' != b) {
            btns[i].style.color = "#8E8E8E";
            btns[i].style.backgroundColor = "white";
        }
    }

}

function cancel(c) {
    var popup = document.getElementById(c);

    popup.style.display = "none";
}

function popup(p) {
    var popup = document.getElementById(p);

    popup.style.display = "block";
}
