// Enterキーで次の部品にフォーカスを移す
function fEnterChangeTab() {

	// ターゲット一覧
	let $items = $("input:not([type=radio]), #image_div span, select, textarea, div.checkbox");

	$items.keypress(function (e) {
		let c = e.which ? e.which : e.keyCode; // クロスブラウザ対応
		if (c == 13 && ($(e.target).prop("tagName") != 'TEXTAREA')) {
			let index = $items.index(this); // indexは0～
			let nLength = $items.length;
			while (true) {
				if (!e.shiftKey) {
					index++;
					if (index >= nLength) index = 0;
				} else {
					index--;
					if (index < 0) index = nLength - 1;
				}

				let $target = $items.eq(index);

				if ($target.attr("readonly") != "readonly" &&
					$target.prop("disabled") != true &&
					$target.is(':visible')) {
					break;
				}
			}
			$items.eq(index).focus();
			e.preventDefault();
		}
		return true;
	});
};


console.log("登録！！！");

$(document).on("change", "input[type=text]", function (e) {
	let $this = $(e.target);
	if ($this.val())
		$this.flowtype({
			maximum: $this.width() * 2,
			minimum: 1,
			maxFont: 22,
			minFont: 1,
			fontRatio: $this.val().length
		});
});

$(document).on("change", "select", function (e) {
	let $this = $(e.target);
	if ($this.val())
		$this.flowtype({
			maximum: $this.width() * 2,
			minimum: 1,
			maxFont: 22,
			minFont: 1,
			fontRatio: $this.val().length + 2
		});
});

// アイテムプリセット閉じる動作を一括登録
$(document).on("click", "html", (e) => {
	if (e.target.className.split(' ').indexOf('item_name') == -1) {
		vm.hideItemPreset();
	}
}).on("focus", "input, textarea, div.checkbox, select", (e) => {
    let classArr = e.target.className.split(' ');
	if (classArr.indexOf('item_name') == -1) {
		vm.hideItemPreset();
	} else {
        let matches = e.target.className.match(/item_(\d)/);
        vm.showItemPreset(Number(matches[1]) - 1);
    }
});

$(function () {

	fEnterChangeTab();

	// ページに対するファイルのドロップインを無効にする
	$(document).on('drop dragover', function (e) {
		return false;
	});

});
