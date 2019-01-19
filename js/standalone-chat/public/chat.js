function scroll(list, container) {
    var height = 0;
    list.children('li').each(function(i, value){
        height += parseInt($(this).height());
    });
    height += '';
    container.animate({scrollTop: height});
}

appendIncomingMessage = function(data, list, container) {
    var html = [
        '<li class="left clearfix">',
            '<span class="pull-left">',
                '<div class="clearfix">',
                    '<div class="header">',
                        '<strong class="primary-font">',
                            data.user,
                        '</strong>',
                    '</div>',
                    '<p>',
                        data.msg,
                    '</p>',
                '</div>',
            '</span>',
        '</li>'
    ].join("\n");
    list.append(html);
    scroll(list, container);
}

appendOutgoingMessage = function(data, list, container) {
    var html = [    
        '<li class="right clearfix">',
            '<span class="pull-right">',
                '<div class="clearfix">',
                    '<div class="header">',
                        '<strong class="primary-font">',
                            data.user,
                        '</strong>',
                    '</div>',
                    '<p>',
                        data.msg,
                    '</p>',
                '</div>',
            '</span>',
        '</li>'
    ].join("\n");
    list.append(html);
    scroll(list, container);
}

appendMovie = function(data, list, container) {
    var html = [
        '<li class="left clearfix">',
            '<button class="btn btn-default btn-block" data-toggle="collapse" data-target="#' + data.id + '">',
                data.name,
            '</button>',
            '<div id="' + data.id + '" class="collapse">',
                '<span class="pull-right">',
                    '<img src="',
                    data.img,
                    '" alt="Movie Image" class="img" />',
                '</span>',
                '<div class="clearfix">',
                    '<div class="header">',
                        '<strong class="primary-font">',
                            data.name,
                        '</strong>',
                    '</div>',
                    '<p>',
                        data.dur,
                    '</p>',
                    '<p>',
                        data.year,
                    '</p>',
                    '<p>',
                        data.desc,
                    '</p>',
                '</div>',
            '</div>',
        '</li>'
    ].join("\n");
    list.append(html);
    scroll(list, container);
}
