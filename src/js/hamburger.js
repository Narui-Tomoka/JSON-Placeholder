"use strict";

const hamburger = document.getElementById("js-hamburger");
const header = document.getElementById("header");
const overlay = document.getElementById("js-drawer-overlay"); // 追加

hamburger.addEventListener("click", () => {
  header.classList.toggle("is-active");
  overlay.classList.toggle("is-active");
});

// 背景クリックで閉じる処理
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    header.classList.remove("is-active");
    overlay.classList.remove("is-active");
  }
});
