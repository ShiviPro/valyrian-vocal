const input = document.querySelector("#eng-input");
const btn = document.querySelector("#translate-btn");
const output = document.querySelector("#val-output");

const translationURL =
  "https://api.funtranslations.com/translate/valyrian.json";

const handleError = errorMessage => output.innerText = errorMessage;

btn.addEventListener("click", () => {
  const engInput = input.value;
  const loading = document.createElement("div");
  loading.classList.add("loading");

  const btnTextBackup = btn.innerText;
  btn.innerText = "";
  btn.appendChild(loading);

  const removeLoading = () => {
    loading.remove();
    btn.innerText = btnTextBackup;
  };
  let hasSurpassedRateLimit = false;
  fetch(`${translationURL}?text=${engInput}`)
    .then(response => {
      switch (response.status) {
        case 429:
          hasSurpassedRateLimit = true;
          break;
        case 404:
          removeLoading();
          throw "The valyrian to this english can't be found. Please try something else !";

        case 501:
          removeLoading();
          throw "Sorry, I can't fulfill your wishes currently.";

        case 503:
          removeLoading();
          throw "Sorry, I am under maintainance. Please try again some other time.";

        case 504:
          removeLoading();
          throw "Sorry, I am tired & hence, unable to return the answer in time. Please try again some other time.";
      }
      return response;
    })
    .then(translationData => translationData.json())
    .then(translationDataJSON => {
      if (hasSurpassedRateLimit && translationDataJSON.error.code === 429) {
        const errorMessage = translationDataJSON.error.message;
        const timeIndex = errorMessage.indexOf("for");
        const time = errorMessage.toString().substring(timeIndex);
        return `Hmmm.. It seems you have utilized your 5 wishes for this hour ! Please wait ${time} Then try again.`;
      }
      return translationDataJSON.contents.translated;
    })
    .then(translatedText => {
      removeLoading();
      output.innerText = translatedText;
    })
    .catch(errorMessage => handleError(errorMessage));
});
