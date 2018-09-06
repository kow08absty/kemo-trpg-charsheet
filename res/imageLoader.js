const imageLoader = function() {

	let clickSelectFile = function() {

			var fileObj  = $('<input type="file" accept=".png,.jpeg,.jpg,.png">');

			fileObj.on('change', function(event) {
				var file = event.target.files[0];
				vm.imageLoading();
				viewFile(file);
			});

			fileObj.click();

	}

	let viewFile = function(file) {

		if(!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
			vm.setImageError();
			return;
		}

		let $photoArea = $('#image_div');

		let reader = new FileReader();
		reader.onload = function(e) {
			// オリジナルの画像データ(data:image/jpeg;base64,xxxxx形式の文字列)
			let dataUrl = e.target.result;

			createThumbnail(dataUrl, function(thumbnail, w, h) {

				let paddingLeftMax = $photoArea.width() - w;
				let paddingLeft = paddingLeftMax > 0 ? paddingLeftMax / 2 : 0;

				let paddingTopMax = $photoArea.height() - h;
				let paddingTop = paddingTopMax > 0 ? paddingTopMax / 2 : 0;

				let imageObj = {
					"data": thumbnail,
					"padding_top": parseInt(paddingTop),
					"padding_left": parseInt(paddingLeft)
				};
				vm.setImage(imageObj);

			});
		}
		reader.readAsDataURL(file);

	}

	let createThumbnail = function(dataUrl, callback) {

		// サムネイル領域のサイズ
		let thumbAreaWidth = $('#image_div').width();
		let thumbAreaHeight = $('#image_div').height();

		let imageObj = new Image();
		imageObj.onload = function() {
			// サムネイル領域に収まる画像のサイズを計算
			let maxSize = Math.max(thumbAreaWidth, thumbAreaHeight);
			let w = imageObj.width;
			let h = imageObj.height;

			if (w > thumbAreaWidth || h > thumbAreaHeight) {
				let scale = Math.min(thumbAreaWidth / w, thumbAreaHeight / h);
				w = parseInt(w * scale);
				h = parseInt(h * scale);
			}

			// サムネイルを作成
			let canvas = document.createElement('canvas');
			let ctx = canvas.getContext('2d');
			canvas.width = w;
			canvas.height = h;
			ctx.drawImage(imageObj, 0, 0, w, h);

			callback(canvas.toDataURL(), w, h);
		}
		imageObj.src = dataUrl;
	}

	return {
		"clickSelectFile": clickSelectFile,
		"viewFile": viewFile
	};
}();
