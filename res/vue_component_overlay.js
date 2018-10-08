'use strict';

Vue.component('custom-overlay', {
	template: `
		<div id="overlay" v-bind:class="{waitForReady: !wait_for_ready}">
			<div id="overlay_content">
				<span v-html="overlay_content"></span>
				<div class="loading-icon-container" v-show="show_loading_icon">
					<div class="loading-icon-animatable"></div>
					<div class="loading-text">{{loading_text}}</div>
				</div>
			</div>
		</div>
	`,
	data: function() {
		return {
			show_loading_icon: true,
			overlay_content: '',
			loading_text: '読み込み中…',
			wait_for_ready: true
		};
	},
	methods: {
		showOverlay: function(content) {
			let timeout = 0;
			if(!content){
				content = '';
				timeout = 1500;
			}

			setTimeout(() => {
				this.overlay_content = content;
				this.show_loading_icon = (content == '');
			}, timeout);
			this.wait_for_ready = (content != '');
		}
	}
});
