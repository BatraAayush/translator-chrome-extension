function injectTranslateButton() {
  const sendButton = document.querySelector('[data-icon="send"]');
  if (!sendButton) return;

  if (document.querySelector("#translate-button")) return;

  const translateButton = document.createElement("button");
  translateButton.id = "translate-button";
  translateButton.innerHTML = `<img width='15' src='${chrome.runtime.getURL(
    "icons/translation.png"
  )}'/>`;
  translateButton.style.cssText =
    "cursor: pointer; color: black; background-color:white; padding:0.3rem; border-radius: 100%; display: flex; justif-content: center; align-items:center; margin-top:0.35rem";

  sendButton.parentNode.insertBefore(translateButton, sendButton.nextSibling);

  translateButton.addEventListener("click", async (event) => {
    event.stopPropagation();

    const messageInput = document.querySelector(
      'span[data-lexical-text="true"]'
    );

    if (messageInput) {
      const messageText = messageInput.innerText;

      if (messageText) {
        const { from, to } = await chrome.storage.local.get(["from", "to"]);
        try {
          const res = await chrome.runtime.sendMessage({
            text: messageText,
            from,
            to,
          });
          if (res && res.translatedText) {
            const { translatedText } = res;
            document.execCommand("selectAll", false, null);
            setTimeout(
              () => document.execCommand("insertText", false, translatedText),
              0
            );
          } else {
            console.error("Translation error:", res);
          }
        } catch (error) {
          console.error("Failed to send message to service worker:", error);
        }
      }
    }
  });
}

function injectTranslateButtons() {
  const messageElements = document.querySelectorAll(
    "div:is(.message-in, .message-out)"
  );
  messageElements.forEach((messageElement) => {
    if (!messageElement.querySelector(".translate-button")) {
      const translateButton = document.createElement("button");
      translateButton.className = "translate-button";
      translateButton.innerHTML = `<img width='15' src='${chrome.runtime.getURL(
        "icons/translation.png"
      )}'/>`;
      translateButton.style.cssText =
        "cursor: pointer; color: black; background-color:white; padding:0.3rem; border-radius: 100%; display: flex; justif-content: center; align-items:center; margin: 0.5rem 0";

      messageElement.appendChild(translateButton);

      translateButton.addEventListener("click", async (event) => {
        event.stopPropagation();

        const messageText = messageElement.querySelector(
          ".copyable-text .selectable-text"
        )?.innerText;

        if (messageText) {
          const { from, to } = await chrome.storage.local.get(["from", "to"]);
          try {
            const res = await chrome.runtime.sendMessage({
              text: messageText,
              from,
              to,
            });
            if (res && res.translatedText) {
              const { translatedText } = res;

              let translatedMessageWrapper = messageElement.nextSibling;
              if (
                !translatedMessageWrapper ||
                !translatedMessageWrapper.classList.contains(
                  "translated-message-wrapper"
                )
              ) {
                translatedMessageWrapper = document.createElement("div");
                translatedMessageWrapper.className =
                  "translated-message-wrapper";
                translatedMessageWrapper.style.cssText = "display: flex;";

                const translatedMessageElement = document.createElement("div");
                translatedMessageElement.className =
                  "translated-message-element";
                translatedMessageElement.innerText = translatedText;
                translatedMessageElement.style.cssText =
                  "color: black; margin: 1rem; background-color: white; width: fit-content; padding: 0.3rem 0.5rem; border-radius: 1rem";

                if (messageElement.classList.contains("message-in")) {
                  translatedMessageWrapper.style.justifyContent = "flex-start";
                } else if (messageElement.classList.contains("message-out")) {
                  translatedMessageWrapper.style.justifyContent = "flex-end";
                }

                translatedMessageWrapper.appendChild(translatedMessageElement);
                messageElement.parentNode.insertBefore(
                  translatedMessageWrapper,
                  messageElement.nextSibling
                );
              } else {
                const translatedMessageElement =
                  translatedMessageWrapper.querySelector(
                    ".translated-message-element"
                  );
                translatedMessageElement.innerText = translatedText;
              }
            } else {
              console.error("Translation error:", res);
            }
          } catch (error) {
            console.error("Failed to send message to service worker:", error);
          }
        }
      });
    }
  });
}

const onMutation = () => {
  mo.disconnect();
  injectTranslateButton();
  injectTranslateButtons();
  observe();
};

const observe = () => {
  mo.observe(document, {
    subtree: true,
    childList: true,
  });
};

const mo = new MutationObserver(onMutation);
observe();
