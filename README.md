# SkillBuilders Session Timeout Plugin For APEX
For a while now APEX has had a `Maximum Session Idle Time in Seconds` attribute in the Security Settings of an application. As one might imagine, this setting allows developers to kill a user’s session if the user has been idle for a certain amount of time. The problem, however, is that the implementation of this feature is purely server side (which is good from a security perspective).


Usually when this type of functionality is added to a site, say a bank’s web site, there’s some client side behavior added in addition to the server side behavior. This client side functionality may let a user know that their session has expired or even warn a user before it does. The SkillBuilders Session Timeout plug-in adds this type of client side behavior to APEX applications quickly and easily.

## Features at a Glance

- Configurable [timeout actions](#session-timeout-action) including alert, redirect, and logout


- Optional and configurable warning message
- Option to keep session alive if user isn’t truly idle. Special thanks to Martin D’Souza for a great idea on how to implement this feature.

## Version History

- **1.0.0 - 02/21/2012:** Initial release
- **1.0.1 - 03/17/2012:** Fixed bug that raised “ORA-01008: not all variables bound” exception on some systems
- **1.3.0 - 08/11/2017:** Added 5.1 compatability                  

## Installation and Configuration

#### Installation

Install the plugin file: `dynamic_action_type_plugin_com_skillbuilders_session_timeout.sql`

Navigate to **Shared Components > Plugins** and click **Import >**. From there you can follow the menu to upload and install the plugin using the file above. After the plugin has been installed successfully you will be redirected to the plugin edit screen. There is a Settings region on the page that allows you to change how the plugin works (see Settings below).

#### Configuration

Configuration of the session idle time is done via the security settings of the application. Navigate to **Shared Components > Security Attributes** and look for `Maximum Session Idle Time in Seconds` and `Session Idle Timeout URL`. Set those settings as you would like before configuring the plugin.

Add a `Global Page` to your application if it doesn’t already exist. `A Global Page` is unique in that anything added to it is added to all pages in an application – including Dynamic Actions. Navigate to the `Global Page` and follow the steps below:

1. Create a new Dynamic Action
1. Enter any name you would like to use e.g. Idle Session Handler
1. Set Event to `Page Load`
1. Add a true action `SkillBuilders Session Timeout[Plug-in]`
1. Add the server side condition PL/SQL Expression: `apex_page.get_page_mode(:APP_ID,:APP_PAGE_ID) = 'NORMAL'`. This prevents the dynamic action from being added to modal or popup pages.


## Settings

##### Application Settings
Application settings are used to configure all instances of a plugin within an application. These settings are accessed by editing the plugin within the Shared Components. This plug in has the following application settings:

##### Session Timeout Action

Use this setting to control what action the plugin should perform when the user’s idle time expires.

* **Alert (default)** - will display an alert message on the screen when the user’s session expires. After dismissing the alert message, the user will be redirected to the URL specified in the `Session Idle Timeout URL` attribute in the security settings of the application.
 If no value has been specified for that attribute then the user will be redirected to the URL defined in the `Home Link` attribute.

* **Redirect** - will redirect the user to the URL specified in the `Session Idle Timeout URL` attribute in the security settings of the application. If no value has been specified for that attribute then the user will be redirected to the URL defined in the `Home Link` attribute.

* **Logout** - will redirect the user to the `Logout URL` defined in the applications authentication scheme.  If no Logout URL is defined then the following value will be used: `apex_authentication.logout?p_app_id=&APP_ID.&p_session_id=&SESSION.`

##### Session Timeout Message

Use this setting to configure the messaged displayed to the user when their session expires. This setting will only be available if the Session Timeout Action is set to Alert.

##### Mask Browser Screen on Timeout

Use this setting to spec if whether or not the contents of the screen should be hidden when the user’s session expires. This setting will only be available if the Session Timeout Action is set to Alert.

##### Session Idle Warning

Use this setting to choose whether or not the user should receive a warning message prior to their session expiring.

##### Session Idle Title

Use this setting to specify what title should be used for the modal dialog displayed to the user prior to their session expiring. This setting will only be available if the Session Idle Warning is set to Yes.

##### Session Idle Message

Use this setting to specify what message should be displayed to the user prior to their session expiring. This setting will only be available if the Session Idle Warning is set to Yes.

##### Show Warning Seconds Before

Use this setting to specify the number of seconds before the user’s session expires that the warning message should be displayed. This setting will only be available if the Session Idle Warning is set to Yes.

##### Keep Session Alive

If their is any client side activity then the server will be notified and the current timeout duration will be reset. Use this if you would like to periodically refresh the users session without needing to submit the page

## License
MIT © [SkillBuilders](http://skillbuilders.com)
