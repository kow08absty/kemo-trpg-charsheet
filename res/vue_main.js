const vm = new Vue({
	el: '#app',
	methods: {
		setImage: function (imageData, paddingLeft) {
			this.$refs.contents.setImage(imageData, paddingLeft);
		},
		setImageError: function () {
			this.$refs.contents.setImageError();
		},
		initial: function () {
			this.$refs.contents.initial();
		},
		imageLoading: function () {
			this.$refs.contents.imageLoading();
		},
		getSaveJson: function () {
			return this.$refs.contents.getSaveJson();
		},
		setPdfCapturing: function (flg) {
			this.$refs.contents.setPdfCapturing(flg);
			this.$refs.footer.setPdfCapturing(flg);
		},
		hideItemPreset: function () {
			this.$refs.contents.selectItemPreset(false);
		},
		getVersionStrings: function () {
			return CONST_HISTORIES[0].version;
		},
		showItemPreset: function (index) {
			this.$refs.contents.showItemPreset(index);
		}
	}
});

vm.initial();
