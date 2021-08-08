const input = document.querySelector("#eng-input");
const btn = document.querySelector("#translate-btn");
const output = document.querySelector("#val-output");

const translationURL =
  "https://api.funtranslations.com/translate/valyrian.json";

btn.addEventListener("click", () => {
  let engInput = input.value;
  let loading = document.createElement("div");
  loading.classList.add("loading");

  let btnTextBackup = btn.innerText;
  btn.innerText = "";
  btn.appendChild(loading);

  const removeLoading = () => {
    loading.remove();
    btn.innerText = btnTextBackup;
  };
  let hasSurpassedRateLimit = false;
  fetch(translationURL + "?text=" + engInput)
    .then((response) => {
      switch (response.status) {
        case 429:
          hasSurpassedRateLimit = true;
          break;
        case 404:
          removeLoading();
          output.innerText =
            "The valyrian to this english can't be found. Please try something else !";
          break;

        case 501:
          removeLoading();
          output.innerText = "Sorry, I can't fulfill your wishes currently.";
          break;

        case 503:
          removeLoading();
          output.innerText =
            "Sorry, I am under maintainance. Please try again some other time.";
          break;

        case 504:
          removeLoading();
          output.innerText =
            "Sorry, I am tired & hence, unable to return the answer in time. Please try again some other time.";
          break;
      }
      return response;
    })
    .then((translationData) => translationData.json())
    .then((translationDataJSON) => {
      if (hasSurpassedRateLimit && translationDataJSON.error.code === 429) {
        let errorMessage = translationDataJSON.error.message;
        let timeIndex = errorMessage.indexOf("for");
        let time = errorMessage.toString().substring(timeIndex);
        return (
          "Hmmm.. It seems you have utilized your 5 wishes for this hour ! Please wait " +
          time +
          " Then try again."
        );
      }
      return translationDataJSON.contents.translated;
    })
    .then((translatedText) => {
      removeLoading();
      output.innerText = translatedText;
    });
});
