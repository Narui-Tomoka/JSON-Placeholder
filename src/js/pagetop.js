const pageTopBtn = document.querySelector(".page-top");
const hero = document.querySelector("#hero");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // fvが見えてる＝トップ付近 → 非表示
        pageTopBtn.classList.add("is-hidden");
      } else {
        // fvが見えなくなった＝about以降 → 表示
        pageTopBtn.classList.remove("is-hidden");
      }
    });
  },
  {
    root: null,
    threshold: 0.5,
  },
);

observer.observe(hero);
