(function($, plugin){
   "use strict";
   $.widget('apex.apex_session_timeout', {
      options:{
         timeoutAction: null,
         timeoutMessage: null,
         timeoutURL: null,
         logoutURL: null,
         showWarning: null,
         showWarningMiliBefore: null,
         showWarningTitle: null,
         showWarningMessage: null,
         hideHistory:false,
         sessionIdleDuration: null,
         maskBrowser: null,
         ajaxIdentifier: null,
         keepSessionAlive : null,
         debug: true //$('#pdebug').length !== 0 //true boolean for ===
      },
      _create: function(){
         var uiw = this;
         
         apex.debug('Session Timeout: _create (start)');

         apex.debug('...Options');
         if (uiw.options.debug){
            for (name in uiw.options) {
               apex.debug('......' + name + ': "' + uiw.options[name] + '"');
            }
         }
         
         uiw._createPrivateStorage();
         
         uiw._startTimers();
         
         if(uiw.options.keepSessionAlive){
            uiw._startIdleMonitor();
            uiw._startPingTimer();
         }

         apex.debug('Session Timeout: _create (end)');
      },
      _startPingTimer: function(){
         var uiw = this;
         
         apex.debug('Session Timeout: _startSessionPingTimer (start)');
   		
         uiw._values.pingID = setTimeout(function(){ 
            uiw._handlePing(); 
         }, uiw._values.pingFrequency);
   		
         apex.debug('Session Timeout: _startSessionPingTimer (end)');
      },
      _startIdleMonitor: function(){
         var uiw = this;
         
         apex.debug('Session Timeout: _startIdleMonitor (start)');

         $.idleTimer(uiw._values.checkIdleFrequency);

         $(document).bind("idle.idleTimer", function(){
            apex.debug('Session Timeout: session inactive!');
         });
         
         $(document).bind("active.idleTimer", function(){
             apex.debug('Session Timeout: session active!)');
             uiw._pingSession();
         });	
         
         apex.debug('Session Timeout: _startIdleMonitor (end)');	
      },
      _createPrivateStorage: function() {
         var uiw = this;
         
         apex.debug('Session Timeout: _createPrivateStorage (start)');
   		
         uiw._values = {
            docTitle : document.title,
            titleBlinkIntervalID: null,
            titleBlinkInterval: 8000,
            warningID: null,
            timeoutID: null,
            pingID: null,
            checkIdleFrequency: 60000,
            pingFrequency: 60000,
            isWarned:false,
            timeoutActionEnum : {
               ALERT : 'ALERT',
               REDIRECT : 'REDIRECT',
               LOGOUT : 'LOGOUT'
            }
         };
         
         uiw._elements = {
            $dialog: {}
         };
         
         apex.debug('Session Timeout: _createPrivateStorage (end)');
      },
      _startTimers: function(){
         var uiw = this;
         
         apex.debug('Session Timeout: startTimer (start)');
         
         if (uiw.options.showWarning){
            uiw._values.warningID = setTimeout(function(){
               uiw._warn();
            }, uiw.options.sessionIdleDuration - uiw.options.showWarningMiliBefore);
            apex.debug('...initializing warning timeout('+ uiw._values.warningID +')');
         }
         
         uiw._values.timeoutID = setTimeout(function(){ uiw._handleExpiredSession(); },uiw.options.sessionIdleDuration);
         apex.debug('...initializing idle timeout('+ uiw._values.timeoutID +')');
   		
         apex.debug('Session Timeout: startTimer (end)');
      },
      _stopTimers: function(){
         var uiw = this;
   	
         apex.debug('Session Timeout: _stopTimers (start)');
         
         if(uiw.options.keepSessionAlive && uiw._values.timeoutID && uiw._values.timeoutID !== null){
         apex.debug('...clearng idle timeout('+ uiw._values.timeoutID +')');
            clearTimeout(uiw._values.timeoutID);
            uiw._values.timeoutID = null;
         }
         
         if (uiw.options.showWarning && uiw._values.warningID && uiw._values.warningID !== null){
            apex.debug('...clearng warning timeout('+ uiw._values.warningID +')');
            clearTimeout(uiw._values.warningID);
            uiw._values.warningID = null;
         }
         
         apex.debug('Session Timeout: _stopTimers (end)');
      },
      _handleExpiredSession: function(){
         var uiw = this;
         
         apex.debug('Session Timeout: _handleExpiredSession (start)');

         if(uiw.options.maskBrowser){
            uiw._showMask();
         }
         
         setTimeout(function(){ 
            uiw._expireAction();
         }, 100);      
         
         apex.debug('Session Timeout: _handleExpiredSession (end)');
      },
      _expireAction: function(){
         var uiw = this;
         
         apex.debug('Session Timeout: _expireAction (start)');

         if (uiw.options.timeoutAction === uiw._values.timeoutActionEnum.ALERT) {
            alert(uiw.options.timeoutMessage);
            uiw._redirect(uiw.options.timeoutURL);
         } else if (uiw.options.timeoutAction === uiw._values.timeoutActionEnum.REDIRECT) {
            uiw._redirect(uiw.options.timeoutURL);
         } else if (uiw.options.timeoutAction === uiw._values.timeoutActionEnum.LOGOUT) {
            uiw._redirect(uiw.options.logoutURL);
         }
         
         apex.debug('Session Timeout: _expireAction (end)');
      },
      _warn: function(){
         var uiw = this;
         
         apex.debug('Session Timeout: _warn (start)');
   		
         var dialogHtml = 
            '<div class="session-timeout-container ui-widget">' + 
            '   <p>'+ uiw.options.showWarningMessage  +'</p>' + 
            '</div>';		
   			
         $('body').append( dialogHtml );
         uiw._elements.$dialog = $('.session-timeout-container'); 
         
         uiw._elements.$dialog.dialog({
            disabled: false,
            autoOpen: true,
            buttons: { "Ok": function() { $(this).dialog("close"); } },
            closeOnEscape: true,
            closeText: 'Close',
            dialogClass: 'session-timeout-dialog',
            draggable: true,
            height: 'auto',
            hide: null,
            maxhHeight: false,
            maxWidth: false,
            minHeight: 100,
            minWidth: 200,
            modal: true,
            resizable: false,
            show: null,
            stack: true,
            title: uiw.options.showWarningTitle,
            close: function() {
               uiw._closeWarning();
            }
         });

         uiw._startTitleBlink();
         uiw._values.isWarned = true;
         
         if(uiw.options.keepSessionAlive){
            $.idleTimer('destroy');
         }
         
         apex.debug('Session Timeout: _warn (end)');
      },
      _closeWarning: function(){
         var uiw = this;
   		
         apex.debug('Session Timeout: _closeWarning (start)');
         
         uiw._elements.$dialog.dialog('destroy');
         uiw._elements.$dialog.remove();
         uiw._stopBlink();
         uiw._stopTimers();
         uiw._values.isWarned = false;
   		
         if(uiw.options.keepSessionAlive){
            uiw._pingSession();
            uiw._startIdleMonitor();
         }
         
         apex.debug('Session Timeout: _closeWarning (end)');
      },
      _startTitleBlink: function(){
         var uiw = this;

         apex.debug('Session Timeout: _startTitleBlink (start)');

         uiw._titleBlink();
         uiw._values.titleBlinkIntervalID = setInterval(function(){ 
            uiw._titleBlink(); 
         }, uiw._values.titleBlinkInterval);
         
         apex.debug('Session Timeout: _startTitleBlink (end)');
      },
      _titleBlink: function(){
         var uiw = this;
         
         apex.debug('Session Timeout: _titleBlink (start)');   
      
         document.title = uiw.options.showWarningTitle;
         setTimeout(function(){ 
            document.title = uiw._values.docTitle;  
         }, 500);
          
         apex.debug('Session Timeout: _titleBlink (end)');
      },
      _stopBlink: function(){
         var uiw = this;
         
         apex.debug('Session Timeout: _stopBlink (start)');
         
         document.title = uiw._values.docTitle;
         clearInterval(uiw._values.titleBlinkIntervalID);

         apex.debug('Session Timeout: _stopBlink (end)');
      },
      _redirect: function(url){
         var uiw = this;
         
         apex.debug('Session Timeout: _redirect (start)');
         
         if (uiw.options.hideHistory) {
            window.location.replace(url);
         } else {
            window.location.href = url;
         }  
         
         apex.debug('Session Timeout: _redirect (end)');
      },
      _showMask: function(){
         var uiw = this;
         var maskHeight = $(document).height();
         var maskWidth = $(window).width();
         var $mask = $(document.createElement('div')).attr('id','session-timeout-mask').css({
            'width' : maskWidth,
            'height' : maskHeight
         });

         apex.debug('Session Timeout: _showMask (start)');
         apex.debug('...maskHeight:' + maskHeight);
         apex.debug('...maskWidth:' + maskWidth);

         $('body').append($mask);

         $(window).resize(function(){ 
            var maskHeight = $(document).height();
            var maskWidth = $(window).width();

            $('#session-timeout-mask').css({'width':maskWidth,'height':maskHeight});
         });
         
         apex.debug('Session Timeout: _showMask (end)');
      },
      _handlePing: function(){
         var uiw = this;

         apex.debug('Session Timeout: _handlePing (start)');   
         
         if($.data(document,'idleTimer') === 'active'){
            apex.debug('session is active. Refreshing server session');
            uiw._pingSession();
         }else{
            apex.debug('session is inactive. Do not refresh server session.');
         }
         apex.debug('Session Timeout: _handlePing (end)');         
      },
      _pingSession: function(){
         var uiw = this;

         apex.debug('Session Timeout: _pingSession (start)');
         
         plugin(
            uiw.options.ajaxIdentifier,
            {},
            {
               dateType: 'text',
               success: function(data){
                  apex.debug('Ajax request successful');
                  clearTimeout(uiw._values.pingID);
                  uiw._startPingTimer();
                  uiw._stopTimers();
                  uiw._startTimers();
               }
            }
         ); 
         
         apex.debug('Session Timeout: _pingSession (end)');
      }
   });
})( apex.jQuery, apex.server.plugin );