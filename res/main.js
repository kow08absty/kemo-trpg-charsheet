$(function () {
	if (typeof Blob !== "undefined") {
		// alert('このブラウザに対応しています');
	} else {
		alert('このブラウザには対応していません');
	}

	var pdfValid = false;
	var userAgent = window.navigator.userAgent.toLowerCase();
	if (userAgent.indexOf('msie') != -1 ||
		userAgent.indexOf('trident') != -1) {
		// IE
	} else if (userAgent.indexOf('edge') != -1) {
		// Edge
	} else if (userAgent.indexOf('chrome') != -1) {
		// Chrome
		pdfValid = true;
	} else if (userAgent.indexOf('safari') != -1) {
		// safari
	} else if (userAgent.indexOf('firefox') != -1) {
		// FireFox
	} else if (userAgent.indexOf('opera') != -1) {
		// Opera
	} else {
		// 知らんやつ
	}
	if (pdfValid) {
		$("#savePdf").show();
	} else {
		$("#savePdf").hide();
	}

	$(document).on("click", "button#save", writeHtml);

	$(document).on("change", "input[name=background]:radio", function () {
		var value = $(this).val();
		changeBackgroundImage(value);
	});

	$(document).on("click", ".arrow.left", function () {
		imageShift(-1);
	});
	$(document).on("keypress", ".arrow.left", function () {
		imageShift(-1);
	});

	$(document).on("click", ".arrow.right", function () {
		imageShift(1);
	});

	$(document).on("click", "#image span", function () {

		var fileObj = $('<input type="file" accept=".png,.jpeg,.jpg,.png">');

		fileObj.on('change', function (event) {
			var file = event.target.files[0];
			viewFile(file);
		});

		fileObj.click();
	});

	$(document).on("click", "#background", function () {
		$(':focus').blur();
	});

	$(document).on("drop", "#image", function (_e) {
		var e = _e;
		if (_e.originalEvent) {
			e = _e.originalEvent;
		}
		e.stopPropagation();
		e.preventDefault();

		var dt = e.dataTransfer;
		var files = dt.files;
		console.log(files);
	});

	$(document).on("change", "input[type=text]", function (e) {
		var $this = $(e.target);
		$this.flowtype({
			maximum: 999999,
			minimum: 1,
			maxFont: 22,
			minFont: 1,
			fontRatio: $this.val().length
		});
	});

	$(document).on("change", "select", function (e) {
		var $this = $(e.target);
		$this.flowtype({
			maximum: 9999,
			minimum: 1,
			maxFont: 22,
			minFont: 1,
			fontRatio: $this.val().length
		});
	});

	$(document).on("click", ".checkbox", function (e) {
		if ($(this).hasClass("unchecked")) {
			$(this).removeClass("unchecked");
			$(this).addClass("checked");
		} else {
			$(this).removeClass("checked");
			$(this).addClass("unchecked");
		}
	});

	$("#large").on("change", function () {
		var large = $(this).val();
		$("#health").val(largeMap[large]["health"]);
		$("#coin").val(largeMap[large]["coin"]);

		startBlinkAnim($("#health"));
		startBlinkAnim($("#coin"));
		//setTimeout(function() {
		//	alert("“げんき”と“ジャパリコイン”を再設定したよ。");
		//}, 0);
	});

	$("#savePdf").click(function () {
		$(".pdf_hide").hide();
		$(".pdf_special").addClass("on");
		$("div#render_space").addClass('rendering');
		$("html,body").animate({ scrollTop: 0 }, 200);
		viewOverlay("PDFファイルを作っているよ。<br>ちょっと待ってね。");
		setTimeout(function () {
			no_scroll();
			html2canvas(document.getElementById("render_space"), {
				onrendered: function (canvas) {
					var dataURI = canvas.toDataURL("image/png");

					var pdf = new jsPDF();

					pdf.addImage(dataURI, 'JPEG', 0, 0);

					// ファイル名
					var fileName = getFileName();
					fileName += ".pdf";

					pdf.save(fileName);
					viewOverlay(false);
					$(".pdf_hide").show();
					$("button#tool_menu").css('display', '');
					$(".pdf_special").removeClass("on");
					$("div#render_space").removeClass('rendering');
					return_scroll();
				}
			});
		}, 200);
	});

	for (skill in skills) {
		$("#skill_type").append($('<option value="' + skill + '">' + skill + '</option>'));
	}

	$("#skill_type").change(function () {
		var skill = skills[$(this).val()];
		//var alertFlg = false;
		if ($("#wild_burst").val() != skill["wild_burst"]) {
			//alertFlg = true;

			startBlinkAnim($("#wild_burst"));
		}
		if ($("#shine_max").val() != skill["shine_max"]) {
			startBlinkAnim($("#shine_max"));
		}
		$("#skill_effect").val(skill["effect"]);
		startBlinkAnim($("#skill_effect"));
		$("#wild_burst").val(skill["wild_burst"]);
		$("#shine_max").val(skill["shine_max"]);

		var $shine = $("#shine");
		$shine.attr("max", skill["shine_max"]);
		if (Number($shine.val()) > skill["shine_max"]) {
			$shine.val(skill["shine_max"]);
			startBlinkAnim($shine);
		}

		//if (alertFlg) {
		//	setTimeout(function() {
		//		//alert("“キラキラ最大値”と“野生解放上限”を変更したよ。");

		//	}, 0);
		//}
	});

	$('button.tool_switch_small_screen').on('click', () => {
		if ($('div#tool_box').css('display') == 'block') {
			$('div#tool_box').hide(150, () => {
				$('div#tool_box').css('display', '');
			});
		} else {
			$('div#tool_box').show(150);
		}
	});

	// for(key in initItem){
	// 	$('select.item_name').each((idx, elem) => {
	// 		$option = $('<option>')
	// 			.val(key)
	// 			.text(initItem[key]['name']);
	// 		$(elem).append($option);
	// 	});
	// 	$('.item_name').on('change', () => {
	// 		alert($(this).attr('class'));
	// 	});

	// }

	// $('select.item_name').each((idx, elem) => {
	// 	$(elem).editableSelect({ filter: false, effects: 'fade' });
	// });
});

function imageShift(diff) {
	var $target = $("#image #thumb");
	if ($target.length == 0) { return; }
	var leftPadding = $target.css("padding-left");
	if (!leftPadding) {
		leftPadding = "0px";
	}
	leftPadding = Number(leftPadding.substring(0, leftPadding.length - 2)) + diff;
	$target.css("padding-left", leftPadding + "px");
}

var largeMap = {
	"2": { "health": "2", "coin": "3" },
	"3": { "health": "3", "coin": "2" },
	"4": { "health": "4", "coin": "1" },
};

var backgroundImage = {
	"normal": "./res/image/sheet_normal.png",
	"blue": "./res/image/sheet_blue.png",
	"green": "./res/image/sheet_green.png",
	"pink": "./res/image/sheet_pink.png",
	"black": "./res/image/sheet_black.png"
};

var initItem = {
	"0": { 'name': 'ジャパリまん', 'effect': '' },
	"1": { 'name': 'リング', 'effect': '' },
	"2": { 'name': 'ウェポン', 'effect': '' },
	"3": { 'name': 'ニンブルハンド', 'effect': '' }
};

function isChecked($element) {
	return ($element.hasClass('checked')) ? true : false;
}

//スクロール禁止用関数
function no_scroll() {
	//PC用
	var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
	$(document).on(scroll_event, function (e) { e.preventDefault(); });
	//SP用
	$(document).on('touchmove.noScroll', function (e) { e.preventDefault(); });
}

//スクロール復活用関数
function return_scroll() {
	//PC用
	var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
	$(document).off(scroll_event);
	//SP用
	$(document).off('.noScroll');
}

function changeBackgroundImage(value) {
	var $target = $("#background");
	visibilityFadeIn($('div.loading-icon-container'), 0);
	$('.waitForReady').each((idx, elem)=>{
		visibilityFadeOut($(elem));
	});
	setTimeout(()=>{
		$target.attr("class", value);
		$target.attr("src", backgroundImage[value]);
		$target.css('visibility', 'hidden');
	}, 300);
}

function setFormData(json) {
	var backgroundFlg = false;
	for (selector in json) {
		var value = json[selector];

		var $target = $(selector);

		var tagName = $target.prop("tagName")
		if (tagName) {
			tagName = tagName.toLowerCase();
		}

		if (selector.indexOf("#background") != -1) {
			changeBackgroundImage(value);
			backgroundFlg = true;
		} else if ("input" == tagName) {
			var type = $target.attr("type");
			if ("text" == type) {
				$target.val(value);
			} else if ("checkbox" == type) {
				$target.prop("checked", value);
			} else if ("number" == type) {
				$target.val(value);
			} else {
				console.log("想定外：input[type=" + type + "] selector:" + selector);
			}
		} else if ("select" == tagName) {
			$target.val(value);
		} else if ("textarea" == tagName) {
			$target.val(value);
		} else if ("div" == tagName) {
			if ($target.hasClass("checkbox")) {
				if (value) {
					$target.click();
				}
			} else {
				console.log("想定外：selector:" + selector);
			}
		} else {
			console.log("想定外：selector:" + selector);
		}
	}
	if (!backgroundFlg) {
		changeBackgroundImage("normal");
	}
}

function visibilityFadeIn($target, duration=300, callback=()=>{}){
	$target
		.css({'opacity': 0, 'visibility': 'visible'})
		.animate({'opacity': 1}, duration, callback);
}

function visibilityFadeOut($target, duration=300, callback=()=>{}){
	$target
		.css({'opacity': 1, 'visibility': 'visible'})
		.animate({'opacity': 0}, duration, ()=>{
            $target.css('visibility', 'hidden');
            callback();
        });
}

var selectors = [
	"#background",
	"#name",
	// "#identity_check",
	"#identity",
	"#large",
	"#special_ability_1",
	"#special_ability_2",
	"#special_ability_3",
	"#weak_ability_1",
	"#weak_ability_2",
	"#weak_ability_3",
	"#shine",
	"#shine_max",
	"#health",
	"#coin",
	".item_name.item_1",
	"textarea.item_effect.item_1",
	".item_name.item_2",
	"textarea.item_effect.item_2",
	".item_name.item_3",
	"textarea.item_effect.item_3",
	"#KP",
	// "#KP_check",
	"#wild_burst",
	"#skill_name",
	"#skill_type",
	"#skill_effect",
	"#skill_role",
	"input.friends.friends_1[type=text]",
	// ".friends.friends_1.checkbox",
	"input.friends.friends_2[type=text]",
	// ".friends.friends_2.checkbox",
	"input.friends.friends_3[type=text]",
	// ".friends.friends_3.checkbox",
	"input.friends.friends_4[type=text]",
	// ".friends.friends_4.checkbox",
	"input.friends.friends_5[type=text]",
	// ".friends.friends_5.checkbox",
	"input.friends.friends_6[type=text]",
	// ".friends.friends_6.checkbox",
	"#player",
	// ".medal.medal1",
	// ".medal.medal2",
	// ".medal.medal3",
	// ".medal.medal4",
	// ".medal.medal5",
	// ".medal.medal6"
];

var skills = {
	"野生本能": {
		"effect": "野生解放の上限値を3にする。行動済みになった時、野生解放をリチェックする。ただし、キラキラを持てる上限値に-3する（初期上限値が9になる）。常時効果。",
		"wild_burst": "3",
		"shine_max": "9"
	},
	"集団統率": {
		"effect": "野生解放の上限値を1にする。主動フレンズの時、「けもリンク」した自分以外のフレンズの数だけ判定のサイコロを増加できる。ただし、キラキラを持てる上限値に-3する（初期上限値が9になる）。常時効果。",
		"wild_burst": "1",
		"shine_max": "9"
	},
	"ダイス操作・固定": {
		"effect": "判定に使うサイコロを1個減らす代わりに、判定ダイス1個の出目を任意の数字にする。KP1点消費。補助行動。",
		"wild_burst": "2",
		"shine_max": "12"
	},
	"ダイス操作・回数": {
		"effect": "あなたが判定のサイコロを振った直後に使える。あなたの判定ダイスすべてを振りなおす。KP1点消費。このスキルは1タイムに野生解放の上限値と等しい回数まで使える。補助行動。",
		"wild_burst": "2",
		"shine_max": "12"
	},
	"目標選択・複数": {
		"effect": "フィールドでの判定の直前。フロントから目標を2つ同時に選べる。判定ダイスは、それぞれの分必要。キラキラ3個消費。補助行動。",
		"wild_burst": "2",
		"shine_max": "12"
	},
	"目標選択・延長": {
		"effect": "フィールドでの判定の直前。判定に使うサイコロを1個減らす代わりに、となりのフィールドエリアを目標にできる。キラキラ3個消費。補助行動。",
		"wild_burst": "2",
		"shine_max": "12"
	},
	"回復能力": {
		"effect": "任意の数のフレンズ(PC,NPC)を目標とし、3点の回復点を割り振って目標の「げんき」を回復させる。KP1点消費。主行動。フィールド時はバックサイドのみ使用可能。",
		"wild_burst": "2",
		"shine_max": "12"
	},
	"防御能力": {
		"effect": "①野生解放の上限値までのKPを消費すると、自分へのダメージを支払ったKP×2点軽減する。補助行動。\n②いつでも何度でもフレンズかオブジェクトに与えられたダメージを「かばう」ことで任意の点数引き受けることができる。",
		"wild_burst": "2",
		"shine_max": "12"
	},
	"妨害能力": {
		"effect": "フィールドにいる時、セルリアンまたはプロブレム（敵対フレンズ含む）1体の主行動の宣言の直後に使用できる。その主行動1つの効果を無効化する。KP1点消費。補助行動。",
		"wild_burst": "2",
		"shine_max": "12"
	}
};

function viewOverlay(content) {
	if (content == false) {
		$("#overlay").fadeOut(50);
	} else {
		$("div#overlay_content").html(content);
		$("#overlay").fadeIn(50);
	}
}

function createJson() {
	var json = new Object();
	selectors.forEach(function (selector) {
		var value;
		var $target = $(selector);
		var tagName = $target.prop("tagName")
		if (tagName) {
			tagName = tagName.toLowerCase();
		}

		if ("#background" == selector) {
			value = $target.attr("class");
		} else if ("input" == tagName) {
			var type = $target.attr("type");
			if ("text" == type) {
				value = $target.val();
			} else if ("checkbox" == type) {
				value = $target.prop("checked");
			} else if ("number" == type) {
				value = $target.val();
			} else {
				console.log("想定外：input[type=" + type + "] selector:" + selector);
			}
		} else if ("select" == tagName) {
			value = $target.val();
		} else if ("textarea" == tagName) {
			value = $target.val();
		} else if ("div" == tagName) {
			if ($target.hasClass("checkbox")) {
				value = $target.hasClass("checked");
			} else {
				console.log("想定外：selector:" + selector);
			}
		} else {
			console.log("想定外：selector:" + selector);
		}
		json[selector] = value;
	});
	return json;
}

function getHeadHtml() {

	var newHead = $(document).find("head").clone();
	var $data = newHead.find("#data_head");
	newHead.find("title").html(getFileName());

	var dataStr = "var formData = ";
	dataStr += JSON.stringify(createJson(), null, "\t\t\t");
	dataStr += ";\n";

	$data.html(dataStr);

	return newHead.prop("outerHTML");
}

function getBodyHtml() {
	var $body = $("body");
	return $body.prop("outerHTML");
}

/*
 * HTMLを保存する
 */
function writeHtml() {

	var html = "<!DOCTYPE html>";
	html += "<html>\n";
	html += getHeadHtml();
	html += "\n";
	html += getBodyHtml();
	html += "\n</html>";

	// ファイル名
	var fileName = getFileName();
	fileName += ".html";

	var contents = html;

	fileDownload(contents, fileName);
	/*
	var aObj = document.createElement('a');
	aObj.href = window.URL.createObjectURL(new Blob([ contents ], { "type" : "text/plain" }));
	aObj.dataset.downloadurl = ["text/plain", aObj.download, aObj.href].join(":");
	aObj.download = fileName;
	aObj.click();
	*/

}

function getFileName() {

	// ファイル名はキャラ名か現在日付
	var fileName = $("#name").val();
	if (!fileName || fileName.length == 0) {
		fileName = getNow();
	}
	return fileName;

}

function getNow() {
	var d = new Date();
	var year = ('00' + d.getFullYear()).slice(-4);
	var month = ('00' + d.getMonth() + 1).slice(-2);
	var day = ('00' + d.getDate()).slice(-2);
	return year + month + day;
}

function startBlinkAnim($target) {
	$target.css('background-color', '#e8e');
	setTimeout(function () {
		$target.animate({
			backgroundColor: 'transparent'
		}, 700);
	}, 200);
}
