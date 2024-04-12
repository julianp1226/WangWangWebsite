const modal = document.querySelector('.post-modal')

const get_id = clicked_id => {
  fetch(`/feed/id/${clicked_id}`)
    .then(res => res.text())
    .then(data => {
      modal.innerHTML = data
      const [navOne, navTwo] = document.querySelectorAll('.nav');
      navTwo.remove();
      modal.style.display = "block"
      history.pushState(null, null, `/feed/id/${clicked_id}`)
    })
}

//Defining a listener for our button, specifically, an onclick handler
document.getElementById("add").onclick = function () {
  //First things first, we need our text:
  var text = document.getElementById("tags-input").value; //.value gets input values

  //Now construct a quick list element
  var li = document.createElement('li'); // is a node
  li.className = "tags-list-element";
  li.innerHTML = text + '<svg id="remove-tag" width="10" height="10" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg" style="cursor: pointer;margin-left: 10px;"> <line y1="-3" x2="47.4022" y2="-3" transform="matrix(0.709598 -0.704607 0.709598 0.704607 4.36328 38.3999)" stroke="#BABABA" stroke-width="6"/><line y1="-3" x2="47.4022" y2="-3" transform="matrix(0.709598 0.704607 -0.709598 0.704607 1 5.23633)" stroke="#BABABA" stroke-width="6"/></svg>';
  //Now use appendChild and add it to the list!
  document.getElementById("list").appendChild(li);
  var deleteButton = document.getElementById("remove-tag");
  deleteButton.addEventListener("click", function () {
    li.remove()
  })
}

const get_out = () => {
  history.back();
  modal.innerHTML = ""
  modal.style.display = "none"
}

function submitForm() {
  var listItems = document.querySelectorAll("#list li");
  var listValues = [];
  listItems.forEach(function (item) {
    listValues.push(item.textContent);
  });
  document.getElementById("listValuesInput").value = JSON.stringify(listValues); // Store list values in hidden input field
  return true; // Continue with form submission
}

function showFileUpload() {
  document.getElementById("postMedia").style.display = "block";
}
function hideFileUpload() {
  document.getElementById("postMedia").style.display = "none";
}

$('.grid').masonry({
  itemSelector: '.card',
  columnWidth: '.card',
  fitWidth: true,
});

const likePost = clicked_id => {
  // Split the URL by '/'
  var urlParts = clicked_id.split('/');

  // Get the last element of the array
  var lastElement = urlParts[urlParts.length - 1];

  var postId = lastElement;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/feed/likePost', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log('Post liked successfully');
      document.getElementById(`postLike-${postId}`).style.fill = "#FF3EA5";
      var likeElement = document.getElementById(`like-${postId}`);
      var outsideLikeElement = document.getElementById(`outsideLikeNumber-${postId}`)
      var currentLikes = parseInt(likeElement.textContent);
      // Increment the likes by 1
      var newLikes = currentLikes + 1;
      // Update the content of the element with the new number of likes
      likeElement.textContent = newLikes;
      outsideLikeElement.textContent = newLikes;
    } else {
      console.error('Failed to like post');
    }
  };
  xhr.send(JSON.stringify({ postId: postId }));
}

function validateMyForm() {
  let errorDiv = document.getElementById("error-div");
  let commentInput = document.getElementById("commentInput");
  if (commentInput.value.trim() === "") {
    errorDiv.innerHTML = "";
    let message = document.createElement("p");
    message.innerHTML = "You must write your comment to post it.";
    errorDiv.appendChild(message);
    return false;
  }
  else {
    document.forms['commentForm'].submit();
    return true;
  }
}

function removeAll() {
  document.getElementById("list").innerHTML = "";
}