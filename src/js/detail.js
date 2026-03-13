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

// 更新＆削除ボタン
const updateBtn = document.querySelector("#updateBtn");
const deleteBtn = document.querySelector("#deleteBtn");

// IDチェックして問題なければfetchPost()実行してAPI通信
if (!postId || isNaN(Number(postId))) {
  console.log("IDが不正です");
} else {
  fetchPost();
}

// 更新処理（PUT）＆削除処理（DELETE）
updateBtn.addEventListener("click", updatePost);
deleteBtn.addEventListener("click", deletePost);

// API通信で投稿データを取得してコンソールに表示する関数
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

// 更新処理（PUT）のための関数
async function updatePost() {
  const userId = document.querySelector("#userId").value;
  const title = document.querySelector("#title").value;
  const body = document.querySelector("#body").value;

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: postId,
          userId: userId,
          title: title,
          body: body,
        }),
      },
    );

    const data = await response.json();

    console.log("更新結果：", data);
    alert("更新成功！");
  } catch (error) {
    console.error("更新失敗：", error);
  }
}

// 投稿削除（DELETE）関数
async function deletePost() {
  if (!confirm("本当に投稿を削除してもよろしいですか？")) {
    return;
  }

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      {
        method: "DELETE",
      },
    );

    console.log("削除成功");
    alert("削除しました！");
    window.location.href = "index.html";
  } catch (error) {
    console.error("削除失敗：", error);
    alert("削除に失敗しました");
  }
}
