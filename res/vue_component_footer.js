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
			このフォームを作ったヒト：
			<span v-show="pdf_capturing"><img :src="author.twitter.icon_data"> @{{author.twitter.user}}</span>
			<a v-show="!pdf_capturing" :href="author.twitter.url" target="_blank"><img :src="author.twitter.icon_data"> @{{author.twitter.user}}</a>
			<!-- span v-show="!pdf_capturing" style="padding-left: 10px;">
				<a :href="author.github.url" target="_blank"><img :src="author.github.icon_data" /> @{{author.github.user}}</a> GitHubにはソースコードも上げてるよ
			</span -->
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
				"「アイテム」プリセットを実装したよ。初期アイテムの中から、購入したいものを選ぼう。「ジャパリコイン」を手動で書き換えていなければ、必要なコインが引き算されるよ。",
				"保存したあとのURLは、大切に保管しておこう。紛失したとき、フレンズのデータが復元できなくなる可能性があるよ。"
			],
			pdf_capturing: false,
			histories: CONST_HISTORIES,
			author: {
				twitter: {
					icon_data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABSUlEQVQ4jaWQP0tCYRjFf+977/WGEIEoFOQcaEPWGE0ttfYBWgLdG6KvUVtDkkNrTeEofYQMrHApoQi8otwiu/8bJO1yb2J24B3e85xzOM8jshVzBzgB0vwNRgAlka2Y7SnMwxD5DzNAWk6iSkhQRfxM/flZn1e47XiYzogr5jQOCjqWB+dNhxvD4+rJHc5DDTYXVS63k6xlBvRcAg5XdRKKYDYhKOY0MjPhKqEGtWeX3SWNi60kja5Ps+ejypHB9eHswfk9YDmloEoQQpBPKeRTSkj8+OZHbhBaoXxvc/3iEQRBRAhQbbkRLhRgeVA3PISInrzd9zlt2OMDAI7qNuU7O9SiawXs1fr0ov7wDTYWFPZXdAppiRCCzqdPteVyXLd5/YhfS2QrZmSiS9AUeHfiLGMafMPyB28SSMCYTBoLQwKlKUOMAEpf5JJreFnFO1QAAAAASUVORK5CYII=',
					url: 'https://twitter.com/KOW_public',
					user: 'KOW_public'
				},
				github: {
					icon_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACaklEQVQ4T42TUUhaYRTH/x9UWj74GpowTYTWS5uptFgvDuphxohGsMinqCi7sC5C0Nuoh1g2aNXLDBx3mqMQiVEPky1UQnpYru0KzYqlKPkaCFEPd9yz6XJssg8unPOd//l99zvnfEySJAk3Vjabxf7+PqLRKFKiSJHbra3o6uqC1WqFTqe7KQcrAWROwO8HPzVVIfjT8Swu4sngIBhjFCKAnDw3N4flpaWqyaWgi+MwMzNDEAIIggA3z+Mpz8PpdEIURYRCIdTV1VFOIpHAwsICDAYDZO0LjwfPPR4MDQ2B5XI56W5bGwmXV1fR39+P6+trotfU1NC+7NfW1pK9ubkJ1/g42Z+SSbA3giCV7p08PERjY2PVa2QyGVjb20kj14ONjo5K4VAIGq0WH3d3oVarqwIuLi5gt9uRPTvDo74+MJvNJn0/PcXD3l54vd7/KuLw8DDebW3hlsEAdq+jQzo5PsYdsxnb29vl9vyLJHesp6cHnw8O0Gw0gnEcJ71dXyd9NB6HyWSq+hfpdBr3OztJ83hgACwYDEqTLheU9fVQNTTgfSSCpqamv0JyuRzcbjc+RCIUf7myAlYoFCST0QStTgu9Xo+dnR2YzWaEw2FoNBoSypXnOA6Jvb0K8BdR/DlIGxsbmJyYwNdUCvl8niBjY2Pljpyfn6OlpQWKX7MgU16trcHhcPx+C/Pz84jH4/D7/VAoFPSV1tXVFR7Y7fh2dERbz2ZnMTIyQnb5McmOPL7T09N0WiAQgEqlIlGxWESzXk/2a0FAd3d3GV4BkHdjsRg9ZZ7noVQqSXh5eQmfz0e1sVgsFXX4AVYg/gjDPZ0mAAAAAElFTkSuQmCC',
					url: 'https://github.com/kow08absty',
					user: 'kow08absty'
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
