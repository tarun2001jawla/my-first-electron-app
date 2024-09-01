

// Get elements
const imgForm = document.querySelector("#img-form");
const widthInput = document.querySelector("#width");
const heightInput = document.querySelector("#height");
const filenameSpan = document.querySelector("#filename");
const outputPathSpan = document.querySelector("#output-path");
const fileInput = document.querySelector("#img");

// Show Toastify message
const showToast = (message, type = "info") => {
  window.Toastify.showToast({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: type === "error" ? "#f44336" : "#4caf50",
  });
};

const loadImage = (e) => {
  const target = e.target;
  const file = target.files?.[0];

  if (file && !isFileValidImage(file)) {
    showToast("Please select a valid image", "error");
    return;
  }

  // Getting original dimensions of selected image
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = () => {
    widthInput.value = image.naturalWidth;
    heightInput.value = image.naturalHeight;
  };

  if (file && isFileValidImage(file)) {
    imgForm.style.display = "block";
    filenameSpan.innerText = file.name;
    outputPathSpan.innerText = path.join(window.os.homedir(), "imageresizer");
    showToast("Image loaded successfully");
  }
};

// Handle form submission
const sendImage = (e) => {
  e.preventDefault();

  const width = widthInput.value;
  const height = heightInput.value;
  const file = fileInput.files?.[0];
  const imagePath = fileInput.files[0].path;

  if (file && !isFileValidImage(file)) {
    showToast("Please select a valid image", "error");
    return;
  }

  if (!width || !height) {
    showToast("Please enter width and height", "error");
    return;
  }

  
 
    // Send image data and dimensions to the main process
    ipcRenderer.send('resize-image', {
      imageData: imagePath,
      width,
      height,
      fileName: file.name,
    });
    showToast("Image resize request sent", "info");
  
  
};

// Check if the file is a valid image
const isFileValidImage = (file) => {
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png"].includes(fileExt || "");
};

// Attach event listeners
fileInput?.addEventListener("change", loadImage);
imgForm?.addEventListener("submit", sendImage);
