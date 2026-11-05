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
    var genGalleryUrl = function(bookID) {
        return 'https://nhentai.net/g/' + bookID + '/';
    };
    // 縮圖: https://t1.nhentai.net/galleries/<media>/<n>t.webp
    // 原圖: https://i1.nhentai.net/galleries/<media>/<n>.webp
    var parseImageSrcs = function(galleryHtml) {
        var regexp = /src="https:\/\/t(\d*)\.nhentai\.net\/galleries\/(\d+)\/(\d+)t\.(\w+)(?:\.\w+)?"/g;
        var imageSrcs = [];
        var m;
        while ((m = regexp.exec(galleryHtml)) !== null) {
            imageSrcs.push('https://i' + m[1] + '.nhentai.net/galleries/' + m[2] + '/' + m[3] + '.' + m[4]);
        }
        return imageSrcs;
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
        $.get( genGalleryUrl(bookID), function(data) {
            var imageSrcs = parseImageSrcs(data);
            if (imageSrcs.length === 0) {
                console.error('[nHentai-Viewer] 找不到任何縮圖，網站結構可能又改了');
                return;
            }
            showImage(imageSrcs);
        }).fail(function(xhr) {
            console.error('[nHentai-Viewer] 載入主頁失敗', xhr.status);
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
