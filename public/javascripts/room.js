$(function() {
    function autoScroll(){
	var e = $(".message-list .message:last");
	if(e.length > 0){
            $(window).scrollTo( e , 500, { easing:'swing', queue:true, axis:'y' } );
	}
    }

    // on the spot
    function onTheSpot(dom){
	// You can edit your own message
	if (dom.find('.screen-name').text() == AsakusaSatellite.current.user) {
            var body = dom.find(".body");
            body.onTheSpot({
		url  : AsakusaSatellite.url.update,
		data : body.attr("original")
            });
            dom.find(".edit").bind("click",function(){ body.trigger("onTheSpot::start"); });
            dom.find(".delete").bind("click",function(){
		if(confirm(AsakusaSatellite.t['are_you_sure_you_want_to_delete_this_message'])){
		    // http://travisonrails.com/2009/05/20/rails-delete-requests-with-jquery
		    var id = dom.attr("target");
		    jQuery.post(AsakusaSatellite.url.destroy,
				{ 'id' : id, _method: 'delete' });
		}
            });
	}else{
            dom.find(".own-message").hide();
	}

	// show edit button
	dom.hover(function(e) {
            $(this).find('.edit-icons').fadeIn();
	},function(e){
            $(this).find('.edit-icons').fadeOut();
	});
    }
    $(".message").each(function(_, e){
	onTheSpot( $(e) );
    });

    // make div.message from object
    function makeElement(message){
	var dom = $(message.view);
	onTheSpot(dom);
	return dom;
    }
    $(".message-list").webSocket({ makeElement : makeElement,
                                   entry : AsakusaSatellite.url.websocket});

    // read more button
    $("#read-more").readMore({
	id : function(){ return $(".message").first().attr("target"); },
	container : ".message-list",
	content : ".message",
	url : AsakusaSatellite.url.prev,
	indicator : AsakusaSatellite.resouces.ajaxLoader,
	onLoad : function(messages){ messages.each(function(_, e){ onTheSpot($(e)); }); }
    });


// messages send
  $('textarea#message').multiline();
  $(".message-list").bind('websocket::connect', function(_, ws){
      $('form.inputarea').bind('submit', function(e){
	  e.stopPropagation();
	  e.preventDefault();
	  jQuery.post(AsakusaSatellite.url.create,
		      {
			  'room_id' : AsakusaSatellite.current.room,
			  'message' : $('textarea#message').val()
		      });
	  $('textarea#message').val('');
      });
  });

    // show status of websocket
    $(".message-list").bind('websocket::connect', function(){
	$("img.websocket-status").attr('src', AsakusaSatellite.resouces.connect);
    });
    $(".message-list").bind('websocket::error', function(){
	$("img.websocket-status").attr('src', AsakusaSatellite.resouces.disconnect);
    });

    // scroll after loaded
    $(".message-list").bind('websocket::create', function(){
	autoScroll();
    });
    function scrollAfterImage(e){
	$(".attachment img", e).bind("load", function(){
	    autoScroll();
	});
    }
    autoScroll();
    scrollAfterImage($(".message-list"))

    // message notification
    $(".message-list").bind('websocket::create', function(_, message){
	if(message.screen_name != AsakusaSatellite.current.user) {
	    $.fn.desktopNotify({
		picture: message.profile_image_url,
		title: message.name,
		text : (message.attachment != null ? message.attachment.filename : message.body)
	    });
	}
	document.getElementById("audio").load();
	document.getElementById("audio").play();
    });

    // File DnD
    uploadConfig = {
	action : "#{url_for(:controller => 'chat', :action => 'message')}",
	params : [{ room_id : AsakusaSatellite.current.room},
		  { authenticity_token: AsakusaSatellite.form_auth }],
	onProgress : function(value){
	    console.log(value);
	},
	onPartialError : function(){
	},
	onComplete : function(){
	}
    };
    $('.message-list').dropUploader(uploadConfig);
    $('#message').dropUploader(uploadConfig);
});


