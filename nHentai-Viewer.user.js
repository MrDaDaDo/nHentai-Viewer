// ==UserScript==
// @name         nHentai-Viewer
// @version      2.5
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
    var showImage = function(imageSrcs) {
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
    var go = function(bookID) {
        loadGallery(bookID);
    };
    var $ = window.jQuery;
    var bookID = document.location.href.split('/')[4];
    var $container = $('#image-container');
    go(bookID);
})();
