const htmlSaver = function() {

	let getHeadHtml = function() {

		let newHead = $(document).find("head").clone();
		let $data = newHead.find("#data_head");
		newHead.find("title").html(getFileName());

		let dataStr = "\nconst charactorData = ";
		dataStr += JSON.stringify(vm.getSaveJson(), null, "\t");
		dataStr += ";\n";

		$data.html(dataStr);

		return newHead.prop("outerHTML");
	}

	let getBodyHtml = function() {
		let $body = $("body").clone();
		let $app = $body.find("#app");
		$app.empty();
		$app.html(`
			<custom-header ref="header"></custom-header>
			<custom-contents ref="contents"></custom-contents>
			<custom-overlay ref="overlay"></custom-overlay>
			<custom-footer ref="footer"></custom-footer>
		`);
		return $body.prop("outerHTML");
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

	let downloadFile = function(content, fileName) {
		// ダウンロードしたいコンテンツ、MIMEType、ファイル名
		let mimeType = 'text/html';

		// BOMは文字化け対策
		let bom  = new Uint8Array([0xEF, 0xBB, 0xBF]);
		let blob = new Blob([bom, content], {type : mimeType});

		let a = document.createElement('a');
		a.download = fileName;
		a.target   = '_blank';

		if (window.navigator.msSaveBlob) {
		  // for IE
		  window.navigator.msSaveBlob(blob, fileName)
		}
		else if (window.URL && window.URL.createObjectURL) {
		  // for Firefox
		  a.href = window.URL.createObjectURL(blob);
		  document.body.appendChild(a);
		  a.click();
		  document.body.removeChild(a);
		}
		else if (window.webkitURL && window.webkitURL.createObject) {
		  // for Chrome
		  a.href = window.webkitURL.createObjectURL(blob);
		  a.click();
		}
		else {
		  // for Safari
		  window.open('data:' + mimeType + ';base64,' + window.Base64.encode(content), '_blank');
		}
	};

	return {
		doSave: function() {

			let html = "<!DOCTYPE html>";
			html += "<html>\n";
			html += getHeadHtml();
			html += "\n";
			html += getBodyHtml();
			html += "\n</html>";

			// ファイル名
			let fileName = getFileName();
			fileName += ".html";

			let contents = html;

			downloadFile(contents, fileName);
		}
	}
}();
