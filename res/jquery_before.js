// Enterキーで次の部品にフォーカスを移す
function fEnterChangeTab() {

	// ターゲット一覧
	let $items = $("input:not([type=radio]), #image_div span, select, textarea, div.checkbox");

  $items.keypress(function(e) {
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

$(document).on("change", "input[type=text]", function(e) {
	let $this = $(e.target);
	if ($this.val())
		$this.flowtype({
			maximum: 9999,
			minimum: 1,
			maxFont:  22,
			minFont:   1,
			fontRatio:  $this.val().length + 2
		});
});

$(document).on("change", "select", function(e) {
	let $this = $(e.target);
	if ($this.val())
		$this.flowtype({
			maximum: 9999,
			minimum: 1,
			maxFont:  22,
			minFont:   1,
			fontRatio:  $this.val().length + 2
		});
});

$(function() {

	fEnterChangeTab();

  // ページに対するファイルのドロップインを無効にする
	$(document).on('drop dragover', function(e) {
		return false;
	});

});
