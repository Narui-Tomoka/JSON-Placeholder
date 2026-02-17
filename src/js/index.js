const form = document.getElementById("searchForm");

// =========================
// バリデーションのための関数
// =========================
function validateForm() {
  // =========================
  // 入力フォームの値を取得
  // =========================
  // ユーザーID
  const userId = document.getElementById("userId").value.trim();
  // 投稿ID（プルダウンになっている場所。バリデーションはしないが値は必要なので取得している）
  const postId = document.getElementById("postId").value;
  // タイトル
  const title = document.getElementById("title").value.trim();
  // 本文
  const body = document.getElementById("body").value.trim();

  // =========================
  // 最初のエラーにフォーカスするためのフラグ
  // =========================
  let firstErrorElement = null;

  // =========================
  // エラー表示用にinput要素も取得（エラー時にis-errorクラスを付与するため）
  // =========================
  const inputUserId = document.getElementById("userId");
  const inputTitle = document.getElementById("title");
  const inputBody = document.getElementById("body");

  // =========================
  // input要素のエラー表示をリセット（これが無いとエラー解消してもis-errorがついたままになってしまう）
  // =========================
  inputUserId.classList.remove("is-error");
  inputTitle.classList.remove("is-error");
  inputBody.classList.remove("is-error");

  // 各input要素下のエラーメッセージ表示用定数を作成
  const errSummary = document.getElementById("errSummary");
  const errUserId = document.getElementById("errUserId");
  const errTitle = document.getElementById("errTitle");
  const errBody = document.getElementById("errBody");

  // =========================
  // エラーメッセージのリセット
  // =========================
  errSummary.innerHTML = "";
  errUserId.textContent = "";
  errTitle.textContent = "";
  errBody.textContent = "";

  errUserId.classList.remove("is-error-text");
  errTitle.classList.remove("is-error-text");
  errBody.classList.remove("is-error-text");

  // =========================
  // 上部に出すエラーメッセージをまとめておくための定数
  // =========================
  const errors = [];

  // =========================
  // userId（任意・整数チェック）
  // =========================
  if (userId !== "") {
    const num = Number(userId);

    if (!Number.isInteger(num)) {
      const msg = "ユーザーIDは整数で入力してください。";
      errUserId.textContent = msg;
      errUserId.classList.add("is-error-text");
      errors.push(msg);
      inputUserId.classList.add("is-error");
      // firstErrorElementがfalseなら
      // （他の要素が先に入ってtrueになっていなければ）
      // FirstErrorElementにこの要素が入り、フォーカスされる仕組み）
      if (!firstErrorElement) {
        firstErrorElement = inputUserId;
      }
    }
  }

  // =========================
  // title（任意・10文字以内）
  // =========================
  if (title !== "" && title.length > 10) {
    const msg = "タイトルは10文字以内で入力してください。";
    errTitle.textContent = msg;
    errTitle.classList.add("is-error-text");
    errors.push(msg);
    inputTitle.classList.add("is-error");
    if (!firstErrorElement) {
      firstErrorElement = inputTitle;
    }
  }
  // =========================
  // body（任意・50文字以内）
  // =========================
  if (body !== "" && body.length > 50) {
    const msg = "本文は50文字以内で入力してください。";
    errBody.textContent = msg;
    errBody.classList.add("is-error-text");
    errors.push(msg);
    inputBody.classList.add("is-error");
    if (!firstErrorElement) {
      firstErrorElement = inputBody;
    }
  }

  // =========================
  // 上部サマリー表示
  // =========================
  if (errors.length > 0) {
    errSummary.innerHTML = `<p class="search-form__error-title is-error-text">入力に不備があります（${errors.length}件）</p>
    <ul class="search-form__error-list">${errors.map((e) => `<li class="is-error-text">${e}</li>`).join("")}</ul>`;

    // フォーム上部にスクロール
    errSummary.scrollIntoView({ behavior: "smooth" });

    if (firstErrorElement) {
      firstErrorElement.focus();
    }
    return false;
  }
  return true;
}

form.addEventListener("submit", (e) => {
  // =========================
  // HTMLに元々ついている機能を無効化
  // =========================
  e.preventDefault();

  if (!validateForm()) {
    return; // エラーがあればAPI呼ばない
  }

  console.log("バリデーションOK → API呼び出しへ");
});
