// =========================
// detail page controller
// =========================

import "../../styles/style.scss";
import { initHamburger } from "../modules/hamburger";
import { initPageTop } from "../modules/pagetop";

// 共通処理
initHamburger();
initPageTop();

// =====================
// URLからID取得
// =====================
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");
console.log("取得したID：", postId);

// =====================
// DOM取得
// =====================
const postIdEl = document.getElementById("postId");
const userIdEl = document.getElementById("userId");
const titleEl = document.getElementById("title");
const bodyEl = document.getElementById("body");

const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");

const errSummary = document.getElementById("errSummary");
const errPostId = document.getElementById("errPostId");
const errTitle = document.getElementById("errTitle");
const errBody = document.getElementById("errBody");

// =====================
// 初期処理
// =====================

init();

function init() {
  if (!postId || !Number.isInteger(Number(postId))) {
    showSummaryError(
      "不正な投稿IDです。一覧画面から正しい投稿を選択してください。",
    );
    errPostId.textContent = "投稿IDが不正です。";
    console.error("IDが不正です:", postId);
    return;
  }

  fetchPost();

  updateBtn.addEventListener("click", updatePost);
  deleteBtn.addEventListener("click", deletePost);
}

// =========================
// メッセージ表示
// =========================
function showSummaryError(message) {
  errSummary.innerHTML = `
    <p class="search-form__error-text is-error-text">
      ${message}
    </p>
  `;
}

function showSummarySuccess(message) {
  errSummary.innerHTML = `
    <p class="detail-form__success-text">
      ${message}
    </p>
  `;
}

function clearSummaryMessage() {
  errSummary.innerHTML = "";
}

function clearFieldErrors() {
  errPostId.textContent = "";
  errTitle.textContent = "";
  errBody.textContent = "";

  userIdEl.classList.remove("is-error");
  titleEl.classList.remove("is-error");
  bodyEl.classList.remove("is-error");
}

// フォーム部品と更新・削除ボタンをdisabledにする関数
function setFormDisabled(disabled) {
  userIdEl.disabled = disabled;
  titleEl.disabled = disabled;
  bodyEl.disabled = disabled;
  updateBtn.disabled = disabled;
  deleteBtn.disabled = disabled;
}

// =========================
// バリデーション
// =========================
function validateDetailForm() {
  const userId = userIdEl.value;
  const title = titleEl.value.trim();
  const body = bodyEl.value.trim();

  let firstErrorElement = null;
  const errors = [];

  clearSummaryMessage();
  clearFieldErrors();

  // userId 必須
  if (userId === "") {
    const msg = "ユーザーを選択してください。";
    errors.push(msg);
    userIdEl.classList.add("is-error");

    if (!firstErrorElement) {
      firstErrorElement = userIdEl;
    }
  }

  // title 必須
  if (title === "") {
    const msg = "タイトルを入力してください。";
    errTitle.textContent = msg;
    titleEl.classList.add("is-error");
    errors.push(msg);

    if (!firstErrorElement) {
      firstErrorElement = titleEl;
    }
  }

  // body 必須
  if (body === "") {
    const msg = "本文を入力してください。";
    errBody.textContent = msg;
    bodyEl.classList.add("is-error");
    errors.push(msg);

    if (!firstErrorElement) {
      firstErrorElement = bodyEl;
    }
  }

  // エラーまとめ表示
  if (errors.length > 0) {
    errSummary.innerHTML = `
      <p class="search-form__error-text is-error-text">
        入力に不備があります（${errors.length}件）
      </p>
      <ul class="detail-form__error-list">
        ${errors
          .map(
            (e) =>
              `<li class="search-form__error-text is-error-text">${e}</li>`,
          )
          .join("")}
      </ul>
    `;

    errSummary.scrollIntoView({ behavior: "smooth" });

    if (firstErrorElement) {
      firstErrorElement.focus();
    }

    return false;
  }

  return true;
}

// =====================
// fetch共通
// =====================
async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTPエラー：${response.status}`);
  }

  // DELETE のように空レスポンスの可能性がある時の保険
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return null;
}

// =====================
// 投稿取得
// =====================
async function fetchPost() {
  clearSummaryMessage();
  clearFieldErrors();
  setFormDisabled(true);

  try {
    const data = await fetchJson(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
    );

    if (!data || !data.id) {
      throw new Error("投稿データが取得できませんでした。");
    }

    console.log("取得した投稿：", data);
    renderPost(data);
    setFormDisabled(false);
  } catch (error) {
    showSummaryError("詳細の取得に失敗しました。");
    console.error("詳細取得失敗：", error);
    setFormDisabled(true);
  }
}

// =====================
// 投稿表示
// =====================
function renderPost(post) {
  postIdEl.textContent = post.id;
  userIdEl.value = String(post.userId);
  titleEl.value = post.title;
  bodyEl.value = post.body;
}

// =====================
// 更新処理
// =====================
async function updatePost() {
  if (!validateDetailForm()) {
    return;
  }

  if (!confirm("大切な記録を書き換えてもよろしいですか？")) {
    return;
  }

  const requestBody = {
    id: Number(postId),
    userId: Number(userIdEl.value),
    title: titleEl.value.trim(),
    body: bodyEl.value.trim(),
  };

  clearSummaryMessage();

  try {
    const data = await fetchJson(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    showSummarySuccess("更新に成功しました。");
    console.log("更新結果：", data);
  } catch (error) {
    showSummaryError("更新に失敗しました。");
    console.error("更新失敗：", error);
  }
}

// =====================
// 削除処理
// =====================
async function deletePost() {
  if (!confirm("この大切な記憶を、地図から消してしまっても大丈夫ですか？")) {
    return;
  }

  clearSummaryMessage();

  try {
    const data = await fetchJson(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      {
        method: "DELETE",
      },
    );

    showSummarySuccess("削除に成功しました。");
    console.log("削除結果：", data);

    window.location.href = "index.html";
  } catch (error) {
    showSummaryError("削除に失敗しました。");
    console.error("削除失敗：", error);
  }
}
