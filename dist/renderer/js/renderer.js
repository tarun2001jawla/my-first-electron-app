const imgForm = document.querySelector("#img-form");
const widthInput = document.querySelector("#width");
const heightInput = document.querySelector("#height");
const filenameSpan = document.querySelector("#filename");
const outputPathSpan = document.querySelector("#output-path");
const fileInput = document.querySelector("#img");

const showToast = (message, type = "info") => {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: type === "error" ? "#f44336" : "#4caf50",
  }).showToast();
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
    outputPathSpan.innerText = path.join(os.homedir(), "imageresizer");
    showToast("Image loaded successfully");
  }

  const sendImage= (e)=>{

  }
};

// Check if the file is a valid image
const isFileValidImage = (file) => {
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png"].includes(fileExt || "");
};

fileInput?.addEventListener("change", loadImage);
