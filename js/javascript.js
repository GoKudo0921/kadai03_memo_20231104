// 登録をクリックしたらローカルストレージにデータを入れる。かつ画面上にタスクが表示される
$("#submit").on("click", function () {
  // タスクが空だったらアラートを出す
  if ($("#textarea").val() === "") {
    alert("タスクを記載してくださいね");
  }

  // 問題なければタスクを登録。文字の削除
  else {
    const task = $("#textarea").val();

    //タスクをオブジェクトとして格納
    const taskobject = {
      taskname: task,
      completed: false,
    };

    // 上のオブジェクトを配列として、ローカルストレージに保存（JSONに変換して保存する必要がある）
    // まずデータをJSONからParseして、取得。その後にデータ追加
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskobject);

    // その配列をローカルストレージに保存（ここでJSONに再度変換）
    localStorage.setItem("tasks", JSON.stringify(tasks));

    const html = `
            <tr>
            <td>
                  <p>${task.taskname}</p>
            </td>
            <td>
                  <button class="completed">完了</button> 
            </td>
            <td>
                  <button class="delete">削除</button>
            </td>
            </tr>
            `;

    $("#result").append(html);

    $("#textarea").val("");
    // めちゃ早く登録するとローカルストレージがうまく読み込まれないことがあるので、ページを再読み込みする
    setTimeout(function () {
      location.reload();
    }, 1);
  }
});

//タスクの全削除
$("#all-delete").on("click", function () {
  if (confirm("本当に削除しますか？")) {
    localStorage.clear();
    $("#result").empty();
  }
});

//ページ読み込み時にローカルストレージを読み込んでデータを表示
if (localStorage.getItem("tasks")) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  for (const task of tasks) {
    //配列からタスクを取る

    const html = `
      <tr>
            <td>
                  <p>${task.taskname}</p>
            </td>
            <td>
                  <button class="completed">${
                    task.completed == "done" ? "未完了に戻す" : "完了"
                  }</button>
            </td>
            <td>
                  <button class="delete">削除</button>
            </td>
      </tr>
      `;

    $("#result").append(html);

    // 配列内のCopletedプロパティがDoneだったら、その親要素にDoneというクラスを入れる＝グレーアウトされる
    if (task.completed == "done") {
      $("#result")
        .find("p:contains('" + task.taskname + "')")
        .parent()
        .parent()
        .addClass("done");
    }
  }
}

// 削除ボタンを押すと該当のタスクだけが削除される
$("#result").on("click", ".delete", function () {
  //ボタンのIDではうまくいかず、親要素を指定して、その後にボタンを指定したら行けたhttps://webcreatetips.com/coding/1683/
  const value = $(this).parent().parent().find("p").text(); //親要素のPを探しに行くために、ParentとFindを使う

  if (confirm("本当に削除しますか？")) {
    // ローカルストレージのタスクを読み込んで、該当するものを削除する
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const newtasks = tasks.filter((task) => task.taskname == value); //該当のタスクをフィルターする
    const index = tasks.indexOf(newtasks[0]); //配列の中で該当のタスクが何番目かを探す

    // spliceメソッドを使って、削除する。indexには該当の配列のN番目が入って、1は削除を意味する
    tasks.splice(index, 1);

    // ローカルストレージの値を更新する
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // 画面上からも削除する
    $(this).parent().parent().remove();

    // うまく読み込まれないことがあるので、0.5秒後にページを再読み込みする
    setTimeout(function () {
      location.reload();
    }, 500);
  }
});

// 完了ボタンを押すと、該当のタスクの場所がグレーアウトされる
$("#result").on("click", ".completed", function () {
  const value = $(this).parent().parent().find("p").text(); //完了ボタンが所属する親要素を取得

  const tasks = JSON.parse(localStorage.getItem("tasks")); //JSONを配列に戻す
  const newtasks = tasks.filter((task) => task.taskname == value); //該当のボタンが含まれる行をフィルタする

  if (newtasks[0].completed == "done") {
    //もしDoneだったら
    newtasks[0].completed = "false"; //ローカルストレージのフォルスに戻す
    $(this).parent().parent().removeClass("done"); //クラスを失くす＝背景色が適用されなくなる
    $(this).html("完了"); //ボタンを完了ボタンに変える
  } else {
    newtasks[0].completed = "done"; //完了を押した要素のCompletedをdoneに変える
    $(this).parent().parent().addClass("done"); //Doneクラスを入れる。CSSで背景色設定しているので、変わるはず
    $(this).html("未完了に戻す"); //未完了に戻すボタンに変える
  }
  localStorage.setItem("tasks", JSON.stringify(tasks)); //JSONに変換して、ローカルストレージに格納する
});
