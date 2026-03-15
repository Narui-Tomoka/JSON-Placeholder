// =========================
// index page controller
// =========================

import "../../styles/style.scss";
import { initAccordion } from "../modules/accordion";
import { initHamburger } from "../modules/hamburger";
import { initPageTop } from "../modules/pagetop";

const form = document.getElementById("searchForm");

// 共通処理
initHamburger();
initPageTop();
initAccordion();
// =========================
// 処理の流れ
// =========================
//submitイベント
// ├ e.preventDefault()
// ├ validateForm()
// ├ クエリパラメータ生成
// ├ fetch → 条件に合うものを全件取得
// ├ currentPage を管理
// ├ 配列を slice して10件だけ渡す
// └ renderPosts(現在のページ分)

// 今回実装するのは「APIページネーションではなくクライアント側でのページネーション」
// 「状態管理型ページネーション」というらしい
const LIMIT = 10; // 10件まで表示
let currentPage = 1; // 現在のページ
let allPosts = []; // 全検索結果保存用

// =========================
// DOMキャッシュ（複数回使う要素はファイル上部にまとめて書くと毎回取得しなくていい）
// =========================
const resultSection = document.getElementById("resultSection");
const resultList = document.getElementById("resultList");
const resultTitle = document.getElementById("resultSectionTitle");
const resultCaption = document.getElementById("resultSectionCaption");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

// =========================
// バリデーションのための関数
// =========================
function validateForm() {
  // =========================
  // 入力フォームの値を取得
  // =========================
  // 投稿ID
  const postId = document.getElementById("postId").value.trim();
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

  errPostId.classList.remove("is-error-text", "search-form__error-text");
  errTitle.classList.remove("is-error-text", "search-form__error-text");
  errBody.classList.remove("is-error-text", "search-form__error-text");

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
      errPostId.classList.add("is-error-text", "search-form__error-text");
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
    errTitle.classList.add("is-error-text", "search-form__error-text");
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
    errBody.classList.add("is-error-text", "search-form__error-text");
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
    errSummary.innerHTML = `<p class="search-form__error-text is-error-text">入力に不備があります（${errors.length}件）</p>
    <ul class="search-form__error-list">${errors.map((e) => `<li class="search-form__error-text is-error-text">${e}</li>`).join("")}</ul>`;

    // フォーム上部にスクロール
    errSummary.scrollIntoView({ behavior: "smooth" });

    if (firstErrorElement) {
      firstErrorElement.focus();
    }
    return false;
  }
  return true;
}

function renderPage() {
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / LIMIT); // 小数点以下切り上げ

  // =========================
  // 検索結果0件
  // =========================
  if (totalPosts === 0) {
    renderPosts([]); // renderPosts の中のif (data.length === 0)につながる
    pageInfo.textContent = "0 / 0";

    prevBtn.disabled = true;
    nextBtn.disabled = true;

    return;
  }

  // =========================
  // 現在のページのデータを切り出す
  // =========================
  const start = (currentPage - 1) * LIMIT;
  const end = start + LIMIT;

  const paginatedData = allPosts.slice(start, end);

  renderPosts(paginatedData);

  // =========================
  // ページ情報更新
  // =========================
  pageInfo.textContent = `${currentPage} / ${totalPages}`;

  // =========================
  // ボタンの制御
  // =========================
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// =========================
// 検索結果が0件だった場合
// =========================
function renderEmpty() {
  resultList.innerHTML = "";

  resultTitle.textContent = "前人未到のルートへ、ようこそ。";
  // キャプション変更（<br>があるのでinnerHTML）
  resultCaption.innerHTML = `その道に、まだ「そらいろ」の記録はありません。<br />
    あなたが最初のドライバーになって、<br class="br-sm" />新しい物語を地図に刻んでみませんか？`;

  resultSection.hidden = false;
}

// =========================
// renderPageのイメージ図
// =========================
// renderPage()
//    ↓
// renderPosts(data)

// renderPosts()
//   ├ data.length === 0 → renderEmpty()
//   └ それ以外 → 通常描画

// catch内
//   └ renderError()
// ＜＜イメージ図ここまで＞＞

function renderPosts(data) {
  // 前回の検索結果をクリア
  resultList.innerHTML = "";

  // =========================
  // 検索結果が0件だった場合
  // =========================
  if (data.length === 0) {
    renderEmpty();
    return;
  }

  // =========================
  // 検索結果が1件以上ある場合
  // =========================

  // タイトルを通常文に戻す（戻さないと再度の検索でヒットしても0件の文になってしまうバグになるため）
  resultTitle.textContent = "あなたに届いた絶景の数々";

  resultCaption.innerHTML = `条件に合った投稿を一覧表示しています。<br />
  気になる写真をクリックして、詳細をのぞいてみましょう。`;

  data.forEach((post) => {
    const li = document.createElement("li");
    li.classList.add("search-result__item");

    // ランダムな画像で装飾
    const randomSeed = `${post.id}-${Math.floor(Math.random() * 10000)}`;
    const imageUrl = `https://picsum.photos/seed/${randomSeed}/1320`; // 画像が1列になる画面幅 * 2 を目安にしている

    li.innerHTML = `
    <a href="detail.html?id=${post.id}" class="post-card">
      <div class="image-wrapper">
        <span class="post-card__id">投稿ID: ${post.id}</span>
        <img src="${imageUrl}" alt="投稿ID ${post.id} のイメージ画像">
      </div>
      <div class="post-card__content">
        <p class="post-card__user-id">ユーザー${post.userId}</p>
        <h3 class="post-card__title">${post.title}</h3>
        <p class="post-card__body">${post.body}</p>
      </div>
    </a>`;

    resultList.appendChild(li);
  });
  // section表示
  resultSection.hidden = false;
}
// =========================
// submitの中のcatch部分を関数化
// =========================
function renderError() {
  resultList.innerHTML = "";

  resultTitle.textContent = "申し訳ありません。";
  resultCaption.innerHTML =
    "ネットワークエラーが発生しました。<br />時間をおいて再度お試しください。";
  resultSection.hidden = false;

  // ページネーションも止める
  prevBtn.disabled = true;
  nextBtn.disabled = true;
  pageInfo.textContent = "- / -";
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
    allPosts = data;
    currentPage = 1;

    renderPage();
  } catch (error) {
    renderError();
    console.error("一覧取得エラー", error);
  }
});

// =========================
// ボタンの動き
// =========================

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(allPosts.length / LIMIT);
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
});

// =========================
// 開発用ダミーデータ（スタイル調整用）
// =========================
const dummyData = [
  {
    id: 101,
    title: "開発用ダミー投稿",
    body: "スタイル調整のためのテキストです。",
    userId: 1,
  },
  {
    id: 102,
    title: "保存しても消えない",
    body: "これでカードのデザインが書きやすくなります。",
    userId: 2,
  },
  {
    id: 103,
    title: "なんとも便利！",
    body: "開発環境でのみ実行されるなんて！",
    userId: 3,
  },
  {
    id: 104,
    title: "コードの理解は大変だけど",
    body: "動くと楽しいね！",
    userId: 4,
  },
  {
    id: 105,
    title: "一連の処理をひとつの関数にするのではなく",
    body: "分離しておくとわかりやすくメンテしやすいです",
    userId: 5,
  },
  {
    id: 106,
    title: "JSON Placeholder すごい！",
    body: "Lorem Picsum の画像いいね！",
    userId: 6,
  },
  {
    id: 107,
    title: "Webデザイナー研修",
    body: "めっちゃおもろいやん！",
    userId: 7,
  },
  {
    id: 108,
    title: "周りを大切にするために",
    body: "まずは自分の心を満タンにしよう",
    userId: 8,
  },
  {
    id: 109,
    title: "通勤の必需品",
    body: "耳栓があるとストレスが減るのでおすすめです",
    userId: 9,
  },
  {
    id: 110,
    title: "新しいキーボード",
    body: "入力が楽で光るのが楽しいです",
    userId: 10,
  },
  {
    id: 111,
    title: "2ページ目",
    body: "ちゃんと動いた！",
    userId: 10,
  },
];

// =========================
// 開発環境でのみ表示 npm run devの時のみ実行
// =========================

if (import.meta.env.DEV) {
  allPosts = dummyData;
  currentPage = 1;
  renderPage();
}

// =========================
// IntersectionObserver
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(".gallery__item");

  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-show");
          observer.unobserve(entry.target); // 一度処理したら監視不要にする
        }
      });
    },
    {
      threshold: 0.3,
    },
  );

  targets.forEach((el) => observer.observe(el));
});
// IntersectionObserverここまで
