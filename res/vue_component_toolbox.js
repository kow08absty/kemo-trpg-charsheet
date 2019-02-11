'use strict';

Vue.component('custom-toolbox', {
    template: `
<div id='tool_box' :class="{waitForReady: wait_for_ready, show: b_show_tool}">
    <ul id='tool_list'>
        <li><a class="button new_sheet" :href="home_uri" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 256 256"><path fill="white" fill-rule="evenodd" d="M 189.20,0.00 C 189.20,0.00 104.15,0.00 104.15,0.00 104.15,0.00 97.56,0.00 97.56,0.00 97.56,0.00 92.90,4.66 92.90,4.66 92.90,4.66 28.51,69.05 28.51,69.05 28.51,69.05 23.85,73.71 23.85,73.71 23.85,73.71 23.85,80.30 23.85,80.30 23.85,80.30 23.85,213.05 23.85,213.05 23.85,236.73 43.12,256.00 66.80,256.00 66.80,256.00 189.20,256.00 189.20,256.00 212.88,256.00 232.15,236.73 232.15,213.05 232.15,213.05 232.15,42.95 232.15,42.95 232.15,19.26 212.88,0.00 189.20,0.00 Z M 216.25,213.05 C 216.25,227.99 204.14,240.10 189.20,240.10 189.20,240.10 66.80,240.10 66.80,240.10 51.86,240.10 39.75,227.99 39.75,213.05 39.75,213.05 39.75,80.30 39.75,80.30 39.75,80.30 81.61,80.30 81.61,80.30 94.05,80.30 104.15,70.21 104.15,57.76 104.15,57.76 104.15,15.90 104.15,15.90 104.15,15.90 189.20,15.90 189.20,15.90 204.14,15.90 216.25,28.01 216.25,42.95 216.25,42.95 216.25,213.05 216.25,213.05 216.25,213.05 216.25,213.05 216.25,213.05 Z M 86.21,180.80 C 86.21,180.80 86.21,220.39 86.21,220.39 86.21,220.39 125.81,220.39 125.81,220.39 125.81,220.39 220.56,125.64 220.56,125.64 220.56,125.64 180.97,86.04 180.97,86.04 180.97,86.04 86.21,180.80 86.21,180.80 Z M 223.39,122.81 C 223.39,122.81 241.07,105.14 241.07,105.14 243.90,102.31 252.38,93.82 239.66,81.09 239.66,81.09 225.51,66.95 225.51,66.95 212.79,54.22 204.30,62.71 201.47,65.54 201.47,65.54 183.79,83.22 183.79,83.22 183.79,83.22 223.39,122.81 223.39,122.81 Z" /><path fill="white" d="M 235.41,85.34 C 243.90,93.82 239.66,98.07 236.83,100.89 236.83,100.89 223.39,114.33 223.39,114.33 223.39,114.33 192.28,83.22 192.28,83.22 192.28,83.22 205.71,69.78 205.71,69.78 208.54,66.95 212.79,62.71 221.27,71.20 221.27,71.20 235.41,85.34 235.41,85.34 Z M 180.97,94.53 C 180.97,94.53 212.08,125.64 212.08,125.64 212.08,125.64 122.98,214.74 122.98,214.74 122.98,214.74 91.87,214.74 91.87,214.74 91.87,214.74 91.87,183.63 91.87,183.63 91.87,183.63 180.97,94.53 180.97,94.53 Z" /></svg>
            新規作成</button></li>
        <li class="separator"></li>
        <li>Title: <input type="text" :value="title" :disabled="isSaving()" /></li>
        <li><button id="saveDB" @click="saveDB();" :disabled="isSaving()">
            <svg version="1.1" width="17" height="17" viewBox="0 0 512 512">
                <path fill="whitesmoke" d="M502.394,106.098L396.296,0h-15.162v121.49H130.866V0H60.27C26.987,0,0,26.987,0,60.271v391.458
                    C0,485.013,26.987,512,60.27,512h391.459C485.014,512,512,485.013,512,451.729V129.286
                    C512,120.591,508.542,112.256,502.394,106.098z M408.39,428.121H103.609V216.944H408.39V428.121z"></path>
                <rect x="282.012" width="68.027" height="94.015" fill="whitesmoke"></rect>
            </svg>
            <div v-if="SaveDB.is_pending">OK！</div>
            <div v-else-if="SaveDB.is_saving">保存中…<div class="cssload-thecube" style="display:inline-block;"><div class="cssload-cube cssload-c1"></div><div class="cssload-cube cssload-c2"></div><div class="cssload-cube cssload-c4"></div><div class="cssload-cube cssload-c3"></div></div>
            </div>
            <div v-else>保存</div>
        </button></li>
        <li v-show="isSavedData()">
            <input type="text" id="share_url" readonly :value="permalink" />
            <button id="copyLink" title="リンクをコピー" data-clipboard-target="input#share_url">
                <svg width="17" height="17" viewBox="0 0 1024 896" xmlns="http://www.w3.org/2000/svg">
                    <path fill="whitesmoke" d="M128 768h256v64H128v-64z m320-384H128v64h320v-64z m128 192V448L384 640l192 192V704h320V576H576z m-288-64H128v64h160v-64zM128 704h160v-64H128v64z m576 64h64v128c-1 18-7 33-19 45s-27 18-45 19H64c-35 0-64-29-64-64V192c0-35 29-64 64-64h192C256 57 313 0 384 0s128 57 128 128h192c35 0 64 29 64 64v320h-64V320H64v576h640V768zM128 256h512c0-35-29-64-64-64h-64c-35 0-64-29-64-64s-29-64-64-64-64 29-64 64-29 64-64 64h-64c-35 0-64 29-64 64z" />
                </svg>
            </button>
        </li>
        <li><button @click="pdfSave();" :disabled="isSaving()">
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
            <div v-if="PdfCapture.is_pending">OK！</div>
            <div v-else-if="PdfCapture.is_saving">出力中…<div class="cssload-thecube" style="display:inline-block;"><div class="cssload-cube cssload-c1"></div><div class="cssload-cube cssload-c2"></div><div class="cssload-cube cssload-c4"></div><div class="cssload-cube cssload-c3"></div></div>
            </div>
            <div v-else>PDFで出力</div>
        </button></li>
        <li v-show="isSavedData()"><button id="remove_sheet" @click="removeSheet();" :disabled="isSaving()">
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
    </ul>
    <button id='tool_close' class="tool_switch_small_screen" @click="b_show_tool=!b_show_tool">とじる</button>
</div>
`,
    data: function() {
        return {
            title: '',
            uuidv4: '',
            edit_token: '',
            permalink: '',
            base_uri: '/',
            home_uri: '',
            SaveDB: {
                is_saving: false,
                is_pending: false
            },
            PdfCapture: {
                is_saving: false,
                is_pending: false
            },
            wait_for_ready: true,
            b_show_tool: window.innerWidth > 1000
        };
    },
    methods: {
        isSavedData: function(){
            return uuidv4 != '';
        },
        removeSheet: function(){
            if(!this.uuidv4)
                return;
            if(confirm('シートを削除すると、元にもどすことはできなくなるよ\n※大切なシートはPDFに保存しておこう\n\n本当に削除してもいいかな？')){
                $.ajax({
                    url: './database.php',
                    type: 'POST',
                    data: {
                        'q': 'remove_sheet',
                        'uuidv4': this.uuidv4
                    }
                })
                .done((data) => {
                    location.href = this.createPermalink(data);
                });
            }
        },
        createPermalink: function(suffix = ''){
            return location.protocol + '//' + location.hostname + this.base_uri + suffix;
        },
        saveDB: function() {
            this.SaveDB.is_saving = true;
            if(!this.title){
                this.title = $('input#name').val();
            }
            if(!this.title){
                this.title = "アニマルガール-" + (new Date()).getTime();
            }
            const dataset = {
                'q': 'save_data',
                'title': this.title,
                'sheet': JSON.stringify(vm.$refs.contents.data)
            };
            if ($('img#icon').length && $('img#icon').attr('src')) {
                dataset['icon'] = $('img#icon').attr('src');
            }
            if (this.uuidv4) {
                dataset['uuidv4'] = this.uuidv4;
            }
            if (this.edit_token) {
                dataset['token'] = this.edit_token;
            }

            $.ajax({
                url: './database.php',
                type: 'POST',
                data: dataset
            })
            .done((data) => {
                if (data == 'OK') {
                    if($('ul#tool_list li div.info').length)
                        $('ul#tool_list li div.info').remove();
                    this.SaveDB.is_pending = true;
                } else if(data == 'Fail') {
                    if(!$('ul#tool_list li div.info').length)
                        $('button#saveDB').parent().append($('<div class="info" style="color:darkred;animation:loadingIconOpaccity 1s;">INFO: 保存失敗</div>'));
                } else {
                    location.href = vm.createPermalink(data);
                    return;
                }
                setTimeout(()=>{
                    this.SaveDB.is_saving = false;
                    this.SaveDB.is_pending = false;
                }, 2000);
            })
            .fail((data) => {
                alert('in ajax().fail() callback');
            });
        },
        pdfSave: function(){
            this.PdfCapture.is_saving = true;
            pdfSaver.doSave(()=>{
                this.PdfCapture.is_saving = false;
            });
        },
        isSaving: function(){
            return this.PdfCapture.is_saving || this.SaveDB.is_saving;
        }
    },
    watch: {
		'uuidv4': {
            deep: false, immediate: true,
            handler: function (val, oldVal) {
                this.permalink = this.createPermalink(val);
            }
        },
        'home_uri': {
            deep: false, immediate: true,
            handler: function (val, oldVal) {
                this.home_uri = this.createPermalink();
            }
        }
	}
});
