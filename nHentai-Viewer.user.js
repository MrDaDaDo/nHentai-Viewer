// ==UserScript==
// @name         nHentai-Viewer
// @version      2.5
// @author       MrDaDaDo
// @include      /^https:\/\/nhentai\.net\/g\/(\d)+\/(\d)+\//
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    var genGalleryUrl = function(bookID) {
        return 'https://nhentai.net/g/' + bookID + '/';
    };
    var genImageUrl = function(thumbUrl) {
        return thumbUrl
            .replace('t1.nhentai.net','i1.nhentai.net')
            .replace('t2.nhentai.net','i2.nhentai.net')
            .replace('t3.nhentai.net','i3.nhentai.net')
            .replace('t4.nhentai.net','i4.nhentai.net')
            .replace('t5.nhentai.net','i5.nhentai.net')
            .replace('t6.nhentai.net','i6.nhentai.net')
            .replace('t7.nhentai.net','i7.nhentai.net')
            .replace('t8.nhentai.net','i8.nhentai.net')
            .replace('t9.nhentai.net','i9.nhentai.net')
            .replace('t.nhentai.net','i.nhentai.net')
            .replace('t.nhentai','z.nhentai')
            .replace('t.','.')
            .replace('z.nhentai','t.nhentai');
    };
    var parseImageSrcs = function(galleryHtml) {
        var regexp = /data\-src="https:\/\/t(\d?)\.nhentai\.net\/galleries\/(\d)+\/(\d)+t.[a-zA-Z]+"/g;
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
