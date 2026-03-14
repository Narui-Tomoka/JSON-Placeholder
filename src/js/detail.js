// detail.js で行う5つの処理
// ① URLからid取得
// ② idチェック
// ③ 投稿データ取得（GET）
// ④ 更新処理（PUT / PATCH）
// ⑤ 削除処理（DELETE）

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

// =====================
// 初期処理をinit()内にまとめる（データ取得から表示までの初期表示をつくる部分）
// =====================
init();

function init() {
  // IDチェックして問題なければfetchPost()実行してAPI通信
  if (!postId || isNaN(Number(postId))) {
    console.log("IDが不正です");
    return;
  }

  fetchPost();

  // 更新処理（PUT）＆削除処理（DELETE）の準備
  updateBtn.addEventListener("click", updatePost);
  deleteBtn.addEventListener("click", deletePost);
}

// =====================
// fetch
// =====================
async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTPエラー：${response.status}`);
  }

  return response.json();
}

// =====================
// 投稿取得
// =====================
async function fetchPost() {
  try {
    const data = await fetchJson(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
    );

    console.log("取得した投稿：", data);

    // ここからはデータをフォームにセットするrenderPost()関数にバトンタッチ

    renderPost(data);
  } catch (error) {
    console.error(error);
  }
}

// =====================
// 投稿表示
// =====================
function renderPost(post) {
  postIdEl.textContent = post.id;
  userIdEl.value = post.userId;
  titleEl.value = post.title;
  bodyEl.value = post.body;
}

// =====================
// 更新処理
// =====================
async function updatePost() {
  if (!confirm("大切な記録を書き換えてもよろしいですか？")) {
    return;
  }
  const body = {
    id: postId,
    userId: userIdEl.value,
    title: titleEl.value,
    body: bodyEl.value,
  };

  try {
    const data = await fetchJson(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    console.log("更新結果：", data);
    alert("更新成功！");
  } catch (error) {
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

  try {
    await fetchJson(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: "DELETE",
    });

    alert("削除しました");

    window.location.href = "index.html";
  } catch (error) {
    console.error("削除失敗：", error);
    alert("削除に失敗しました");
  }
}
