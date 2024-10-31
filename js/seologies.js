var seologies_page = '';
var seologies_percent = 0;

function seologiesSetCookie(cname, cvalue) {
	 var d = new Date();
	 d.setTime(d.getTime() + (365*24*60*60*1000));
	 var expires = "expires="+d.toUTCString();
	 document.cookie = cname + "=" + cvalue + "; path=/";
}

function seologiesShowPage(page) {
	jQuery('.seologies_page').hide();
	jQuery('#seologies_'+page+'_page').show();
	
	seologies_page = page;
	
	if ((page == 'expert_vocabulary') || (page == 'audit_text')) {
		jQuery('#seologies_user_div').show();
	} else {
		jQuery('#seologies_user_div').hide();
	}
}


function seologiesDoLogout() {
	var ajax_url  = (ajaxurl) ?  ajaxurl : ajax_object.ajax_url;
	var data = {
			'action': 'seologies_dologout' 
	};
	
	seologiesBlockUI(true);
    jQuery.post(ajax_url, data, function(response) {
    	   if (response.status == 'ok') {
	    	   seologiesShowPage('login'); 
	       } else {
	    	   alert(response.error);
	       }
	       seologiesBlockUI(false);
   });
}


function seologiesDoLogin() {
	var ajax_url  = (ajaxurl) ?  ajaxurl : ajax_object.ajax_url;
	var data = {
			'action': 'seologies_dologin',
			'email': jQuery('#seologies_email').val(), 
			'password': jQuery('#seologies_password').val()  
	};
	
	   
	seologiesBlockUI(true);
    jQuery.post(ajax_url, data, function(response) {
    	   if (response.status == 'ok') {
	    	   seologiesShowPage('expert_vocabulary'); 
	    	   seologiesShowUserInfo(response.data);
	       } else {
	    	   alert(response.error);
	       }
	       seologiesBlockUI(false);
   });
}

 
function seologiesDoRegister() {
	var ajax_url  = (ajaxurl) ?  ajaxurl : ajax_object.ajax_url;
	var data = {
			'action': 'seologies_doregister',
			'email': jQuery('#seologies_register_email').val(), 
			'display_name': jQuery('#seologies_register_name').val(), 
			'password': jQuery('#seologies_register_password').val()  
	};
	
	   
	seologiesBlockUI(true);
    jQuery.post(ajax_url, data, function(response) {
    	   if (response.status == 'ok') {
	    	   seologiesShowPage('expert_vocabulary'); 
	    	   seologiesShowUserInfo(response.data);
	       } else {
	    	   alert(response.error);
	       }
	       seologiesBlockUI(false);
   });
}
 


function seologiesDoToolExec(tool) {
	var ajax_url  = (ajaxurl) ?  ajaxurl : ajax_object.ajax_url;
 	
	var data = {
			'action': 'seologies_do' + tool,
			'toolname': tool,
			'logid': 0  
   };
	
	if (tool == 'relevantwords') {
		data.showtype = jQuery('#seologies_showtype').attr('checked') ? 'cloud' : '';
		data.words = jQuery('#seologies_words').val(); 
		data.country = jQuery('#seologies_country').val();
	}
	if (tool == 'relevantwordscompare') {
		data.url =  (jQuery('#seologies_audit_url_li').hasClass('seologies_tab_selected')) ? jQuery('#seologies_auditurl').val() : '';
		data.words = jQuery('#seologies_auditwords').val(); 
		data.country = jQuery('#seologies_auditcountry').val();
		data.text = (jQuery('#seologies_audit_url_li').hasClass('seologies_tab_selected')) ? '' : jQuery('#seologies_audittext').val();
	}
	 
	seologiesBlockUI(true);
	seologiesShowToolLoading(tool, 0);
	  
    jQuery.post(ajax_url, data, function(response) {
    	seologiesProcessToolResponse(tool, response, data, 0);
   });
}

 

function seologiesProcessToolResponse(tool, json, data, count) {
    count = count + 1;
    if (count > 100) {
    	jQuery('#seologies' + tool + 'ResultDiv').html('');
        alert('Can not generate report for provided words. Please, try later.');
        return;
    }
    if (false && json['status'] == 'redirect') {
        //window.location = json['url'];
    } else if ((json['status'] == 'error') || ((json['error'] != '') && (json['error'] != null))) {
        alert(json['error']);
        seologiesShowToolLoading(tool, -1);
    } else if ((json['page'] != null) && (json['page'] != '')) {
    	
        // check other tools if they are required
    	if (data.getdata[json['toolname']]) {
    		delete  data.getdata[json['toolname']]; 
    	}
    	
    	if (data.getdata && (Object.keys(data.getdata).length > 0)) {
    		var ajax_url  = (ajaxurl) ?  ajaxurl : ajax_object.ajax_url;
       	    
    		var newdata = jQuery.extend({}, data.getdata[Object.keys(data.getdata)[0]]);
    		newdata.page  = json['data']['page'] ? json['data']['page'] : data.page;
    		newdata.action = data.action;
    		newdata.getdata = data.getdata;
    		data = newdata;
            
    	    jQuery.post(ajax_url, data,
                         function(response) {
                 			seologiesProcessToolResponse(tool, response, data, count);
            }, 'json');
    	    

    		return;
    	}
    	
    	seologiesShowToolLoading(tool, 95);
    	
  	
    	jQuery('#seologies' + tool + 'ResultDiv').html(json['page']);
    	
    	seologiesShowToolLoading(tool, 100);
            
    	if (typeof window['seologies' + tool + 'Show'] != 'undefined') {
            window['seologies' + tool + 'Show']();
        }

        if (tool == 'wordsdensitycompare') {
               // showDivsOrder('wordsdensitycompareResultDiv', 'relevantwordscompareResultDiv');
               // density_compare_init();
        }
        if (tool == 'relevantwordscompare') {
              //  showDivsOrder('relevantwordscompareResultDiv', 'wordsdensitycompareResultDiv');
        }
        
 
    } else if (json['data'] != null) {
    	seologiesShowToolLoading(tool, (json['data']['phase_percent']) ? json['data']['phase_percent']: (seologies_percent + 2));
    	 
        if (json['data']['hash_get'] != null) {
        	data = {'action': data.action, 'hash_get' : json['data']['hash_get']};
        }

        if (json['logid'] != null) {
            data.logid = json['logid'];
        }

        if (json['toolname'] != null) {
            data.toolname =  json['toolname'];
        }
        
        if (json['data']['getdata'] != null) {
            data.getdata =  json['data']['getdata'];
        }
        
        if (json['data']['page']) {
            data.page =  json['data']['page'];
        }
         
    	var ajax_url  = (ajaxurl) ?  ajaxurl : ajax_object.ajax_url;
    	 
        setTimeout(function() {
        	jQuery.post(ajax_url, data,
                    function(response) {
            			seologiesProcessToolResponse(tool, response, data, count);
                    }, 'json');
        }, 4000);
    } else {
        alert('Some error occured, please, try later.');
        seologiesShowToolLoading(tool, -1);
    }
}

function seologiesBlockUI(block) {
	if (block) {
		jQuery('.seologies_page input').attr('disabled', true);
		jQuery('#seologies_audittext').attr('disabled', true);
 	} else {
		jQuery('.seologies_page input').removeAttr('disabled');
		jQuery('#seologies_audittext').removeAttr('disabled');
	}
}


function  seologiesShowToolLoading(tool, percent) {
	
	//console.log(tool +" %=" + percent + " seologies_percent="+seologies_percent);
	
    if (percent < 0) { //remove loading due  error
    	jQuery('.seologiesProgress').css('display', 'none');
        seologiesBlockUI(false);
     } else if (percent == 0) { //start loading
    	jQuery('.seologiesBar').html('1%');
    	jQuery('.seologiesBar').css('width', '1%');
    	jQuery('.seologiesProgress').css('display', 'block');
    	seologies_percent = 0;
     } else if (percent > 0 && percent < 100) { //processing
        //$('#'+tool+'ResultDiv').html('Processing ' + percent + '%...');
        //console.log(percent);
    	 seologies_percent = percent; 
    	 if (seologies_percent >= 98) {
    		 seologies_percent = 98;
    	 }
    	jQuery('.seologiesBar').html((seologies_percent) + '%');

    	jQuery('.seologiesBar').css('width', (seologies_percent) + '%'); //percent + '%'
        // console.log(percent);
    	jQuery('.seologiesProgress').css('display', 'block');

    } else if (percent == 100) { //result  is  ready
    	jQuery('.seologiesBar').css('width', '100%');
        jQuery('.seologiesProgress').css('display', 'none');
        seologiesBlockUI(false);
        seologies_percent = 0;
    }
}

function seologiesShowAuditUrl() {
	jQuery('#seologies_audit_text_div').hide();
	jQuery('#seologies_audit_url_div').show();
	
	jQuery('#seologies_audit_text_li').removeClass('seologies_tab_selected');
	jQuery('#seologies_audit_url_li').addClass('seologies_tab_selected');
}


function seologiesShowAuditText() {
	jQuery('#seologies_audit_text_div').show();
	jQuery('#seologies_audit_url_div').hide();
	
	jQuery('#seologies_audit_text_li').addClass('seologies_tab_selected');
	jQuery('#seologies_audit_url_li').removeClass('seologies_tab_selected');
}


function seologiesShowUserInfo(user) {
	   if (user.name) {
		   jQuery('#seologies_user_name').html("<b>You are logged in as:</b> " + user.name);
	   } else {
		   jQuery('#seologies_user_name').html("");
	   }
	   
	   var info = '';
	   if (user.role == 'premium' || user.role == 'premium_for_free') {
		   info = 'You are Premium user';
	   } else if (user.role == 'admin') {
		   info = 'You are Administrator';
	   } else {
		   info = 'Free searches: ' + user.free_searches;
	   } 
	   //jQuery('#seologies_user_info').html(info);
}


function seologiesUseTitle(inputid) {
	var title = jQuery("input[name='post_title']").val();
	if (title) {
		jQuery('#' + inputid).val(title);
	} else {
		alert('Title is empty');
	}
	 
}



function seologiesUseText(inputid) {
	seologiesShowAuditText();
	
	var text =  '';
	if (jQuery("textarea[name='content']").is(':visible')) {
 	   text = jQuery("textarea[name='content']").val();
 	} else {
 	   text = (tinyMCE)?tinyMCE.activeEditor.getContent({format : 'raw'}):'';
	}
 	   
	if (text) {
		jQuery('#' + inputid).val(text);
	} else {
		alert('Content is empty');
	}
 
}

 
 

jQuery(document).ready(
  function () {
	  seologiesShowAuditUrl();
	  if (!seologies_loggedin) {
		  seologiesShowPage('login'); 
	  } else {
		  seologiesShowPage('expert_vocabulary'); 
	  }
  }		
); 