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
		let fileName = vm.$refs.contents.data.name;
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
		doSave: function(callback = ()=>{}) {
			vm.setPdfCapturing(true);
			no_scroll();
			$("div#render_space").addClass('rendering');
			$("div#content_wrapper").css('display', 'block');
			$("html,body").animate({ scrollTop: 0 }, 200);
			setTimeout(()=>{
				html2canvas(document.getElementById("render_space"), {
					onrendered: function (canvas) {
						const dataURI = canvas.toDataURL("image/png");

						const pdf = new jsPDF();

						pdf.addImage(dataURI, 'JPEG', 0, 0);

						setTimeout(() => {
							pdf.save(getFileName() + ".pdf");

							vm.$refs.overlay.showOverlay(false);
							vm.setPdfCapturing(false);
							return_scroll();
							$("button#tool_menu").css('display', '');
							$("div#render_space").removeClass('rendering');
							$("div#content_wrapper").css('display', '');
							callback();
						}, 180);
					}
				});

				setTimeout(() => {
					vm.$refs.overlay.showOverlay("PDFファイルを作っているよ。<br>ちょっと待ってね。");
				}, 60);
			}, 200);
		}
	}
}();
