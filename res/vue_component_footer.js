Vue.component('custom-footer', {
	template: `
	<footer>
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
	</footer>
	`,
	data: function() {
		return {
			target_browser: {
				preference: "Chrome(PDF作成可)",
				support: ["FireFox","Edge","IE(8以上)"],
			},
			using: [
				"「大きさ」を変更すると「げんき」と「ジャパリコイン」の枚数を自動で上書き修正するよ。アイテムの購入に「ジャパリコイン」を使っていたら、その枚数を改めて計算してね。",
				"「スキルタイプ」を変更すると「キラキラの最大値」と「野生解放の上限値」を自動で上書き修正するよ。「野生解放の上限値」が変化するアイテム（ネックレスなど）を持っていたら、改めて調整してね。",
				"保存したあとのURLは、大切に保管しておこう。紛失したとき、フレンズのデータが復元できなくなる可能性があるよ。"
			],
			pdf_capturing: false,
			histories: [
				{
					date: "2018/09/07",
					version: "2.0-db01",
					lines: [
						"データベース機能と連携して、URLだけでやり取りできるように改良したよ。オリジナル作者のHillTopさんありがとう！<br />",
						"HillTopさんの<a href='https://twitter.com/HillTop_TRPG'>ツイッターはこっち</a>、<a href='http://mihikari.sakura.ne.jp/kemonofriends/1/charactersheet/'>フレンズシート入力フォームはこっち</a>だよ。"
					],
				}
			],
			author: {
				twitter: {
					icon_data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABSUlEQVQ4jaWQP0tCYRjFf+977/WGEIEoFOQcaEPWGE0ttfYBWgLdG6KvUVtDkkNrTeEofYQMrHApoQi8otwiu/8bJO1yb2J24B3e85xzOM8jshVzBzgB0vwNRgAlka2Y7SnMwxD5DzNAWk6iSkhQRfxM/flZn1e47XiYzogr5jQOCjqWB+dNhxvD4+rJHc5DDTYXVS63k6xlBvRcAg5XdRKKYDYhKOY0MjPhKqEGtWeX3SWNi60kja5Ps+ejypHB9eHswfk9YDmloEoQQpBPKeRTSkj8+OZHbhBaoXxvc/3iEQRBRAhQbbkRLhRgeVA3PISInrzd9zlt2OMDAI7qNuU7O9SiawXs1fr0ov7wDTYWFPZXdAppiRCCzqdPteVyXLd5/YhfS2QrZmSiS9AUeHfiLGMafMPyB28SSMCYTBoLQwKlKUOMAEpf5JJreFnFO1QAAAAASUVORK5CYII=',
					url: 'https://twitter.com/KOW_public',
					user: 'KOW_public',
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
