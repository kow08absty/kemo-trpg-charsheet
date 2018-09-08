<?php
require_once('lib/vendor/autoload.php');

use kow08absty\Util;

/**
 * @var string このPHPファイルが置かれている、Webルートからの相対パス
 */
const BASE_URI = '/kemo_trpg_pc_making/';



function createParmaLink(string $uuidv4): string{
	return ((isset($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . BASE_URI . $uuidv4;
}


$uuidv4 = Util::isAvailableUuidV4(str_replace(BASE_URI, '', $_SERVER['REQUEST_URI']));
?>
<!DOCTYPE html>
<!-- saved from url=(0060)http://mihikari.sakura.ne.jp/kemonofriends/1/charactersheet/ -->
<html lang="ja">
	<head>
		<meta http-equiv="Charset" content="UTF-8" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />

		<title>“てーぶるちほーの大冒険”フレンズシート</title>
		<!-- meta name="keywords" content="けものフレンズ,キャラクターシート,てーぶるちほーの大冒険,フレンズシート" />
		<meta name="description" content="けものフレンズTRPG「てーぶるちほーの大冒険」のフレンズシート(キャラクターシート)の入力フォームです。" />
		<meta name="author" content="HillTop" /-->
		<meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="stylesheet" type="text/css" href="./res/main.css" />
		<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css" />

		<script src="//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
		<script src="./res/clipboard.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
		<script type="text/javascript" src="./res/flowtype.js"></script>
		<script type="text/javascript" src="./res/FileSaver.js"></script>
		<script type="text/javascript" src="./res/save_pdf.js"></script>
		<script type="text/javascript" src="./res/imageLoader.js"></script>
		<script type="text/javascript" src="./res/html2canvas.js"></script>
		<script type="text/javascript" src="./res/jspdf.debug.js"></script>
		<script type="text/javascript" src="./res/vue.min.js"></script>

		<script type="text/javascript" id="data_head">
			const characterData = {
				"version": "2.0",
				"background": "normal",
				"name": "",
				"image": {
					"data": "",
					"padding_top": 0,
					"padding_left": 0
				},
				"identity": {
					"checked": false,
					"text": ""
				},
				"size": "",
				"special_abilities": [
					{"text": ""},
					{"text": ""},
					{"text": ""}
				],
				"weak_abilities": [
					{"text": ""},
					{"text": ""},
					{"text": ""}
				],
				"health": {
					"value": "",
					"max": {
						"value": "",
						"min": "0"
					}
				},
				"shine": {
					"value": "",
					"max": {
						"value": "",
						"max": 15
					}
				},
				"wild_burst": '',
				"player": "",
				"medals": [false,false,false,false,false,false],
				"skill": {
					"name": "",
					"type": "",
					"roll": ""
				},
				"coin": "",
				"KP": {
					"value": 0,
					"checked": false
				},
				"friends": [
					{ "name": "", "checked": false },
					{ "name": "", "checked": false },
					{ "name": "", "checked": false },
					{ "name": "", "checked": false },
					{ "name": "", "checked": false },
					{ "name": "", "checked": false }
				],
				"items": [
					{ "name": "", "effect": "" },
					{ "name": "", "effect": "" },
					{ "name": "", "effect": "" }
				]
			};
			$(window).on('load', function(){
				<?php if($uuidv4): ?>
				$.ajax({
					url: './database.php',
					type: 'POST',
					data: {
						'q': 'is_exists',
						'uuidv4': '<?php echo $uuidv4; ?>'
					}
				})
				.done((data) => {
					if(data == 'true'){
						/**
						 * Get token
						 */
						$.ajax({
							url: './database.php',
							type: 'POST',
							data: {
								'q': 'get_edit_token',
								'uuidv4': '<?php echo $uuidv4; ?>'
							}
						})
						.done((token) => {
							$('body').append('<input type="hidden" id="token" value="'+ token + '" />');
						});

						/**
						 * Get sheet data
						 */
						$.ajax({
							url: './database.php',
							type: 'POST',
							data: {
								'q': 'fetch_data',
								'uuidv4': '<?php echo $uuidv4; ?>'
							}
						})
						.done((data) => {
							json = JSON.parse(data);
							$('input#title').val(json['title']);
                            if(json['icon'])
								$('img#icon').attr('src', json['icon']);
							obj = JSON.parse(json['sheet']);
							for(key in obj){
								characterData[key] = JSON.parse(JSON.stringify(obj[key]));
							}
						});
						$('input#uuidv4').val("<?php echo $uuidv4; ?>");
						$('li#display_url').show();
					} else {
						$('div.loading-icon-container').remove();
						showOverlay("<span>読み込み失敗・・・<br>URLを間違えていないか確認しよう<br>または <a href='<?php echo BASE_URI; ?>'>新しいフレンズシートに入力</a></span>");
					}
				});
				<?php endif; ?>
				$('button#remove_sheet').on('click', ()=>{
					if(confirm('シートを削除すると、元にもどすことはできなくなるよ\n※大切なシートはPDFに保存しておこう\n\n本当に削除してもいいかな？')){
						$.ajax({
							url: './database.php',
							type: 'POST',
							data: {
								'q': 'remove_sheet',
								'uuidv4': $('input#uuidv4').val()
							}
						})
						.done((data) => {
							location.href = '<?php echo BASE_URI; ?>';
						});
					}
				});
				$('button#saveDB').on('click', function () {
					$('#tool_list button').each((idx, elem) => {
						$(elem).attr('disabled', 'true');
					});
					$('button#saveDB span').html('保存中…<div class="cssload-thecube" style="display:inline-block;"><div class="cssload-cube cssload-c1"></div><div class="cssload-cube cssload-c2"></div><div class="cssload-cube cssload-c4"></div><div class="cssload-cube cssload-c3"></div></div>');
					var title = $('input#title').val();
					if(!title)
						title = $('input#name').val();
					if(!title){
						title = "アニマルガール-" + (new Date()).getTime();
						$('input#title').val(title);
					}
					dataset = {
						'q': 'save_data',
						'title': title,
						'sheet': JSON.stringify(vm.getSaveJson())
					};
					if ($('img#icon').length && $('img#icon').attr('src')) {
						dataset['icon'] = $('img#icon').attr('src');
					}
					if ($('input#uuidv4').length) {
						dataset['uuidv4'] = $('input#uuidv4').val();
					}
					if ($('input#token').length) {
						dataset['token'] = $('input#token').val();
					}
					$.ajax({
						url: './database.php',
						type: 'POST',
						data: dataset
					})
					.done((data) => {
						if (data == 'OK') {
							$('button#saveDB').css('background-color', '');
							if($('ul#tool_list li div.info').length)
								$('ul#tool_list li div.info').remove();
							$('button#saveDB span').html('OK！');
							setTimeout(()=>{
								$('button#saveDB span').html('保存');
							}, 2000);
						} else if(data == 'Fail') {
							if(!$('ul#tool_list li div.info').length)
								$('button#saveDB').parent().append($('<div class="info" style="color:darkred;animation:loadingIconOpaccity 1s;">INFO: 保存失敗</div>'));
							$('button#saveDB span').html('保存');
							$('button#saveDB').css('background-color', 'darkorange');
						} else {
							location.href = "<?php echo createParmaLink(''); ?>" + data;
							return;
						}
						setTimeout(()=>{
							$('#tool_list button').each((idx, elem) => {
								$(elem).removeAttr('disabled');
							});
						}, 2000);
					})
					.fail((data) => {
						alert('in ajax().fail() callback');
					});
				});
				$('button#savePdf').on('click', pdfSaver.doSave);
				$('button.tool_switch_small_screen').on('click', () => {
					if ($('div#tool_box').css('display') == 'block') {
						$('div#tool_box').hide(150, () => {
							$('div#tool_box').css('display', '');
						});
					} else {
						$('div#tool_box').show(150);
					}
				});
                new ClipboardJS('button#copyLink');
			});
			function showOverlay(content) {
				if (content == false) {
					$("#overlay").fadeOut(50);
				} else {
					$("div#overlay_content").html(content);
					$("#overlay").fadeIn(50);
				}
			}
		</script>
		<script type="text/javascript" src="./res/jquery_before.js"></script>
	</head>
	<body>

	<!-- コンテンツを配置
		<iframe id="renderSpace" frameborder="0" width="450" height="450"></iframe> -->
		<div id='content_wrapper'>
			<div id='tool_box'>
				<ul id='tool_list' class='waitForReady'>
					<li>Title: <input type="text" id="title" /></li>
					<li><button id="saveDB">
                        <svg version="1.1" width="17" height="17" viewBox="0 0 512 512">
                            <path fill="whitesmoke" d="M502.394,106.098L396.296,0h-15.162v121.49H130.866V0H60.27C26.987,0,0,26.987,0,60.271v391.458
                                C0,485.013,26.987,512,60.27,512h391.459C485.014,512,512,485.013,512,451.729V129.286
                                C512,120.591,508.542,112.256,502.394,106.098z M408.39,428.121H103.609V216.944H408.39V428.121z"></path>
                            <rect x="282.012" width="68.027" height="94.015" fill="whitesmoke"></rect>
                        </svg>
                        <span>保存</span>
                    </button></li>
					<li id="display_url">
						<input type="text" id="share_url" readonly value="<?php
							if ($uuidv4 !== false)
								echo createParmaLink($uuidv4);
						 ?>" />
						<button id="copyLink" title="リンクをコピー" data-clipboard-target="input#share_url">
							<svg width="17" height="17" viewBox="0 0 1024 896" xmlns="http://www.w3.org/2000/svg">
								<path fill="whitesmoke" d="M128 768h256v64H128v-64z m320-384H128v64h320v-64z m128 192V448L384 640l192 192V704h320V576H576z m-288-64H128v64h160v-64zM128 704h160v-64H128v64z m576 64h64v128c-1 18-7 33-19 45s-27 18-45 19H64c-35 0-64-29-64-64V192c0-35 29-64 64-64h192C256 57 313 0 384 0s128 57 128 128h192c35 0 64 29 64 64v320h-64V320H64v576h640V768zM128 256h512c0-35-29-64-64-64h-64c-35 0-64-29-64-64s-29-64-64-64-64 29-64 64-29 64-64 64h-64c-35 0-64 29-64 64z" />
							</svg>
						</button>
					</li>
					<li><button id="savePdf">
                        <svg width="17" height="17" viewBox="0 0 512 512">
                            <path d="M389.777,250.615c-67.319,0-121.881,54.566-121.881,121.885s54.562,121.881,121.881,121.881
                                S511.658,439.819,511.658,372.5S457.096,250.615,389.777,250.615z M430.531,365.315l18.292-16.723v35.889l-59.046,54.477
                                l-59.13-54.477l0.085-36.031l26.8,24.754l18.296,17.054v-0.146l0.158,0.142v-84.211h27.496v50.154l-0.108,33.946l0.108-0.1v0.211
                                L430.531,365.315z" fill="whitesmoke"></path>
                            <path d="M261.934,466.311H54.85c-4.804,0-8.823-3.938-8.823-8.819V54.427c0-4.804,4.019-8.742,8.823-8.742h228.669
                                c4.881,0,8.819,3.938,8.819,8.742v51.2c0,9.219,7.485,16.7,16.7,16.7h51.2c4.804,0,8.742,3.938,8.742,8.822v73.642l-0.023,10.327
                                c0.008,0,0.015,0,0.023-0.004v0.162c6.777-0.946,13.785-1.419,20.796-1.419c7.97,0,15.719,0.612,23.338,1.781
                                c0.458,0.081,0.938,0.104,1.397,0.189v-0.019c0.05,0.007,0.103,0.011,0.158,0.019v-99.485c0-4.493-1.735-8.666-4.885-11.815
                                L310.142,4.881C306.993,1.73,302.815,0,298.327,0H17.042c-9.215,0-16.7,7.481-16.7,16.619V495.3c0,9.215,7.485,16.7,16.7,16.7
                                h297.354C293.681,500.815,275.8,485.138,261.934,466.311z" fill="whitesmoke"></path>
                            <path d="M121.138,183.796h108.115c7.693,0,13.946-6.254,13.946-13.938c0-7.692-6.254-13.946-13.946-13.946H121.138
                                c-7.692,0-13.946,6.254-13.946,13.946C107.193,177.542,113.446,183.796,121.138,183.796z" fill="whitesmoke"></path>
                            <path d="M293.915,242.058H121.173c-7.719,0-13.942,6.223-13.942,13.942c0,7.638,6.222,13.942,13.942,13.942h147.693
                                c5.988-7.093,12.604-13.627,19.692-19.534c1.496-1.262,2.996-2.442,4.57-3.623c1.454-1.123,2.977-2.208,4.492-3.238
                                c0.27-0.15,0.531-0.346,0.8-0.477c-0.03-0.016-0.077-0.008-0.107-0.023c0.058-0.038,0.115-0.085,0.173-0.123
                                C297.066,242.292,295.493,242.058,293.915,242.058z" fill="whitesmoke"></path>
                            <path d="M121.173,323.977c-7.719,0-13.942,6.223-13.942,13.942c0,7.638,6.222,13.942,13.942,13.942h111.304
                                c1.096-8.381,2.97-16.477,5.335-24.377c0.35-1.104,0.584-2.262,0.965-3.35h-0.042c0.016-0.05,0.023-0.107,0.042-0.158H121.173z" fill="whitesmoke"></path>
                        </svg>
                        <span>PDFで出力</span>
					</button></li>
					<?php if($uuidv4): ?>
					<li><button id='remove_sheet'>
						<svg width="17" height="17" viewBox="0 0 512 512">
							<path d="M77.869,448.93c0,13.312,1.623,25.652,5.275,35.961c4.951,13.636,13.475,23.457,26.299,26.297
								c2.598,0.488,5.277,0.812,8.117,0.812h277.364c0.73,0,1.381,0,1.947-0.082c26.463-1.703,37.258-29.219,37.258-62.988
								l11.121-269.324H66.748L77.869,448.93z M331.529,239.672h52.68v212.262h-52.68V239.672z M229.658,239.672h52.682v212.262h-52.682
								V239.672z M127.789,239.672h52.762v212.262h-52.762V239.672z" fill="whitesmoke"></path>
							<path d="M368.666,89.289c0.078-2.028,0.242-4.059,0.242-6.09v-5.598c0-42.777-34.822-77.602-77.6-77.602h-70.701
								c-42.778,0-77.6,34.824-77.6,77.602v5.598c0,2.031,0.162,4.062,0.326,6.09H28.721v62.582h454.558V89.289H368.666z M320.205,83.199
								c0,2.113-0.242,4.141-0.648,6.09H192.361c-0.406-1.949-0.65-3.977-0.65-6.09v-5.598c0-15.91,12.986-28.898,28.897-28.898h70.701
								c15.99,0,28.896,12.988,28.896,28.898V83.199z" fill="whitesmoke"></path>
						</svg>
						<span>削除</span>
					</button></li>
					<?php endif; ?>
					<li><button id='tool_close' class="tool_switch_small_screen">とじる</button></li>
				</ul>
			</div>
			<div id="render_space">
				<div id="app">
					<custom-header ref="header"></custom-header>
					<custom-contents ref="contents"></custom-contents>
					<custom-overlay ref="overlay"></custom-overlay>
					<custom-footer ref="footer"></custom-footer>
				</div>
			</div>
		</div>

		<div id="overlay">
			<div id="overlay_content"></div>
		</div>

		<input type="hidden" id="uuidv4" value="<?php echo $uuidv4; ?>" />

		<button id='tool_menu' class="tool_switch_small_screen">保存めにゅー</button>

        <div class="loading-icon-container">
    		<div class="loading-icon-animatable"></div>
            <span class="loading-text">読み込み中……</span>
		</div>

		<script type="text/javascript" src="./res/vue_histories.js"></script>
		<script type="text/javascript" src="./res/vue_component_header.js"></script>
		<script type="text/javascript" src="./res/vue_component_contents.js"></script>
		<script type="text/javascript" src="./res/vue_component_overlay.js"></script>
		<script type="text/javascript" src="./res/vue_component_footer.js"></script>
		<script type="text/javascript" src="./res/vue_main.js"></script>
		<script type="text/javascript" src="./res/jquery_after.js"></script>

</body></html>
