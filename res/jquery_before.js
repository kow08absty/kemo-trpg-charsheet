'use strict';

// Enterキーで次の部品にフォーカスを移す
function fEnterChangeTab() {

	// ターゲット一覧
	const $items = $("input:not([type=radio]), #image_div span, select, textarea, div.checkbox");

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

				const $target = $items.eq(index);

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
	const $this = $(e.target);
	if ($this.val())
		$this.flowtype({
			maximum: 9999,
			minimum: 1,
			maxFont: 22,
			minFont: 1,
			fontRatio: $this.val().length
		});
});

$(document).on("change", "select", function (e) {
	const $this = $(e.target);
	if ($this.val())
		$this.flowtype({
			maximum: 9999,
			minimum: 1,
			maxFont: 22,
			minFont: 1,
			fontRatio: $this.val().length + 2
		});
});

// アイテムプリセット制御の動作を一括登録
$(document).on("click", "html", (e) => {
	const $target = $(e.target);
	if (!$target.hasClass('item_name')) {
		vm.hideItemPreset();
	}
})
.on('keydown', 'input', (e) => {
	const $target = $(e.target);
	if ($target.hasClass('item_name')) {
		vm.hideItemPreset();
	}
})
.on("focus", "input, textarea, div.checkbox, select", (e) => {
	const $target = $(e.target);
	if(!$target.attr('class'))
		return;
	const matches = $target.attr('class').match(/item_(\d)/);
	if (!$target.hasClass('item_name')) {
		vm.hideItemPreset();
	} else if(matches) {
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
