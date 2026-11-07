// ==UserScript==
// @name         nHentai-Viewer
// @version      3.0
// @author       MrDaDaDo
// @namespace    https://github.com/MrDaDaDo/nHentai-Viewer
// @match        https://nhentai.net/g/*/*
// @match        https://nhentai.to/g/*/*
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    // 官方 API: /api/v2/galleries/<id> -> pages[].path = "galleries/<media>/<n>.webp"
    var genApiUrl = function(bookID) {
        return location.origin + '/api/v2/galleries/' + bookID;
    };
    var parseImageSrcs = function(gallery) {
        return gallery.pages.map(function(page) {
            return 'https://i.nhentai.net/' + page.path;
        });
    };
    // 網站是 SvelteKit，#image-container 由框架管理、會被重新渲染而蓋掉我們的內容。
    // 所以隱藏它，改用自己的容器。
    var getContainer = function() {
        var $mine = $('#nhv-container');
        if ($mine.length) { return $mine; }
        $('<style>#image-container{display:none !important}</style>').appendTo(document.head);
        $mine = $('<div id="nhv-container"></div>');
        // 先放在 body 最後面（Svelte 的 hydration 範圍之外），避免 hydration_mismatch
        $('body').append($mine);
        // 網站載入完成後，再搬到原本圖片容器的位置
        var relocate = function() {
            var $orig = $('#image-container').first();
            if ($orig.length && $mine.parent().is('body')) {
                $orig.before($mine);
            }
        };
        if (document.readyState === 'complete') {
            setTimeout(relocate, 2000);
        } else {
            $(window).on('load', function() { setTimeout(relocate, 2000); });
        }
        return $mine;
    };
    var showImage = function(imageSrcs) {
        var $container = getContainer();
        $container.html("");
        imageSrcs.forEach(function(imageSrc) {
            var imgDom = document.createElement('img');
            imgDom.src = imageSrc;
            imgDom.alt = imageSrc;
            imgDom.style.display = 'block';
            imgDom.style.maxWidth = '100%';
            imgDom.style.height = 'auto';
            imgDom.style.margin = '0 auto';
            $container.append(imgDom);
        });
        console.log('[nHentai-Viewer] 已顯示 ' + imageSrcs.length + ' 張圖');
    };
    var loadGallery = function(bookID) {
        $.getJSON(genApiUrl(bookID), function(gallery) {
            var imageSrcs = parseImageSrcs(gallery);
            if (imageSrcs.length === 0) {
                console.error('[nHentai-Viewer] API 沒有回傳任何頁面');
                return;
            }
            showImage(imageSrcs);
        }).fail(function(xhr) {
            console.error('[nHentai-Viewer] 載入 API 失敗', xhr.status);
        });
    };
    var $ = window.jQuery;
    console.log('[nHentai-Viewer] 腳本已啟動');
    loadGallery(document.location.href.split('/')[4]);
})();
