const input = document.querySelector("#eng-input");
const btn = document.querySelector("#translate-btn");
const output = document.querySelector("#val-output");

const translationURL =
  "https://api.funtranslations.com/translate/valyrian.json";

const handleErrors = (response) => {
  console.log(response);
};

btn.addEventListener("click", () => {
  let engInput = input.value;

  let translationData = fetch(translationURL + "?text=" + engInput)
    .then((response) => {
      switch (response.status) {
        case 429:
          output.innerText =
            "Hmmm.. It seems you have utilized your 5 wishes for this hour ! Please try again in the next one.";
          break;

        case 404:
          output.innerText =
            "The valyrian to this english can't be found. Please try something else !";
          break;

        case 501:
          output.innerText = "Sorry, I can't fulfill your wishes currently.";
          break;

        case 503:
          output.innerText =
            "Sorry, I am under maintainance. Please try again some other time.";
          break;
      }
    })
    .then((translationData) => translationData.json())
    .then((translationDataJSON) => translationDataJSON.contents.translated)
    .then((translatedText) => (output.innerText = translatedText));
});
