FUNCTION render_session_timeout (
   p_dynamic_action IN APEX_PLUGIN.T_DYNAMIC_ACTION,
   p_plugin         IN APEX_PLUGIN.T_PLUGIN 
)

   RETURN APEX_PLUGIN.T_DYNAMIC_ACTION_RENDER_RESULT
   
IS

   l_result                APEX_PLUGIN.T_DYNAMIC_ACTION_RENDER_RESULT;
   l_timeoutAction         VARCHAR2(4000);
   l_timeoutMessage        VARCHAR2(500);
   l_timeoutURL            VARCHAR2(4000);
   l_logoutURL             VARCHAR2(4000);
   l_showWarning           BOOLEAN;
   l_showWarningMiliBefore NUMBER;
   l_showWarningTitle      VARCHAR2(50);
   l_showWarningMessage    VARCHAR2(500);
   l_hideHistory           BOOLEAN;
   l_sessionIdleDuration   NUMBER;
   l_maskBrowser           BOOLEAN;
   l_keepSessionAlive      BOOLEAN;
   l_crlf                  CHAR(2) := CHR(13)||CHR(10);   

BEGIN

   IF apex_application.g_debug
   THEN
      apex_plugin_util.debug_dynamic_action(
         p_plugin         => p_plugin,
         p_dynamic_action => p_dynamic_action 
      );
   END IF;
   
   l_timeoutAction         := NVL(p_plugin.attribute_01,'ALERT');
   l_timeoutMessage        := NVL(p_plugin.attribute_02,'Session has been idle for too long!');
   l_showWarning           := CASE p_plugin.attribute_03
                                 WHEN 'Y' THEN TRUE
                                 ELSE FALSE
                              END;                            
   l_showWarningMiliBefore := p_plugin.attribute_06 * 1000;
   l_showWarningTitle      := NVL(p_plugin.attribute_08,'Idle Session Warning');
   l_showWarningMessage    := NVL(p_plugin.attribute_04,'This session will expire shortly!');
   l_hideHistory           := FALSE;
   l_maskBrowser           := CASE p_plugin.attribute_05
                                 WHEN 'N' THEN FALSE
                                 ELSE TRUE
                              END;
   l_keepSessionAlive      := CASE p_plugin.attribute_07
                                 WHEN 'Y' THEN TRUE
                                 ELSE FALSE
                              END;
                              
   SELECT 
      NVL(MAXIMUM_SESSION_IDLE_SECONDS, 3600) * 1000, 
      NVL(SESSION_IDLE_TIME_EXCEEDED_URL, HOME_LINK), 
      NVL(LOGOUT_URL,'apex_authentication.logout?p_app_id=&APP_ID.&p_session_id=&SESSION.')
   INTO 
      l_sessionIdleDuration, 
      l_timeoutURL, 
      l_logoutURL
   FROM 
      apex_applications
   WHERE 
      application_id = apex_application.g_flow_id;
      
   l_timeoutURL := apex_plugin_util.replace_substitutions (l_timeoutURL);
   
   l_logoutURL := apex_plugin_util.replace_substitutions (l_logoutURL);

   apex_css.add(
      p_css => 
         '#session-timeout-mask{position: absolute;z-index: 9000;background-color : #343434;top: 0;left: 0;}' || l_crlf ||
         '.session-timeout-dialog .ui-dialog-titlebar-close{display: none !important;}'
   );
   
   apex_javascript.add_library(
      p_name      => 'jquery.ui.button',
      p_directory => '#JQUERYUI_DIRECTORY#ui/',
      p_version   => NULL
   );
   
   IF l_keepSessionAlive THEN
      apex_javascript.add_library(
         p_name      => 'idle-timer.min',
         p_directory => p_plugin.file_prefix||'lib/idle-timer/js/',
         p_version   => NULL 
      );  
   END IF;
  
   l_result.javascript_function := 
         'function(){apex.jQuery(document).apex_session_timeout({' || l_crlf
      || '   ' || apex_javascript.add_attribute('timeoutAction',        l_timeoutAction) || l_crlf         
      || '   ' || apex_javascript.add_attribute('timeoutMessage',       l_timeoutMessage) || l_crlf        
      || '   ' || apex_javascript.add_attribute('timeoutURL',           l_timeoutURL) || l_crlf            
      || '   ' || apex_javascript.add_attribute('logoutURL',            l_logoutURL) || l_crlf             
      || '   ' || apex_javascript.add_attribute('showWarning',          l_showWarning) || l_crlf           
      || '   ' || apex_javascript.add_attribute('showWarningMiliBefore',l_showWarningMiliBefore) || l_crlf 
      || '   ' || apex_javascript.add_attribute('showWarningTitle',     l_showWarningTitle) || l_crlf  
      || '   ' || apex_javascript.add_attribute('showWarningMessage',   l_showWarningMessage) || l_crlf    
      || '   ' || apex_javascript.add_attribute('hideHistory',          l_hideHistory) || l_crlf           
      || '   ' || apex_javascript.add_attribute('sessionIdleDuration',  l_sessionIdleDuration) || l_crlf   
      || '   ' || apex_javascript.add_attribute('maskBrowser',          l_maskBrowser) || l_crlf           
      || '   ' || apex_javascript.add_attribute('keepSessionAlive',     l_keepSessionAlive) || l_crlf
      || '   ' || apex_javascript.add_attribute('ajaxIdentifier',       apex_plugin.get_ajax_identifier(), FALSE, FALSE) || l_crlf
      || '});}';

   RETURN l_result;
    
END render_session_timeout;

FUNCTION ajax_session_timeout(
    p_dynamic_action IN apex_plugin.t_dynamic_action,
    p_plugin         IN apex_plugin.t_plugin 
)
    RETURN apex_plugin.t_dynamic_action_ajax_result
IS
   l_result apex_plugin.t_dynamic_action_ajax_result;
BEGIN 
   RETURN l_result;
END ajax_session_timeout;