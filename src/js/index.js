const form = document.getElementById("searchForm");

// =========================
// バリデーションのための関数
// =========================
function validateForm() {
  // =========================
  // 入力フォームの値を取得
  // =========================
  // 投稿ID
  const postId = document.getElementById("postId").value.trim();
  // ユーザーID（プルダウンになっている場所。バリデーションはしないが値は必要なので取得している）
  const userId = document.getElementById("userId").value;
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
  const inputPostId = document.getElementById("postId");
  const inputTitle = document.getElementById("title");
  const inputBody = document.getElementById("body");

  // =========================
  // input要素のエラー表示をリセット（これが無いとエラー解消してもis-errorがついたままになってしまう）
  // =========================
  inputPostId.classList.remove("is-error");
  inputTitle.classList.remove("is-error");
  inputBody.classList.remove("is-error");

  // 各input要素下のエラーメッセージ表示用定数を作成
  const errSummary = document.getElementById("errSummary");
  const errPostId = document.getElementById("errPostId");
  const errTitle = document.getElementById("errTitle");
  const errBody = document.getElementById("errBody");

  // =========================
  // エラーメッセージのリセット
  // =========================
  errSummary.innerHTML = "";
  errPostId.textContent = "";
  errTitle.textContent = "";
  errBody.textContent = "";

  errPostId.classList.remove("is-error-text");
  errTitle.classList.remove("is-error-text");
  errBody.classList.remove("is-error-text");

  // =========================
  // 上部に出すエラーメッセージをまとめておくための定数
  // =========================
  const errors = [];

  // =========================
  // postId（任意・整数チェック）
  // =========================
  if (postId !== "") {
    const num = Number(postId);

    if (!Number.isInteger(num)) {
      const msg = "投稿IDは整数で入力してください。";
      errPostId.textContent = msg;
      errPostId.classList.add("is-error-text");
      errors.push(msg);
      inputPostId.classList.add("is-error");
      // firstErrorElementがfalseなら
      // （他の要素が先に入ってtrueになっていなければ）
      // FirstErrorElementにこの要素が入り、フォーカスされる仕組み）
      if (!firstErrorElement) {
        firstErrorElement = inputPostId;
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

form.addEventListener("submit", async (e) => {
  // =========================
  // HTMLに元々ついている機能を無効化
  // =========================
  e.preventDefault();

  if (!validateForm()) {
    return; // エラーがあればAPI呼ばない
  }

  // =========================
  // ④ ここからクエリパラメータ生成
  // =========================
  const userId = document.getElementById("userId").value;
  const postId = document.getElementById("postId").value.trim();
  const title = document.getElementById("title").value.trim();
  const body = document.getElementById("body").value.trim();

  const params = new URLSearchParams();

  if (userId !== "") {
    params.append("userId", userId);
  }

  if (postId !== "") {
    params.append("id", postId);
  }

  if (title !== "") {
    params.append("title_like", title);
  }

  if (body !== "") {
    params.append("body_like", body);
  }

  const queryString = params.toString();

  console.log("生成されたクエリ", queryString);

  // =========================
  // ⑤ APIにリクエスト
  // =========================

  const url = `https://jsonplaceholder.typicode.com/posts?${queryString}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("ネットワークエラー");
    }

    const data = await response.json();

    console.log("取得データ：", data);
    // =========================
    // ⑥ 取得データを使ってDOM生成
    // =========================

    const resultSection = document.getElementById("resultSection");
    const resultList = document.getElementById("resultList");
    const resultTitle = document.getElementById("resultSectionTitle");
    const resultCaption = document.getElementById("resultSectionCaption");

    // 前回の検索結果をクリア
    resultList.innerHTML = "";

    // =========================
    // 検索結果が0件だった場合
    // =========================
    if (data.length === 0) {
      // タイトル変更
      resultTitle.textContent = "誰もいない道。あなたが最初のひとり。";

      // キャプション変更（<br>があるのでinnerHTML）
      resultCaption.innerHTML = `その道に、まだ「そらいろ」の記録はありません。<br />
    あなたが最初のドライバーになって、新しい物語を地図に刻んでみませんか？`;

      const emptyItem = document.createElement("li");
      emptyItem.classList.add("search-result__empty");
      emptyItem.textContent = "前人未到のルートへ、ようこそ。";

      resultList.appendChild(emptyItem);

      resultSection.hidden = false;
      return;
    }

    // =========================
    // 検索結果が1件以上ある場合
    // =========================

    // タイトルを通常文に戻す（戻さないと再度の検索でヒットしても0件の文になってしまうバグになるため）
    resultTitle.textContent = "あなたに届いた絶景たち";

    resultCaption.innerHTML = `条件に合った投稿を一覧表示しています。<br />
  気になる写真をクリックして、詳細をのぞいてみましょう。`;

    data.forEach((post) => {
      const li = document.createElement("li");
      li.classList.add("search-result__item");

      // ランダムな画像で装飾
      const randomSeed = `${post.id}-${Math.floor(Math.random() * 10000)}`;
      const imageUrl = `https://picsum.photos/seed/${randomSeed}/400/300`;

      li.innerHTML = `
    <a href="details.html?id=${post.id}" class="post-card">
      <div class="image-wrapper">
        <span class="post-card__id">投稿ID: ${post.id}</span>
        <img src="${imageUrl}" alt="投稿ID ${post.id} のイメージ画像">
      </div>
      <div class="post-card__content">
        <h3 class="post-card__title">${post.title}</h3>
        <p class="post-card__user-id">ユーザー${post.userId}</p>
        <p class="post-card__body">${post.body}</p>
      </div>
    </a>`;

      resultList.appendChild(li);
    });
    // section表示
    resultSection.hidden = false;
  } catch (error) {
    console.log("エラー発生", error);
  }
});
