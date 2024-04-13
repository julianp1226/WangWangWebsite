let postForm = document.getElementById("postform");
let caption = document.getElementById("caption-box");
let file = document.getElementById("postMedia");
let errorDiv = document.getElementById("error-div");


const validStr = (str, varName) => {
  let strName = varName || "String variable";
  if (!str) throw `Error: ${strName} not provided`;
  if (typeof str !== "string" || str.trim().length === 0)
    throw `Error: ${strName} must be a non-empty string.`;
  str = str.trim();
  return str;
};

// RETURNS TRUE/FALSE
const validVideoUrl = (filename) => {
  // Supported video file extensions
  const validExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm'];

  // Extract file extension
  const fileExtension = filename.slice(filename.lastIndexOf('.'));

  // Check if the file extension is in the list of valid extensions
  return validExtensions.includes(fileExtension.toLowerCase());
};

// RETURNS TRUE/FALSE
function isValidImage(filename) {
  // Supported image file extensions
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];

  // Extract file extension
  const fileExtension = filename.slice(filename.lastIndexOf('.'));

  // Check if the file extension is in the list of valid extensions
  return validExtensions.includes(fileExtension.toLowerCase());
}

if (postForm) {
  postForm.addEventListener("submit", (event) => {
    errorDiv.hidden = false;
    errorDiv.innerHTML = "";

    if (caption.value.trim() === "") {
      console.log("empty");
      event.preventDefault();
      let message = document.createElement("p");
      message.innerHTML = "Caption is required";
      errorDiv.appendChild(message);
    }

    if (!isValidImage(file.value)) {
      event.preventDefault();
      let message = document.createElement("p");
      message.innerHTML = "Invalid file upload";
      errorDiv.appendChild(message);
    } else if (!validVideoUrl(file.value)) {
      event.preventDefault();
      let message = document.createElement("p");
      message.innerHTML = "Invalid file upload";
      errorDiv.appendChild(message);
    }
  });
}