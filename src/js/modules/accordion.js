export function initAccordion() {
  document.querySelectorAll(".faq__item").forEach((item) => {
    const summary = item.querySelector(".faq__question");
    const answer = item.querySelector(".faq__answer");

    // 必要な要素がなければ処理しない
    if (!summary || !answer) {
      return;
    }

    summary.addEventListener("click", (e) => {
      e.preventDefault();

      const isOpen = item.open;

      if (isOpen) {
        // ------- 閉じる -------

        const height = answer.scrollHeight;

        answer.style.height = height + "px";

        requestAnimationFrame(() => {
          answer.style.height = "0px";
        });

        answer.addEventListener(
          "transitionend",
          () => {
            item.open = false;
          },
          { once: true },
        );
      } else {
        // 他のアコーディオンを閉じる
        document.querySelectorAll(".faq__item[open]").forEach((openItem) => {
          if (openItem !== item) {
            const openAnswer = openItem.querySelector(".faq__answer");

            if (!openAnswer) {
              return;
            }

            const height = openAnswer.scrollHeight;
            openAnswer.style.height = height + "px";

            requestAnimationFrame(() => {
              openAnswer.style.height = "0px";
            });

            openAnswer.addEventListener(
              "transitionend",
              () => {
                openItem.open = false;
              },
              { once: true },
            );
          }
        });

        // ------- 開く -------

        item.open = true;

        const height = answer.scrollHeight;

        answer.style.height = height + "px";

        answer.addEventListener(
          "transitionend",
          () => {
            answer.style.height = "auto";
          },
          { once: true },
        );
      }
    });
  });
}
