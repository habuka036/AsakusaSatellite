as_localauth_plugin
===================

A authentication plugin with a local file for AsakusaSatellite.

Setup
----------------

1. Edit <AS_ROOT>/config/settings.yml

    login_link : http://localhost:3000/localauth/login

2. Edit <PLUGIN_ROOT>/config/users.yml

    testuser1:
      screen_name: Test User1
      password: b444ac06613fc8d63795be9ad0beaf55011936ac
      profile_image_url: http://example.com/test1_user.png

'password' field is a SHA-1 string.
You can get the string by following command.

    $ ruby <PLUGIN_ROOT>/script/gen_sha1 <password>

3. Restart AsakusaSatellite

4. Click 'Login' link and input 'testuser1' - 'test1' for example.

