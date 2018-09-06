Vue.component('custom-footer', {
	template: `
	<div id="footer">
		<ul id="target_browser" v-show="!pdf_capturing">
			<li>推奨ブラウザ：{{target_browser.preference}}</li>
			<li>対応ブラウザ：{{target_browser_support}}</li>
		</ul>
		<div id="using" v-show="!pdf_capturing">
			<h2>入力にあたっての注意</h2>
			<ol>
				<li v-for="text in using" v-html="createUsingText(text)"></li>
			</ol>
		</div>
		<div id="history" v-show="!pdf_capturing">
			<h2>更新履歴</h2>
			<ul>
				<li v-for="history in histories">
					<h3>{{history.date}} Ver.{{history.version}}</h3>
					<ul>
						<li v-for="line in history.lines" v-html="line"></li>
					</ul>
				</li>
			</ul>
		</div>
		<div id="author" :class="{ pdf_special: pdf_capturing }">
			このフォームに関するお問い合わせ先：
			<span v-show="pdf_capturing"><img :src="author.twitter.icon_data"> @{{author.twitter.user}}</span>
			<a id="twitterLink" v-show="!pdf_capturing" :href="author.twitter.url" target="_blank">
				<img :src="author.twitter.icon_data"> @{{author.twitter.user}}
			</a>
		</div>
	</div>
	`,
	data: function() {
		return {
			target_browser: {
				preference: "Chrome(PDF作成可)",
				support: ["FireFox","Edge","IE(8以上)"],
			},
			using: [
				"「大きさ」を変更すると「げんき」と「ジャパリコイン」の枚数を自動で上書き修正するよ。アイテムの購入に「ジャパリコイン」を使っていたら、その枚数を改めて計算してね。",
				"「スキルタイプ」を変更すると「キラキラの最大値」と「野生解放の上限値」を自動で上書き修正するよ。「野生解放の上限値」が変化するアイテム（ネックレスなど）を持っていたら、改めて調整してね。"
			],
			pdf_capturing: false,
			histories: [
				{
					date: "2018/09/05",
					version: "2.0",
					lines: [
						"Vue.jsでリメイクしたよ。",
						"保存済みフレンズシートでも常に最新バージョンで表示されるようになったよ。",
						"「げんき」の現在値を入力できるようになったよ。",
						"フレンズのイメージを「名前」に被らないように修正したよ。",
						"フレンズのイメージを上下にもずらせるようにしたよ。",
						"キーボード操作だけで入力しやすくしたよ。<br>- [TAB] or [Shift + TAB]: フォーカス移動<br>- [ENTER] or [Shift + ENTER]: フォーカス移動（複数行入力欄以外）<br>- [SPACE]: チェック操作, フレンズイメージ指定ボタンの押下"
					],
				},
				{
					date: "2018/03/29",
					version: "1.1",
					lines: [
						"ロゴが公式サイトのリンクになったよ。",
						"公式サイトの「フレンズシートの別カラー集」の背景を選択できるようにしたよ。",
						"フレンズの画像を読み込んだ後にマウスカーソルを乗せると、画像を左右にずらせるボタンが出現するよ。"
					],
				},
				{
					date: "2018/03/25",
					version: "1.0",
					lines: [
						"公開したよ。"
					],
				}
			],
			author: {
				twitter: {
					icon_data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABSUlEQVQ4jaWQP0tCYRjFf+977/WGEIEoFOQcaEPWGE0ttfYBWgLdG6KvUVtDkkNrTeEofYQMrHApoQi8otwiu/8bJO1yb2J24B3e85xzOM8jshVzBzgB0vwNRgAlka2Y7SnMwxD5DzNAWk6iSkhQRfxM/flZn1e47XiYzogr5jQOCjqWB+dNhxvD4+rJHc5DDTYXVS63k6xlBvRcAg5XdRKKYDYhKOY0MjPhKqEGtWeX3SWNi60kja5Ps+ejypHB9eHswfk9YDmloEoQQpBPKeRTSkj8+OZHbhBaoXxvc/3iEQRBRAhQbbkRLhRgeVA3PISInrzd9zlt2OMDAI7qNuU7O9SiawXs1fr0ov7wDTYWFPZXdAppiRCCzqdPteVyXLd5/YhfS2QrZmSiS9AUeHfiLGMafMPyB28SSMCYTBoLQwKlKUOMAEpf5JJreFnFO1QAAAAASUVORK5CYII=',
					url: 'https://twitter.com/HillTop_TRPG',
					user: 'HillTop_TRPG',
				}
			}
		};
	},
	computed: {
		target_browser_support: function() {
			return this.target_browser.support.join(", ");
		}
	},
	methods: {
		createUsingText: function(text) {
			text = text.replace(/。/g, '。<br>');
			text = text.slice(0, text.length - 4);
			return text;
		},
		setPdfCapturing: function(flg) {
			this.pdf_capturing = flg;
		},
		createLogText: function(...targets) {
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
		createLogTextSub: function(targetObj, text) {
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
		}
	},
	watch: {
		'pdf_capturing'           : { deep: true, immediate: true, handler: function (val, oldVal) { console.log(this.createLogText("pdf_capturing")); } }
	}
});
