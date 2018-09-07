const pdfSaver = function() {

	//スクロール禁止用関数
	let no_scroll = function() {
		//PC用
		var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
		$(document).on(scroll_event,function(e){e.preventDefault();});
		//SP用
		$(document).on('touchmove.noScroll', function(e) {e.preventDefault();});
	}

	//スクロール復活用関数
	let return_scroll = function() {
		//PC用
		var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
		$(document).off(scroll_event);
		//SP用
		$(document).off('.noScroll');
	}

	let getFileName = function() {

		// ファイル名はキャラ名か現在日付
		let fileName = vm.getSaveJson()["name"];
		if (!fileName || fileName.length == 0) {
			fileName = getNow();
		}
		return fileName;

	}

	let getNow = function() {
		let d = new Date();
		let year = ('00' + d.getFullYear()).slice(-4);
		let month = ('00' + d.getMonth() + 1).slice(-2);
		let day = ('00' + d.getDate()).slice(-2);
		return year + month + day;
	};

	return {
		doSave: function() {

			vm.setPdfCapturing(true);
			no_scroll();
			$("div#render_space").addClass('rendering');
			$("html,body").animate({ scrollTop: 0 }, 200);

			setTimeout(function() {

				setTimeout(function() {
					showOverlay("PDFファイルを作っているよ。<br>ちょっと待ってね。");
				}, 0);

				html2canvas(document.getElementById("render_space"), {
					onrendered: function (canvas) {
						var dataURI = canvas.toDataURL("image/png");

						var pdf = new jsPDF();

						pdf.addImage(dataURI, 'JPEG', 0, 0);

						// ファイル名
						var fileName = getFileName();
						fileName += ".pdf";

						pdf.save(fileName);

						showOverlay(false);
						vm.setPdfCapturing(false);
						return_scroll();
						$("button#tool_menu").css('display', '');
						$("div#render_space").removeClass('rendering');
					}
				});
			}, 0);

		}
	}
}();
