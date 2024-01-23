const dropdowns = document.querySelectorAll(".dropdown-container"),
  inputLanguageDropdown = document.querySelector("#input-language"),
  outputLanguageDropdown = document.querySelector("#output-language");
let mic = document.querySelector("#click_to_record");
let cpyBtn_left = document.querySelector(".copyleft");
let cpyBtn_right = document.querySelector(".copyright");




// Dropdown feature
function populateDropdown(dropdown, options) {
  dropdown.querySelector("ul").innerHTML = "";
  options.forEach((option) => {
    const li = document.createElement("li");
    const title = option.name + " (" + option.native + ")";
    li.innerHTML = title;
    li.dataset.value = option.code;
    li.classList.add("option");
    dropdown.querySelector("ul").appendChild(li);
  });
}

populateDropdown(inputLanguageDropdown, languages);
populateDropdown(outputLanguageDropdown, languages);

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
    dropdown.classList.toggle("active");
  });

  dropdown.querySelectorAll(".option").forEach((item) => {
    item.addEventListener("click", (e) => {
      //remove active class from current dropdowns
      dropdown.querySelectorAll(".option").forEach((item) => {
        item.classList.remove("active");
      });
      item.classList.add("active");
      const selected = dropdown.querySelector(".selected");
      selected.innerHTML = item.innerHTML;
      selected.dataset.value = item.dataset.value;
      translate();
    });
  });
});
document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
});

// Language Switcher
const swapBtn = document.querySelector(".swap-position"),
  inputLanguage = inputLanguageDropdown.querySelector(".selected"),
  outputLanguage = outputLanguageDropdown.querySelector(".selected"),
  inputTextElem = document.querySelector("#input-text"),
  outputTextElem = document.querySelector("#output-text");

swapBtn.addEventListener("click", (e) => {
  const temp = inputLanguage.innerHTML;
  inputLanguage.innerHTML = outputLanguage.innerHTML;
  outputLanguage.innerHTML = temp;

  const tempValue = inputLanguage.dataset.value;
  inputLanguage.dataset.value = outputLanguage.dataset.value;
  outputLanguage.dataset.value = tempValue;

  //swap text
  const tempInputText = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = tempInputText;

  translate();
});

// Translate feature
function translate() {
  const inputText = inputTextElem.value;
  const inputLanguage =
    inputLanguageDropdown.querySelector(".selected").dataset.value;
  const outputLanguage =
    outputLanguageDropdown.querySelector(".selected").dataset.value;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(
    inputText
  )}`;
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      outputTextElem.value = json[0].map((item) => item[0]).join("");
    })
    .catch((error) => {
      console.log(error);
    });
}
inputTextElem.addEventListener("input", (e) => {

  translate();
});

// Mic Feature
mic.addEventListener("click", function () {
  var speech = true;
  window.SpeechRecognition = window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.interimResults = true;

  recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')

    inputTextElem.value = transcript;


    console.log(transcript);

    const inputText = inputTextElem.value;
    const inputLanguage =
      inputLanguageDropdown.querySelector(".selected").dataset.value;
    const outputLanguage =
      outputLanguageDropdown.querySelector(".selected").dataset.value;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(
      inputText
    )}`;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        outputTextElem.value = json[0].map((item) => item[0]).join("");
      })
      .catch((error) => {
        console.log(error);
      });
  });

  if (speech == true) {
    recognition.start();
  }
  console.log(transcript);

})




// Copy button left
cpyBtn_left.addEventListener("click", function () {
  navigator.clipboard.writeText(inputTextElem.value);

});

// Copy button right
cpyBtn_right.addEventListener("click", function () {
  navigator.clipboard.writeText(outputTextElem.value);
});





// Theme Switcher
const darkModeCheckbox = document.getElementById("dark-mode-btn");

darkModeCheckbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

