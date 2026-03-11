// detail.js で行う5つの処理
// ① URLからid取得
// ② idチェック
// ③ 投稿データ取得（GET）
// ④ 更新処理（PUT / PATCH）
// ⑤ 削除処理（DELETE）

// まずはページを開いたときにURLからidを取得してコンソールで確認。

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

console.log("取得したID：", postId);

if (!postId || isNaN(Number(postId))) {
  console.log("IDが不正です");
}
