# SKILLBUILDERS SESSION TIMEOUT A DYNAMIC ACTION PLUGIN FOR ORACLE APPLICATION EXPRESS (APEX)
Intro
For a while now APEX has had a “Maximum Session Idle Time in Seconds” attribute in the Security Settings of an application. As one might imagine, this setting allows developers to kill a user’s session if the user has been idle for a certain amount of time. The problem, however, is that the implementation of this feature is purely server side (which is good from a security perspective).

Usually when this type of functionality is added to a site, say a bank’s web site, there’s some client side behavior added in addition to the server side behavior. This client side functionality may let a user know that their session has expired or even warn a user before it does. The SkillBuilders Session Timeout plug-in adds this type of client side behavior to APEX applications quickly and easily.

## Features at a Glance

- Configurable timeout actions including alert, redirect, and logout
- Optional and configurable warning message
- Option to keep session alive if user isn’t truly idle. Special thanks to Martin D’Souza for a great idea on how to implement this feature.

## Version History

- 1.0.0 – 2/21/2012 Initial release
- 1.0.1 - 3/17/2012 Fixed bug that raised “ORA-01008: not all variables bound” exception on some systems
                  (thanks to Mohannad Amarnh for identifying the issue)
                  Added CSS to hide close button on modal dialog

## Feature Requests and Bugs

If you would like to see additional functionality added to the plugin, or if you have found a bug, please
let us know by emailing support@skillbuilders.com

## License

The SkillBuilders Session Timeout plugin is currently available for use in all personal or commercial
projects under both MIT and GPL licenses. This means that you can choose the license that best suits
your project and use it accordingly. Both licenses have been included with this software.


## Legal Disclaimer

The program(s) and/or file(s) are supplied as is. The author disclaims all warranties, expressed or
implied, including, without limitation, the warranties of merchantability and of fitness for any purpose.
The author assumes no liability for damages, direct or consequential, which may result from the use of
these program(s) and/or file(s).

## Installation and Configuration

#### Installation

With this installation package there is a plugin installation file named:
 - dynamic_action_type_plugin_com_skillbuilders_session_timeout.sql.

Navigate to “Shared Components > Plugins” and click Import >. From there you can follow the menu to
upload and install the plugin using the file above. After the plugin has been installed successfully you
will be redirected to the plugin edit screen. There is a Settings region on the page that allows you to
change how the plugin works (see Settings below).

#### Configuration

Configuration of the session idle time is done via the security settings of the application. Navigate to
“Shared Components > Security” and look for the settings named Maximum Session Idle Time in
Seconds and On session idle time timeout direct to this URL. Set those settings as you would like before
configuring the plugin.

Add page 0 to your application if it doesn’t already exist. Page 0 is unique in that anything added to it is
added to all pages in an application – including Dynamic Actions. Once your application has page 0,
navigate to that page and follow the steps below:
1. Create a new Dynamic Action
  a. Using the Tree View, scroll to the bottom of Page Rendering and right click Dynamic Actions, then left-click
     Create.
  b. Using the Component View, scroll down to the bottom of Page Rendering and left-click the Create button in the Dynamic
     Actions region (looks like a “+”).
2. Select Advanced.
3. Click Next >.
4. Enter any name you would like to use.
5. Click Next >.
6. Set Event to Page Load.
7. Click Next > .
8. Set Action to SkillBuilders Session Timeout (1.0.1)[Plug-in].
9. Click Next >.
10. Click Create.

Note: If your application has popup/modal pages, use the conditions of the Dynamic Action to prevent
the plugin from being includes on those pages as the parent/opening page should be sufficient.

## Settings

##### Application Settings
Application settings are used to configure all instances of a plugin within an application. These settings
are accessed by editing the plugin within the Shared Components. This plug in has the following application settings:

##### Session Timeout Action

Use this setting to control what action the plugin should perform when the user’s idle time expires.

* Alert (default) will display an alert message on the screen when the user’s session expires. After dismissing the alert message, the       user will be redirected to the URL specified in the On session idle time timeout direct to this URL attribute in the security settings of the application.
 If no value has been specified for that attribute then the user will be redirected to the URL defined in the Home Link attribute.

* Redirect will redirect the user to the URL specified in the “On session idle time timeout direct to this URL” attribute in the security settings of the application. If no value has been specified for that attribute then the user will be redirected to the URL defined in the Home Link attribute.

* Logout - will redirect the user to the Logout URL defined in the applications authentication scheme.  If no Logout URL is defined then the following value will be used:
  - apex_authentication.logout?p_app_id=&APP_ID.&p_session_id=&SESSION.

##### Session Timeout Message

Use this setting to configure the messaged displayed to the user when their session expires. This setting will only be available if the
Session Timeout Action is set to Alert.

##### Mask Browser Screen on Timeout

Use this setting to spec if whether or not the contents of the screen should be hidden when the user’s session expires. This setting will only be available if the
Session Timeout Action is set to Alert.

##### Session Idle Warning

Use this setting to choose whether or not the user should receive a warning message prior to their session expiring.

##### Session Idle Title

Use this setting to specify what title should be used for the modal dialog displayed to the user prior to
their session expiring. This setting will only be available if the Session Idle Warning is set to Yes.

##### Session Idle Message

Use this setting to specify what message should be displayed to the user prior to their session expiring.
This setting will only be available if the Session Idle Warning is set to Yes.

##### Show Warning Seconds Before

Use this setting to specify the number of seconds before the user’s session expires that the warning message should be displayed.
This setting will only be available if the Session Idle Warning is set to Yes.

##### Keep Session Alive

Use this setting to specify whether or not the plug - in should keep the user’s session alive on the server side if activity is detected on the client side.

## About SkillBuilders

SkillBuilders is known for excellent IT training and consulting. Our instructors are always industry - tested experts and outstanding teachers who have set an unsurpassed standard of excellence. SkillBuilders' roots can be traced to 1985 when our founder, Dave Anderson, embarked on his career as an independent IT consultant, instructor and author. Dave and his colleagues built a small, energetic and growing company, headquartered in South Kingstown, RI.

### About the Authors

##### Dan McGhan

Dan is a Senior Developer and Instructor with SkillBuilders. He suffers from Compulsive Programing Disorder which is believed to be linked to his balding. Having started his development career in the land of MySQL and PHP, he was only too happy to have stumbled upon APEX. Since then, he’s dedicated his programming efforts to learning more about Oracle and web based technologies in general. 

Dan is an Oracle Application Express Certified Expert, an Oracle PL/SQL Developer Certified Associate, as well as an Oracle ACE. In addition to his "day job", he is one of the top contributors to the APEX forum, maintains his own Oracle and APEX blog, and is a regular presenter at various events and user group meetings including ODTUG Kaleidoscope and APEXposed, the New York, New England, and Suncoast Oracle User Groups. His most recent addiction, as you may have guessed, is developing plugins for APEX. 

When not programming, Dan may be found studying languages other than those used for development, notably Spanish. He’s also been sited at various venues dancing Salsa with his wife, Sonia, and even enjoying an occasional cigar, a time when Sonia prefers not to be around.

##### Tyson Jouglet

Tyson Jouglet is a relatively young techie who went to school wanting to become a Java developer. Despite spending numerous hours learning about Java and how to be a better object oriented programmer, his very first job in the programming world was working with Oracle Application Express (APEX) for a company in San Diego CA. 

He spent a lot of time converting Oracle Forms into APEX, becoming familiar with web application development, and discovering what the Oracle Database can do. Little did he know what he got himself into...
