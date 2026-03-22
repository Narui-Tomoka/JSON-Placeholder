export function initHamburger() {
  const hamburger = document.getElementById("js-hamburger");
  const header = document.getElementById("header");
  const overlay = document.getElementById("js-drawer-overlay");

  // 必要な要素がなければ処理しない
  if (!hamburger || !header || !overlay) {
    return;
  }

  hamburger.addEventListener("click", () => {
    header.classList.toggle("is-active");
  });

  // 背景クリックで閉じる処理
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      header.classList.remove("is-active");
    }
  });
}
