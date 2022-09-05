$(document).ready(() => {
    $(document).find('.js-ck-editor').each((i, ele) => {
        CKEDITOR.replace(ele);
    })
    $(document).find('.js-select2').each((i, ele) => {
        $(ele).select2({ theme: 'bootstrap4' });
    });
    $(document).on('click', '.is-invalid', function () {
        $(this).removeClass('is-invalid').parent().find('span.invalid-feedback').remove();
    })
    $(document).on('click', '.js-delete-link', function (e) {
        var message = $(this).attr('data-message');
        var href = $(this).attr('href');
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                window.location.href = href;
            }
        })
    });0
    $(document).on('change', '#editor-handle', function (e) {
        switch (this.value) {
            case 'text':
                $("#js-textarea").show().find('.js-inpt').prop('disabled',false);
                $("#js-image").hide().find('.js-inpt').prop('disabled',true);
                $("#js-checkbox").hide().find('.js-inpt').prop('disabled',true);
                break;
            case 'checkbox':
                $("#js-checkbox").show().find('.js-inpt').prop('disabled',false);    
                $("#js-textarea").hide().find('.js-inpt').prop('disabled',true);
                $("#js-image").hide().find('.js-inpt').prop('disabled',true);                
                break;
            case 'json':
                $("#settingValue").show();
                $("#imageWrapper").hide();
                break;
            case 'image':
                $("#js-image").show().find('.js-inpt').prop('disabled',false);    
                $("#js-textarea").hide().find('.js-inpt').prop('disabled',true);                
                $("#js-checkbox").hide().find('.js-inpt').prop('disabled',true);
                break;
        }
    })
})
loaderShow = (elem = '.card') => {
    $(elem).find('span.error').remove();
    $(elem).find('div.overlay').remove();
    $(elem).append('<div class="overlay"><i class="fas fa-cog fa-3x text-info fa-spin"></i></div>');
}
loaderHide = (elem = '.card') => {
    $(elem).find('div.overlay').remove();
}
buildPagination = (data, currentPage, paginationElemId) => {
    var id = paginationElemId || 'pagination';
    var cursor = currentPage || 1;
    var itemsPerPage = conf.ITEMS_PER_PAGE;
    var count = data.total_record;
    lastPage = 0;
    if (itemsPerPage < count) {
        noOfRecordOnlastPage = count % itemsPerPage;
        lastPage = noOfRecordOnlastPage > 0 ? 1 : 0;//count % itemsPerPage;
    }
    var noOfPage = Math.floor(count / itemsPerPage);
    var totalPages = parseInt(noOfPage) + parseInt(lastPage)
    $('#' + id).html('');
    $('#' + id).append('<li class="page-item"><a href="javascript:void(0)" class="first page-link" data-page="1">First</a></li>')
    for (var i = 1; i <= totalPages; i++) {
        var activeClass = cursor == i ? 'active' : '';
        $('#' + id).append('<li class="page-item ' + activeClass + '"><a href="javascript:void(0)" class="page-link" data-page="' + i + '">' + i + '</a></li>');
    }
    $('#' + id).append('<li class="page-item"><a href="javascript:void(0)" class="last page-link" data-page="' + totalPages + '">Last</a></li>')
    var itemsPerPageInfo = data.result.length;
    var totalPagesInfo = totalPages == 0 ? 1 : totalPages;
    $('.pagination-metadata').text('Page ' + currentPage + ' of ' + totalPagesInfo + ', showing ' + itemsPerPageInfo + ' records out of ' + count + ' total')

}

queryStringToJSON = (queryString) => {
    if (queryString.indexOf('?') > -1) {
        queryString = queryString.split('?')[1];
    }
    var pairs = queryString.split('&');
    var result = {};
    pairs.forEach(function (pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });
    return result;
}

updateUrlWithQueryString = (query) => {
    if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + query;
        window.history.pushState({ path: newurl }, '', newurl);
    }
}

rowLoader = (colspan) => {
    return '<tr><td colspan="' + colspan + '"><div class="ph-item"><div class="ph-col-12"><div class="ph-row"><div class="ph-col-12"></div><div class="ph-col-12"></div><div class="ph-col-12"></div></div></div></div></td></tr>';
}

setActivePage = (ele) => {
    $(ele).closest('ul#pagination').find('li.active').removeClass('active');
    $(ele).closest('li.page-item').addClass('active');
}

updateArgsWithQueryStrings = (query) => {
    var json = queryStringToJSON(query)
    for (var key in json) {
        $('input[name="' + key + '"]').val(json[key]);
    }
    var page = json.page || 1;
    var ele = $('ul#pagination').find('[data-page="' + page + '"]').not('.first').not('.last');
    setActivePage(ele);
    updateUrlWithQueryString(query);
}