var backgroundImage = {
	"normal": "./res/image/sheet_normal.png",
	"blue": "./res/image/sheet_blue.png",
	"green": "./res/image/sheet_green.png",
	"pink": "./res/image/sheet_pink.png",
	"black": "./res/image/sheet_black.png"
};

Vue.component('custom-contents', {
	template: `
		<article id="contents" class="waitForReady" tabIndex="-1">
			<img id="background" usemap="#Map" :src="background_image" @dragover.prevent @mousedown.prevent tabIndex="-1" @load="waitForReady">
			<map name="Map">
				<area shape="rect" coords="330,10,730,155" href="https://kemo-trpg.jimdo.com/" alt="公式サイトを表示するよ" title="公式サイトを表示するよ" target="_blank" tabIndex="-1">
			</map>

			<label id="back-normal" class="radio" v-show="!pdf_capturing">
				<input type="radio" name="background" value="normal" @click="normal" checked>
			</label>
			<label id="back-pink" class="radio" v-show="!pdf_capturing">
				<input type="radio" name="background" value="pink" @click="pink">
			</label>
			<label id="back-blue" class="radio" v-show="!pdf_capturing">
				<input type="radio" name="background" value="blue" @click="blue">
			</label>
			<label id="back-green" class="radio" v-show="!pdf_capturing">
				<input type="radio" name="background" value="green" @click="green">
			</label>
			<label id="back-black" class="radio" v-show="!pdf_capturing">
				<input type="radio" name="background" value="black" @click="black">
			</label>

			<input id="name" v-model="data.name" type="text">

			<div id="image_div" @mouseover="showArrow()" @mouseleave="hideArrow()" @dragleave.prevent @dragover.prevent @drop.prevent="dropImage">
        <span v-show="!data.image.data" :class="[{error_message: image_data_error}, {active: image_press_space}]" @click="clickSelectFile" @keydown.space.prevent.stop="pressImageSpace" @keyup.space="clickSelectFile" v-html="image_span_message" tabIndex="0"></span>
				<div id="thumb" v-show="data.image.data">
					<img :style="image_style" :src="data.image.data" title="再度ドロップインすると画像を差し替えられるよ">
				</div>
				<div class="arrow left" v-show="is_show_arrow" @mousedown="startArrow('left')" @mouseup="clearArrow()" @mouseleave="clearArrow()" title="押してる間、画像を左にずらすよ。"></div>
				<div class="arrow right" v-show="is_show_arrow" @mousedown="startArrow('right')" @mouseup="clearArrow()" @mouseleave="clearArrow()" title="押してる間、画像を右にずらすよ。"></div>
				<div class="arrow up" v-show="is_show_arrow" @mousedown="startArrow('up')" @mouseup="clearArrow()" @mouseleave="clearArrow()" title="押してる間、画像を上にずらすよ。"></div>
				<div class="arrow down" v-show="is_show_arrow" @mousedown="startArrow('down')" @mouseup="clearArrow()" @mouseleave="clearArrow()" title="押してる間、画像を下にずらすよ。"></div>
			</div>

			<div id="identity_check" class="checkbox" :class="{checked: data.identity.checked}" @click="checkFunc('identity', 'checked')" @keydown.space.stop @keydown.space.prevent @keyup.space="checkFunc('identity', 'checked')" tabIndex="0"></div>
			<textarea id="identity" v-model="data.identity.text"></textarea>
			<select id="size" class="font-big" v-model="data.size">
				<option value="4">L</option>
				<option value="3">M</option>
				<option value="2">S</option>
			</select>
			<input v-for="(item, index) in data.special_abilities" :id="'special_ability_' + (index + 1)" v-model="item.text" class="ability" type="text">
			<input v-for="(item, index) in data.weak_abilities" :id="'weak_ability_' + (index + 1)" v-model="item.text" class="ability" type="text">
			<input id="health_max" class="font-small" type="number" pattern="\d*" :min="data.health.max.min" :max="health.max" v-model="data.health.max.value">
			<input id="health" class="font-big" type="number" pattern="\d*" :min="health.min" :max="data.health.max.value" v-model="data.health.value">
			<input id="shine" class="font-big" type="number" pattern="\d*" :min="shine.min" :max="data.shine.max.value" v-model="data.shine.value">
			<input id="shine_max" class="font-small" type="number" pattern="\d*" v-model="data.shine.max.value" :min="shine.min" :max="data.shine.max.max" tabIndex="0">
			<input id="coin" class="font-small" type="number" pattern="\d*" :min="coin.min" :max="coin.max" v-model="data.coin">
			<template v-for="(item, index) in data.items">
				<input type="text" class="item_name" :class="'item_' + (index + 1)" v-model="item.name" />
				<textarea class="item_effect" :class="'item_' + (index + 1)" v-model="item.effect"></textarea>
			</template>
			<input id="KP" class="font-big" type="number" pattern="\d*" :min="KP.min" :max="KP.max" v-model="data.KP.value">
			<select id="wild_burst" class="font-small" v-model="data.wild_burst">
				<option value="5">5</option>
				<option value="4">4</option>
				<option value="3">3</option>
				<option value="2">2</option>
				<option value="1">1</option>
			</select>
			<div id="KP_check" class="checkbox" :class="{checked: data.KP.checked}" @click="checkFunc('KP', 'checked')" @keydown.space.prevent @keyup.space="checkFunc('KP', 'checked')" tabIndex="0"></div>
			<template v-for="(item, index) in data.friends">
				<input class="friends" :class="'friends_' + (index + 1)" v-model="item.name" type="text">
				<div class="checkbox friends" :class="[ {checked: item.checked}, 'friends_' + (index + 1) ]" @click="checkFunc('friends', index, 'checked')" @keydown.space.prevent @keyup.space="checkFunc('friends', index, 'checked')" tabIndex="0"></div>
			</template>
			<input id="skill_name" v-model="data.skill.name" type="text">
			<select id="skill_type" v-model="data.skill.type" placeholder="選んでね">
				<option v-for="(obj, name) in skills" v-bind:value="name">{{name}}</option>
			</select>
			<textarea id="skill_effect" v-model="skill_effect" readonly tabIndex="-1"></textarea>
			<input id="skill_role" v-model="data.skill.role" type="text">
			<input id="player" v-model="data.player" type="text">
			<div v-for="(medal, index) in data.medals" class="checkbox medal" :class="[ {checked: medal}, 'medal' + (index + 1) ]" @click="checkFunc('medals', index)" @keydown.space.prevent @keyup.space="checkFunc('medals', index)" tabIndex="0"></div>
			<button id="itemEraser" @click="clearItem()">
					<svg version="1.1" width="18px" height="18px" viewBox="0 0 26 26" style="padding-top:2px;">
						<path fill="none" stroke="white" stroke-width="2.0803" stroke-miterlimit="10" d="M17,4.429C17,5.849,15.881,7,14.5,7h-3  C10.119,7,9,5.849,9,4.429V3.571C9,2.15,10.119,1,11.5,1h3C15.881,1,17,2.15,17,3.571V4.429z"/>
						<path fill="none" stroke="white" stroke-width="2" stroke-miterlimit="10" d="M21,23c0,1.104-0.896,2-2,2H7c-1.104,0-2-0.896-2-2  V6h16V23z"/>
						<line fill="none" stroke="white" stroke-width="2" stroke-miterlimit="10" x1="17" y1="10" x2="17" y2="22"/>
						<line fill="none" stroke="white" stroke-width="2" stroke-miterlimit="10" x1="13" y1="10" x2="13" y2="22"/>
						<line fill="none" stroke="white" stroke-width="2" stroke-miterlimit="10" x1="9" y1="10" x2="9" y2="22"/>
						<path fill="white" d="M23,6V5c0-0.551-0.449-1-1-1H4C3.449,4,3,4.449,3,5v1H2v2h2h18h2V6H23z"/>
					</svg>
					クリア
			</button>
			<ul id="presetItems">
				<li v-for="(obj, name) in presetItems" v-bind:value="name" @mouseup="selectItemPreset(name)">{{name}}</li>
			</ul>
		</article>
	`,
	data: function () {
		return {
			data: characterData,
			image_data_error: false,
			image_loading: false,
			arrowIntervalId: null,
			on_mouse_image_area: false,
			image_press_space: false,
			pdf_capturing: false,
			show_pdf_save: true,
			shine: {
				min: 0
			},
			health: {
				min: 0,
				max: 9
			},
			coin: {
				min: 0,
				max: 99
			},
			KP: {
				min: 0,
				max: 20
			},
			skills: {
				"野生本能": {
					"effect": "野生解放の上限値を3にする。行動済みになった時、野生解放をリチェックする。ただし、キラキラを持てる上限値に-3する（初期上限値が9になる）。常時効果。",
					"wild_burst": 3,
					"shine_max": 9
				},
				"集団統率": {
					"effect": "野生解放の上限値を1にする。主動フレンズの時、「けもリンク」した自分以外のフレンズの数だけ判定のサイコロを増加できる。ただし、キラキラを持てる上限値に-3する（初期上限値が9になる）。常時効果。",
					"wild_burst": 1,
					"shine_max": 9
				},
				"ダイス操作・固定": {
					"effect": "判定に使うサイコロを1個減らす代わりに、判定ダイス1個の出目を任意の数字にする。KP1点消費。補助行動。",
					"wild_burst": 2,
					"shine_max": 12
				},
				"ダイス操作・回数": {
					"effect": "あなたが判定のサイコロを振った直後に使える。あなたの判定ダイスすべてを振りなおす。KP1点消費。このスキルは1タイムに野生解放の上限値と等しい回数まで使える。補助行動。",
					"wild_burst": 2,
					"shine_max": 12
				},
				"目標選択・複数": {
					"effect": "フィールドでの判定の直前。フロントから目標を2つ同時に選べる。判定ダイスは、それぞれの分必要。キラキラ3個消費。補助行動。",
					"wild_burst": 2,
					"shine_max": 12
				},
				"目標選択・延長": {
					"effect": "フィールドでの判定の直前。判定に使うサイコロを1個減らす代わりに、となりのフィールドエリアを目標にできる。キラキラ3個消費。補助行動。",
					"wild_burst": 2,
					"shine_max": 12
				},
				"回復能力": {
					"effect": "任意の数のフレンズ(PC,NPC)を目標とし、3点の回復点を割り振って目標の「げんき」を回復させる。KP1点消費。主行動。フィールド時はバックサイドのみ使用可能。",
					"wild_burst": 2,
					"shine_max": 12
				},
				"防御能力": {
					"effect": "①野生解放の上限値までのKPを消費すると、自分へのダメージを支払ったKP×2点軽減する。補助行動。②いつでも何度でもフレンズかオブジェクトに与えられたダメージを「かばう」ことで任意の点数引き受けることができる。",
					"wild_burst": 2,
					"shine_max": 12
				},
				"妨害能力": {
					"effect": "フィールドにいる時、セルリアンまたはプロブレム（敵対フレンズ含む）1体の主行動の宣言の直後に使用できる。その主行動1つの効果を無効化する。KP1点消費。補助行動。",
					"wild_burst": 2,
					"shine_max": 12
				}
			},
			sizeTable: {
				2: { "health": 2, "coin": 3 },
				3: { "health": 3, "coin": 2 },
				4: { "health": 4, "coin": 1 }
			},
			itemPriceAll: 0,
			coinInitial: 0,
			/**
			 * @property プルダウンから選べるプリセットアイテム群
			 */
			presetItems: {
				'ジャパリまん': {
					'effect': 'いつでも使える。げんきを1回復する。フィールド時、フロントに居る場合は主行動。',
					'coin': 1
				},
				'リング': {
					'effect': 'ダメージを1点減点する。使うと壊れる。',
					'coin': 2
				},
				'ウェポン': {
					'effect': '判定ダイス1個の出目を+1する。キラキラ3個消費。',
					'coin': 2
				},
				'ニンブルハンド': {
					'effect': '判定ダイス1個の出目を-1する。キラキラ3個消費。',
					'coin': 2
				}
			}
		}
	},
	methods: {
		initial: function () {
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
				this.show_pdf_save = true;
			} else {
				this.show_pdf_save = false;
			}
		},
		doSaveHtml: function () {
			htmlSaver.doSave();
		},
		doSavePdf: function () {
			pdfSaver.doSave();
		},
		setPdfCapturing: function (flg) {
			this.pdf_capturing = flg;
		},
		clickSelectFile: function () {
			this.image_press_space = false;
			imageLoader.clickSelectFile();
		},
		pressImageSpace: function () {
			this.image_press_space = true;
		},
		dropImage: function (e) {

			let file = e.dataTransfer.files[0];
			if (!file) {
				return;
			}

			this.imageLoading();
			imageLoader.viewFile(file);
			return false;

		},
		normal: function () {
			this.data.background = 'normal';
		},
		pink: function () {
			this.data.background = 'pink';
		},
		blue: function () {
			this.data.background = 'blue';
		},
		green: function () {
			this.data.background = 'green';
		},
		black: function () {
			this.data.background = 'black';
		},
		setImage: function (imageObj) {
			this.data.image = imageObj;
			this.image_data_error = false;
			this.image_loading = false;
		},
		setImageError: function () {
			let imageObj = this.data.image;
			if (imageObj.data != "" || imageObj.padding_top != 0 || imageObj.padding_left != 0) {
				this.data.image = {
					"data": "",
					"padding_top": 0,
					"padding_left": 0
				};
			}
			this.image_data_error = true;
			this.image_loading = false;
		},
		imageLoading: function () {
			let imageObj = this.data.image;
			if (imageObj.data != "" || imageObj.padding_top != 0 || imageObj.padding_left != 0) {
				this.data.image = {
					"data": "",
					"padding_top": 0,
					"padding_left": 0
				};
			}
			this.image_data_error = false;
			this.image_loading = true;
		},
		arrow: function (direction) {
			let imageObj = this.data.image;
			switch (direction) {
				case "left":
					imageObj.padding_left -= 1;
					break;
				case "right":
					imageObj.padding_left += 1;
					break;
				case "up":
					imageObj.padding_top -= 1;
					break;
				case "down":
					imageObj.padding_top += 1;
					break;
				default:
			}
		},
		startArrow: function (direction) {
			let _this = this;
			this.arrow(direction);
			this.arrowIntervalId = setInterval(function () { _this.arrow(direction); }, 100);
		},
		clearArrow: function () {
			clearInterval(this.arrowIntervalId);
		},
		showArrow: function () {
			this.on_mouse_image_area = true;
		},
		hideArrow: function () {
			this.on_mouse_image_area = false;
		},
		checkFunc: function (...targets) {
			let targetObj = this.data;
			let objRoot = this.data[targets[0]];
			for (let i = 0; i < targets.length - 1; i++) {
				targetObj = targetObj[targets[i]];
			}
			targetObj[targets[targets.length - 1]] = !targetObj[targets[targets.length - 1]];
			this.data[targets[0]] = new Object();
			this.data[targets[0]] = objRoot;
			return false;
		},
		createLogText: function (...targets) {
			let text = "$watch - ";
			for (target of targets) {
				let targetObj = this;
				for (tar of target.split(".")) {
					targetObj = targetObj[tar];
				}
				text += target + ": " + this.createLogTextSub(targetObj) + ", ";
			}
			text = text.slice(0, text.length - 2);
			return text;
		},
		createLogTextSub: function (targetObj, text) {
			if (!text) text = '';
			if (targetObj instanceof Array) {
				text += "[ ";
				for (obj of targetObj) {
					text += this.createLogTextSub(obj) + ", ";
				}
				text = text.slice(0, text.length - 2);
				text += " ]";
			} else if (typeof targetObj == 'string') {
				text += "'" + targetObj + "'";
			} else if (typeof targetObj == 'boolean') {
				text += targetObj;
			} else if (typeof targetObj == 'number') {
				text += targetObj;
			} else {
				text += "{ ";
				for (item in targetObj) {
					text += item + ": " + this.createLogTextSub(targetObj[item]) + ", ";
				}
				text = text.slice(0, text.length - 2);
				text += " }";
			}
			return text;
		},
		getSaveJson: function () {
			return this.data;
		},
		startBlinkAnim: ($target, color = '#e8e') => {
			$target.css('background-color', color);
			setTimeout(() => {
				$target.animate({
					backgroundColor: 'transparent'
				}, 700);
			}, 200);
		},
		/**
		 * visibilityを使ったjQueryフェードイン
		 * @param jQuery $target ターゲットjQueryアイテム
		 * @param Number duration アニメーションの長さ（ミリ秒）
		 * @param lambda callback アニメーション終了時のコールバック
		 */
		visibilityFadeIn: function ($target, duration = 300, callback = function () { }) {
			$target
				.css({ 'opacity': 0, 'visibility': 'visible' })
				.animate({ 'opacity': 1 }, duration, callback);
		},
		/**
		 * visibilityを使ったjQueryフェードアウト
		 * @param jQuery $target ターゲットjQueryアイテム
		 * @param Number duration アニメーションの長さ（ミリ秒）
		 * @param lambda callback アニメーション終了時のコールバック
		 */
		visibilityFadeOut: function ($target, duration = 300, callback = function () { }) {
			$target
				.css({ 'opacity': 1, 'visibility': 'visible' })
				.animate({ 'opacity': 0 }, duration, function () {
					$target.css('visibility', 'hidden');
					callback();
				});
		},
		/**
		 * 読み込み完了を検知したときに発火させる
		 */
		waitForReady: function () {
			$('.waitForReady').each((idx, elem) => {
				this.visibilityFadeIn($(elem));
			});
			this.visibilityFadeOut($('div.loading-icon-container'));
		},
		/**
		 * アイテムプリセットを表示
		 * @param Number index アイテム欄インデックス値
		 */
		showItemPreset: function (index) {
			this.itemIdxSetTarget = index;
			let
				$targetElement = $('input.item_name.item_' + (index + 1)),
				$presetItems = $('ul#presetItems'),
				$eraseButton = $('button#itemEraser');
			$presetItems.css({
				top: ($targetElement.position().top + $targetElement.height()) + 'px',
				left: $targetElement.position().left + 'px'
			});
			$eraseButton.css({
				top: ($targetElement.position().top - $eraseButton.height() - 4) + 'px',
				left: ($targetElement.position().left) + 'px',
				display: 'block'
			});
			if ($presetItems.css('display') != 'block') {
				$presetItems.slideDown(100);
			}
		},
		/**
		 * アイテムプリセットから選択
		 * @param any name アイテム名; false, undefinedのときプリセット一覧を閉じるだけ
		 */
		selectItemPreset: function (name) {
			$('button#itemEraser').css('display', '');
			$('ul#presetItems').slideUp(100, () => {
				$('ul#presetItems').css('display', '');
			});
			if (name === false || name === undefined)
				return;
			let index = this.itemIdxSetTarget;
			if (index === false || index === undefined) {
				console.log("想定外: this.itemIdxSetTarget = " + index);
				return;
			}
			console.log("%s => %s", name, this.presetItems[name]['effect']);
			this.data.items[index].name = name;
		},
		clearItem: function () {
			let index = this.itemIdxSetTarget;
			if (index === false || index === undefined) {
				console.log("想定外: this.itemIdxSetTarget = " + index);
				return;
			}
			this.data.items[index].name = "";
			this.data.items[index].effect = "";
			this.selectItemPreset(false);
		}
	},
	computed: {
		background_image: function () { return backgroundImage[this.data.background]; },
		skill_effect: function () { return this.skills[this.data.skill.type] ? this.skills[this.data.skill.type]["effect"] : ''; },
		image_span_message: function () {
			let text = 'フレンズのイメージを<br>指定しよう！<br>※ドロップインもできるよ！';
			if (this.image_data_error) text = 'JPEGまたはPNGファイルを指定してね。';
			if (this.image_loading) text = '読み込み中...読み込み中...';
			return text;
		},
		image_style: function () {
			return { 'left': this.data.image.padding_left + 'px', 'top': this.data.image.padding_top + 'px' }
		},
		is_show_arrow: function () {
			return this.on_mouse_image_area && this.data.image.data;
		}
	},
	watch: {
		'pdf_capturing': { deep: true, immediate: true, handler: function (val, oldVal) { console.log(this.createLogText("pdf_capturing")); } },
		'image_loading': { deep: true, immediate: true, handler: function (val, oldVal) { console.log(this.createLogText("image_loading")); } },
		'data.background': { deep: true, immediate: true, handler: function (val, oldVal) { console.log(this.createLogText("data.background")); } },
		'data.name': {
			deep: false, immediate: true,
			handler: function (val, oldVal) {
				// 文字の大きさジャストフィットをフック
				$('input#name').val(val).trigger('change', [true]);
				console.log(this.createLogText("data.name"));
			}
		},
		'data.image.data': { deep: true, immediate: true, handler: function (val, oldVal) { console.log(this.createLogText("data.image.data")); } },
		'data.image.padding_top': { deep: true, immediate: true, handler: function (val, oldVal) { console.log(this.createLogText("data.image.padding_top")); } },
		'data.image.padding_left': { deep: true, immediate: true, handler: function (val, oldVal) { console.log(this.createLogText("data.image.padding_left")); } },
		'data.identity': { deep: true, immediate: true, handler: function (val, oldVal) { console.log(this.createLogText("data.identity")); } },
		'data.size': {
			deep: true, immediate: false,
			handler: function (val, oldVal) {
				if (!this.sizeTable[val]) return;
				let health = this.sizeTable[val]["health"];
				this.data.health.value = health;
				this.data.health.max.value = health;
				this.data.health.max.min = health;
				this.bCoinUserInput = false;
				this.coinInitial = this.sizeTable[val]["coin"];
				console.log(this.createLogText("data.size"));
				this.startBlinkAnim($("#health_max"));
				this.startBlinkAnim($("#health"));
				this.startBlinkAnim($("#coin"));
				// setTimeout(function() {
				// 		alert("“げんき”と“ジャパリコイン”を再設定したよ。");
				// }, 100);
			}
		},
		'data.shine': { deep: true, immediate: true, handler: function (val, oldVal) { console.log(this.createLogText("data.shine")); } },
		'data.health.value': { deep: true, immediate: true, handler: function (val, oldVal) { console.log(this.createLogText("data.health.value")); } },
		'data.health.max.value': {
			deep: true, immediate: true, handler: function (val, oldVal) {
				if (this.data.health.value > this.data.health.max.value) {
					this.data.health.value = this.data.health.max.value;
				}
				console.log(this.createLogText("data.health.max.value"));
			}
		},
		'data.health.max.min': { deep: true, immediate: true, handler: function (val, oldVal) { console.log(this.createLogText("data.health.max.min")); } },
		'data.coin': {
			deep: false, immediate: false,
			handler: function (val, oldVal) {
				if (typeof (val) == 'string') {
					this.bCoinUserInput = true;
				}
				if (val < 0) {
					this.startBlinkAnim($('input#coin'), '#ffaaaa');
					$('input#coin').css('color', 'red');
				} else {
					$('input#coin').css('color', '');
				}
				console.log(this.createLogText("data.coin"));
			}
		},
		'coinInitial': {
			deet: false, immediate: false,
			handler: function (val, oldVal) {
				console.log(this.createLogText('coinInitial'));
				if (!this.bCoinUserInput)
					this.data.coin = this.coinInitial - this.itemPriceAll;
			}
		},
		'itemPriceAll': {
			deep: false, immediate: false,
			handler: function (val, oldVal) {
				console.log(this.createLogText('itemPriceAll'));
				if (!this.bCoinUserInput)
					this.data.coin = this.coinInitial - this.itemPriceAll;
			}
		},
		'data.items': {
			deep: true, immediate: true,
			handler: function (val, oldVal) {
				if (oldVal) {
					for (idx in this.data.items) {
						let
							newName = this.data.items[idx].name,
							oldName = this.currentItemValueArr[idx].name;
						if (newName != oldName) {
							if (this.presetItems[newName]) {
								this.itemPriceAll += this.presetItems[newName]['coin'];
								this.startBlinkAnim($('textarea.item_effect.item_' + (Number(idx) + 1)));
								// 文字の大きさジャストフィットをフック
								$('input.item_name.item_' + (Number(idx) + 1)).val(newName).trigger('change', [true]);
								this.data.items[idx].effect = this.presetItems[newName]['effect'];
							}
							if (this.presetItems[oldName]) {
								this.itemPriceAll -= this.presetItems[oldName]['coin'];
							}
							break;
						}
					}
				}
				this.currentItemValueArr = JSON.parse(JSON.stringify(this.data.items));
			}
		},
		'data.KP': { deep: true, immediate: true, handler: function (val, oldVal) { console.log(this.createLogText("data.KP")); } },
		'data.wild_burst': { deep: true, immediate: true, handler: function (val, oldVal) { console.log(this.createLogText("data.wild_burst")); } },
		'data.skill.type': {
			deep: false, immediate: false,
			handler: function (val, oldVal) {
				let dat = this.skills[this.data.skill.type];
				if (!dat) {
					return;
				}
				if (this.data.shine.max.value != dat["shine_max"]) {
					this.startBlinkAnim($("#shine_max"));
				}
				this.data.wild_burst = dat["wild_burst"];
				this.data.shine.max.value = dat["shine_max"];
				this.data.shine.max.max = dat["shine_max"] + 3;
				if (this.data.shine.value > this.data.shine.max.value) {
					this.data.shine.value = this.data.shine.max.value;
					this.startBlinkAnim($("#shine"));
				}
				// 文字の大きさジャストフィットをフック
				$('select#skill_type').val(val).trigger('change', [true]);
				console.log(this.createLogText("data.skill.name", "data.skill.type", "skill_effect", "data.skill.role"));
				this.startBlinkAnim($("#wild_burst"));
				this.startBlinkAnim($("#skill_effect"));
				// setTimeout(function() {
				// 		alert("“キラキラ最大値”と“野生解放上限”を変更したよ。");
				// }, 100);
			}
		},
		'data.special_abilities': {
			deep: true, immediate: true,
			handler: function (val, oldVal) {
				for (idx in val) {
					// 文字の大きさジャストフィットをフック
					$('input#special_ability_' + (Number(idx) + 1)).val(val[idx].text).trigger('change', [true]);
				}
				console.log(this.createLogText("data.special_abilities"));
			}
		},
		'data.weak_abilities': {
			deep: true, immediate: true,
			handler: function (val, oldVal) {
				for (idx in val) {
					// 文字の大きさジャストフィットをフック
					$('input#weak_ability_' + (Number(idx) + 1)).val(val[idx].text).trigger('change', [true]);
				}
				console.log(this.createLogText("data.weak_abilities"));
			}
		},
		'data.friends': {
			deep: true, immediate: true,
			handler: function (val, oldVal) {
				for (idx in val) {
					// 文字の大きさジャストフィットをフック
					$('input.friends.friends_' + (Number(idx) + 1)).val(val[idx].name).trigger('change', [true]);
				}
				console.log(this.createLogText("data.friends"));
			}
		},
		'data.player': {
			deep: false, immediate: true,
			handler: function (val, oldVal) {
				// 文字の大きさジャストフィットをフック
				$('input#player').val(val).trigger('change', [true]);
				console.log(this.createLogText("data.player"));
			}
		},
		'data.medals': { deep: true, immediate: true, handler: function (val, oldVal) { console.log(this.createLogText("data.medals")); } },
		'shine': { deep: true, immediate: true, handler: function (val, oldVal) { console.log(this.createLogText("shine")); } },
	}
});
