// 文字サイズを調整する
$("input[type=text]").trigger('change');
$("select").trigger('change');

// アイテムプリセット閉じる動作を一括登録
$(document).on("click", "html", (e)=>{
    if(e.target.className.split(' ').indexOf('item_name') == -1){
        vm.hideItemPreset();
    }
});
