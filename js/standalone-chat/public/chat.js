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

showEmotionDialog = function(data, item, container) {
    item.empty();

    var otherButtons = '';
    for (var i in data.others) {
        otherButtons +=
            '<button id="' + data.others[i] + 
                '" class="btn btn-default btn-block">' +
            data.others[i] +
            '</button>';
    }

    var html = [
        '<div class="panel">',
            '<div class="panel-heading">',
                '<h4>',
                    'Emotion Analysis:',
                '</h4>',
                '<p>',
                    'Looks like you are experiencing',
                    data.emotion,
                    '!',
                '</p>',
                '<p>',
                    data.emotion,
                    'is a categorized as',
                    data.category + '.',
                '</p>',
            '</div>',
            '<div class="panel-body">',
                'If you want to stay in you current mood, click this button:',
                '<button id="' + data.emotion + '"',
                    'class="btn btn-default btn-block">',
                    data.emotion,
                '</button>',
                'Otherwise choose one of the other categories:',
                otherButtons,
            '</div>',
        '</div>',
    ].join("\n");
    item.append(html);
    scroll(item, container);
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
                    '" alt="Movie Image" class="img" style="height:512px; width:auto" />',
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
