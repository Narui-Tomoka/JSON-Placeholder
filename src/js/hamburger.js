"use strict";

const hamburger = document.getElementById("js-hamburger");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("is-active");
});
