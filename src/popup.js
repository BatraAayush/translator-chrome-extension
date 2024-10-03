import { LANGUAGE_CODES } from './constants.js';

window.addEventListener("DOMContentLoaded", async () => {
  const fromSelect = document.querySelector("#from");
  const toSelect = document.querySelector("#to");
  const button = document.querySelector("button");

  for (const [language, code] of Object.entries(LANGUAGE_CODES)) {
    const optionFrom = document.createElement("option");
    optionFrom.value = code;
    optionFrom.textContent = language;
    fromSelect.appendChild(optionFrom);

    const optionTo = document.createElement("option");
    optionTo.value = code;
    optionTo.textContent = language;
    toSelect.appendChild(optionTo);
  }

  const { from, to } = await chrome.storage.local.get(["from", "to"]);
  fromSelect.value = from || "FR";
  toSelect.value = to || "EN";

  fromSelect.addEventListener("change", () => {
    const selectedCode = fromSelect.value;
    chrome.storage.local.set({
      from: selectedCode,
    });
  });
  toSelect.addEventListener("change", () => {
    const selectedCode = toSelect.value;
    chrome.storage.local.set({
      to: selectedCode,
    });
  });

  button.addEventListener("click", () => {
    const a = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = a;
    chrome.storage.local.set({
      from: fromSelect.value,
      to: toSelect.value,
    });
  });
});
