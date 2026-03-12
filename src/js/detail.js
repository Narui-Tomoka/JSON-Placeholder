// detail.js で行う5つの処理
// ① URLからid取得
// ② idチェック
// ③ 投稿データ取得（GET）
// ④ 更新処理（PUT / PATCH）
// ⑤ 削除処理（DELETE）

// ページを開いたときにURLからidを取得してコンソールで確認。

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

console.log("取得したID：", postId);

// IDチェックして問題なければfetchPost()実行してAPI通信
if (!postId || isNaN(Number(postId))) {
  console.log("IDが不正です");
} else {
  fetchPost();
}

// API通信で投稿データを取得してコンソールに表示
async function fetchPost() {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
    );

    if (!response.ok) {
      throw new Error("投稿の取得に失敗しました");
    }

    const data = await response.json();

    console.log("取得した投稿：", data);

    // ここからフォームの要素取得
    const postIdEl = document.getElementById("postId");
    const userIdEl = document.getElementById("userId");
    const titleEl = document.getElementById("title");
    const bodyEl = document.getElementById("body");

    // データをフォームにセット
    postIdEl.textContent = data.id;
    userIdEl.value = data.userId;
    titleEl.value = data.title;
    bodyEl.value = data.body;
  } catch (error) {
    console.error(error);
  }
}
