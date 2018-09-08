Vue.component('custom-header', {
	template: `
		<header>
			フレンズシート入力フォーム Ver.{{version}}
		</header>
	`,
	data: function() {
		return {
			version: CONST_HISTORIES[0].version
		};
	}
});
