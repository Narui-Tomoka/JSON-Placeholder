export function initPageTop() {
  const pageTopBtn = document.querySelector(".page-top");
  const hero = document.querySelector("#hero");

  // 必要な要素がなければ処理しない
  if (!pageTopBtn || !hero) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // fvが見えてる＝トップ付近 → 非表示
          pageTopBtn.classList.add("is-hidden");
        } else {
          // fvが見えなくなった → 表示
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
}
