    function seologiesrelevantwordsShow() {

        var start = new Date().getTime();

        var iscloud = document.getElementById('seologies_showtype').checked ? true : false;

        try {
            if (typeof mainwords == 'string' && mainwords != '' && mainwords != '[]' && mainwords != 'null') {
                mainwords = jQuery.parseJSON(mainwords);
            } else {
                alert('There are no relevant words.');
                return false;
            }

            if (!iscloud) {
                var str = '';
             
                for (var index = 0; index < mainwords.length; index++) {
                    var word = mainwords[index];

                    var re = /^[0-9\!\\\]\[\}\{\=\+\-\)\(\*\&\?\^\:\$\;\@\"\']+$/g; //this is correct place for this line, do not  move it
                    
                    if ((typeof word['word'] != 'string') || (word['word'] == '') ||  (word['word'] == null) || re.test(word['word'])) {
                        continue;
                    }
                    

                    var wordtemplate = jQuery('#seologiesresult_main_template').html();

                    wordtemplate = str_replace(["{HTML(WORD.word)}", "{URL(WORD.word)}", "{WORD.rating}", "{INDEX}"],
                            [htmlentities(word['word']), rawurlencode(word['word']), word['rating'], index],
                            wordtemplate);

                    var related = '';
                    if (word.related.length > 0) {
                        for (var i = 0; i < word.related.length; i++) {
                        	 var re = /^[0-9\!\\\]\[\}\{\=\+\-\)\(\*\&\?\^\:\$\;\@\"\']+$/g; //this is correct place for this line, do not  move it
                             
                             if ((typeof word.related[i] != 'string') || (word.related[i] == '') ||  (word.related[i] == null) || re.test(word.related[i])) {
                                 continue;
                             }
                             
                            var relatedtemplate = jQuery('#seologiesword_related_template').html();
                            relatedtemplate = str_replace(["{URL(related)}", "{HTML(related)}"],
                                    [rawurlencode(word.related[i]), htmlentities(word.related[i])],
                                    relatedtemplate);
                            related += relatedtemplate;
                        }
                    }

                    wordtemplate = wordtemplate.replace("{RELATED}", related);

                    str += wordtemplate;
                }

                jQuery('#seologiesrelevantwordsresultDiv').append(str);
            } else {
                tag_block = false;

                var str = '';
                for (var index = 0; index < mainwords.length; index++) {
                    var word = mainwords[index];

 					var re = /^[0-9\!\\\]\[\}\{\=\+\-\)\(\*\&\?\^\:\$\;\@\"\']+$/g; //this is correct place for this line, do not move it
                    
                    if ((typeof word['word'] != 'string') || (word['word'] == '') ||  (word['word'] == null) || re.test(word['word'])) {
                        continue;
                    }

                    var wordtemplate = jQuery('#seologiesresult_cloud_main_template').html();

                    wordtemplate = str_replace(["{HTML(WORD.word)}", "{WORD.color}", "{WORD.font}", "{INDEX}"],
                            [htmlentities(word['word']), word['color'], word['font'], index],
                            wordtemplate);

                    str += wordtemplate;
                }

                jQuery('#seologiestagsTd').html(str);
            }
        } catch (e) {
            alert(e);
        }

        var end = new Date().getTime();
        var time = end - start;

        console.log('relevantwordsShow Execution time: ' + time);
    }

    function seologiesshowMoreInfo(index) {
    	
     
        if (typeof allpages == 'string') {
            allpages = jQuery.parseJSON(allpages);
        }
        if (typeof alldomains == 'string') {
            alldomains = jQuery.parseJSON(alldomains);
        }

        if (mainwords[index] != null) {
            var word = mainwords[index];

            var start = new Date().getTime();

            var tplText = jQuery('#seologiesmoreinfo_template').html();
            var tpl = new jSmart(tplText);
            var res = tpl.fetch({'main_word': word, 'domains': alldomains, 'pages': allpages, 'infoindex': start});

            var end = new Date().getTime();
            var time = end - start;

            jQuery('#seologiesmoreInfo' + index).html(res);
            
            jQuery('#seologiesmoreInfo' + index).show();
            mainwords[index] = null;
            // console.log('showMoreInfo jSmart gen time: ' + time);
        } else {
        	jQuery('#seologiesmoreInfo' + index).toggle();
        } 
    }


    var tag_block = false;
    function seologiesshowTag(index, source, src_elmnt) {

        if (source == 'click') {
            tag_block = true;
        }

        if (typeof allpages == 'string') {
            allpages = jQuery.parseJSON(allpages);
        }
        if (typeof alldomains == 'string') {
            alldomains = jQuery.parseJSON(alldomains);
        }

        if (mainwords[index] != null) {
            var word = mainwords[index];

            var start = new Date().getTime();

            var tplText = jQuery('#seologiesshowtag_template').html();
            var tpl = new jSmart(tplText);
            var res = tpl.fetch({'main_word': word, 'domains': alldomains, 'pages': allpages, 'index': index, 'infoindex': index});

            var end = new Date().getTime();
            var time = end - start;

            jQuery('#seologiestagsTd').append(res);
            mainwords[index] = null;

            // alert('jSmart gen time = ' +  time);
            console.log('showTag jSmart gen time = ' + time);
        }

        if (tag_block) {
        	jQuery('#seologiestagunBlock' + index).css({display: 'block'});
        } else {
        	jQuery('#seologiestagunBlock' + index).hide();
        }

        if (source != 'click' && tag_block) {
            return;
        }


        jQuery('.seologiesacloud').removeClass('wdselected');
        jQuery(src_elmnt).addClass('wdselected');

        var maxHeight = jQuery('#seologiestagsTd')[0].clientHeight;
        seologiestagDisplayOffset(index);
        window.onscroll = function() {
        	seologiestagDisplayOffset(index, maxHeight);
        }
    }

    function seologiestagDisplayOffset(index, maxHeight) {
        //$('#tagDiv' + index).css('height', ((($(window).height() - 50) > 300) ? $(window).height() - 50 : 300) + 'px');
    	jQuery('#seologiestagDisplay').html(jQuery('#seologiestag' + index).html());
        var screenScroll = window.pageYOffset;
        if (!(jQuery('#seologiestagsTd') && jQuery('#seologiestagsTd').parent() && jQuery('#seologiestagsTd').parent().position())) {
            return;
        }
        var tagsContainerTop = jQuery('#seologiestagsTd').parent().position().top;
        jQuery('#seologiestagDisplay').css({'float': 'left'});
        
        var rightH = jQuery('#seologiestagDisplay')[0].clientHeight;
        var leftH = jQuery('#seologiestagsTd')[0].clientHeight;
        
        if (screenScroll > tagsContainerTop)
        {
            var offset = screenScroll - tagsContainerTop;
            if (offset+rightH > leftH)
                offset = leftH-rightH;
            
            jQuery('#seologiestagDisplay').css({'margin-top': offset + 'px'});
        }
        else
        {
        	jQuery('#seologiestagDisplay').css({'margin-top': '0px'});
        }
    }

    function seologiestagunBlock() {
        tag_block = false;
        jQuery('#seologiestagDisplay').html('');
        jQuery('.seologiesacloud').removeClass('wdselected');
    }


    function seologieschosenSelectChanged() {
        var val = jQuery('#seologieschosenOne').val();
        if (val == 0) {
            alert("To continue, please join the Premium community.")
            //window.location = '/app/premium'
        }
    }
