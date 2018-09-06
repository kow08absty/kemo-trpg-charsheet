Vue.component('custom-header', {
	template: `
		<div id="header">
			フレンズシート入力フォーム Ver.{{version}}
		</div>
	`,
	data: function() {
		return {
			version: "2.0"
		};
	}
});
