// ==UserScript==
// @name         nHentai-Viewer
// @version      2.2
// @author       MrDaDaDo
// @include      /^https:\/\/nhentai\.net\/g\/(\d)+\/(\d)+\//
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    var genGalleryUrl = function(bookID) {
        return 'https://nhentai.net/g/' + bookID + '/';
    };
    var genImageUrl = function(thumbUrl) {
        return thumbUrl.replace('t3.nhentai.net','i7.nhentai.net').replace('t.','.');
    };
    var parseImageSrcs = function(galleryHtml) {
        var regexp = /data\-src="https:\/\/t3\.nhentai\.net\/galleries\/(\d)+\/(\d)+t.[a-zA-Z]+"/g;
        var imageSrcs = galleryHtml.match(regexp);
        imageSrcs = imageSrcs.map( function(o){ return genImageUrl(o.replace('data-src=','').replace(/"/g,'')); });
        return imageSrcs;
    };
    var showImage = function(imageSrcs) {
        $container.html("");
        imageSrcs.forEach(function(imageSrc) {
            var imgDom = document.createElement('img');
            imgDom.src = imageSrc;
            imgDom.alt = imageSrc;
            imgDom.width = '1280';
            imgDom.height = '1817';
            $container.append(imgDom);
        });
    };
    var loadGallery = function(bookID) {
        $.get( genGalleryUrl(bookID), function(data) {
            var galleryHtml = data;
            showImage(parseImageSrcs(galleryHtml));
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
