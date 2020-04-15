---
title: "Django API Apps on Windows IIS"
subtitle: "How to set up Windows Server IIS to serve Django 3.0.3(+) and Python 3.8"
linkTitle:
description:
date: 2020-03-03T18:43:27-08:00
lastmod: 2020-04-13T17:45:39-08:00
tags: [post,iis,django,python,windows,tutorial]
draft: false
shareOff: false
toc: true
---

This is a guide on setting up Python/Django apps to run on a Windows server using IIS as the webserver. I'll go over the specifics below. We're starting things off with the following assumptions:

1. Windows Server is installed somewhere and running with a static IP and domain name all set.
2. Server SSL Certificate has already been provisioned and set up. (Optional but extremely recommended to run HTTPS)
3. (not specifically necessary) any SSO setup/shibboleth stuff has already been set up. (This is if you want to leverage SSO login, etc.)
4. Everything is running 64-bit architecture.

<!--more-->

## Python

Install the latest Python version using the GUI Windows x64 installer downloaded from the [python.org][1]. As of writing, the latest version available is 3.8.2.

Make the following settings changes to the Python installation (we're going for a minimal installation with just the Python core and a few niceties):

1. Check option for "Add Python 3.8 to PATH"
2. Click "Customize Installation"
3. *Deselect* all options except pip.
4. click Next
5. Check "Install for all users"
6. Deselect "Create shortcuts for installed applications"
7. Check "Add Python to environment variables"
8. Check "Precompile standard library" (not specifically necessary, but doesn't hurt anything)
9. NO "debugging symbols" or "debug binaries" (this is supposed to be a prod environment, after all)
10. Change the Installation directory: `C:\Python38\`
11. Install.

### Virtualenv

Once Python's installation is complete open an **administrative** terminal/Powershell window (`winkey`+`x`, `a`) and complete the following:

>Note: If any of the following commands come back with something like "command not found" double-check that `C:\Python38\` and `C:\Python38\Scripts\` are in the system PATH environment variable (run `$Env:Path` in powershell). If you had the terminal window before installing Python, close and re-open it. Or just add the Python directories to the system PATH manually.

1. upgrade pip

> `python -m pip install --upgrade pip`

2. install virtualenv

> `pip install virtualenv`

## IIS Setup / Prerequisites

IIS needs to be installed, with the CGI option. Once that is installed there should be a directory `C:\inetpub\wwwroot\`

### Method 1

1. Open "Windows Features" (search for "Windows Features" > "Turn Windows Features on or off" should be the result or Run (`winkey`+`r`) > `optionalfeatures.exe` -- If that doesn't do anything, try Method 2 Below.
2. Select IIS feature, with the additional options highlighted as in the below image.
    - CGI
    - HTTP Redirection
    - Request Monitor
3. OK

{{< figure src="images/IIS_min_components.png" title="Windows Features" alt="Selected IIS features in Windows Features dialog" width="60%" caption="options may vary, features available may vary, etc. etc." >}}

### Method 2

1. Open the Server Manager
2. Click "Manage"
3. Click "Add Roles and Features"
4. Go through the wizard and ensure that all the features listed in Method 1 are selected, specifically IIS services and especially CGI, HTTP Redirection, and Request Monitor. The items are the same as above in Method 1, but are organized a little differently.

{{< figure src="images/serverManagerAddRoles.png" title="Server Manager Screenshot" alt="Opening Server Manager and Adding Roles or Features" caption="Select Manage, then Add Roles and Features, then the wizard shown at 3️⃣ should show" >}}

### Test

Finally, test that the IIS server installation worked and that you can browse to `http://localhost` on a browser, and that you get the default IIS page.

## Set Up Django Application Directory and Virtual Environment for Python

Here's where we set up the application folder that will host our Django application and all the required Python libraries to support that application without installing anything globally. This will make sure that if there's any other Python apps that need to run on the server or be served by the server, there won't be dependency version conflicts.

1. Create an application folder to host your application. I wanted my app to be served from `<webserver_root_url>/app` so I put my application folder at `c:\inetpub\wwwroot\app\`. **NOTE** this does not necessarily *have* to be in your inetpub/wwwroot folder, it's just a bit easier to do it this way.
2. Open an elevated console within the `\app` directory (typically will need to be elevated to do things in this directory because security stuff)
3. Create a virtual environment with virtualenv

> `> virtualenv venv`

4. This should create a directory called "venv" in `\app\`.
5. Activate the virtual environment so that any Python or Pip commands work against it instead of the global Python environment.

> `> .\venv\Scripts\activate`

6. Copy in your Django application, including your requirements.txt file.
7. Install python dependencies from requirements:

> `> pip install -r requirements.txt`

8. We'll need the latest wfastcgi python package too (in case it's not in your requirements, since it's not needed to run the development server):

> `pip install wfastcgi`

**Note:** if you run into problems with wfastcgi not working, or are getting errors like "the fastcgi process exited unexpectedly" then try to force wfastcgi to upgrade:

> `pip install wfastcgi --upgrade`

## Set Up Django Site in IIS

IIS has specific requirements around how a site is set up, in order for it to work properly. Specifically, each site must have at least 1 application and each application must have at least 1 virtual directory. [This page][10] from Microsoft Docs has detailed information on the requirements for a site to publish correctly on IIS.

1. Open IIS manager (`winkey`+r) Run > `inetmgr`
2. Select the Server and from the main page, double-click "FastCGI Settings"
3. "Add Application"
4. Fill out the settings dialog accordingly:
    - "Full Path": Where your virtual environment's `python.exe` lives (such as `C:\inetpub\wwwroot\app\venv\Scripts\python.exe`)
    - "Arguments": path to `wfastcgi.py` which should also be in the virtual environment directory: `C:\inetpub\wwwroot\app\venv\Lib\site-packages\wfastcgi.py`
    - In the "**FastCGI Settings**" section, under "**General > Environment Variables**" click on the "(Collection)" line, then on the little ellipsis ("[...]") button, which will allow entering Environment Variables specific to the runtime environment that Django will be running in when a request comes into the web server.
      - In the "**EnvironmentVariables Collection Editor**" window:
      - Add: Name: `DJANGO_SETTINGS_MODULE` Value: *whatever matches up to your setting in `wsgi.py`.* For me this was `server.environment`
      - Add: Name: `PYTHONPATH` Value: `C:\inetpub\wwwroot\app`
      - Add: Name: `WSGI_HANDLER` Value: `django.core.wsgi.get_wsgi_application()`
      - **If you want WSGI Logging:** Add: Name: `WSGI_LOG` Value: *wherever you want logs to be written.* I put: `C:\inetpub\logs\WSGI\app.log` (this file can get verbose, consider removing this once you've made sure the application is working well)
          - **⚠ WARNING - READ THIS ⚠**: You must make sure that the local server's worker processes have write permission on this file or it's directory. If you do not, wfastcgi/python will crash out and IIS will throw 500 server errors. I spent days fighting with this. The easiest fix is to manually create the file `C:\inetpub\logs\WSGI\app.log` and then edit the security permissions on that file, granting full write permission to the local server group "`IIS_IUSRS`".

This should correctly set up the environment for FastCGI to be able to run the Django application (assuming that the paths above match to where you're working from). **Note (1):** For `DJANGO_SETTINGS_MODULE` I used `server.environment` - this matches my environment, since I have `/app/server/environment.py` and `environment.py` lists out which server settings should be loaded. **Note (2):** All of the above settings for Environment Variables are case sensitive.

5. Close the Environment Variables window and the FastCGI Settings windows.
6. On the left-hand pane of IIS Manager, under "connections" where the server we're working on, expand the server, and under "**Default Web Site**", there should be a listing of directories that are in `wwwroot\`. Here, we'll convert `\app\` into an application (right-click on the directory, then select "convert to application") - Click OK on the "Add Application" window that pops up.
7. Open Handler Mappings for the application
8. Click "**Add module mapping**" and enter the following settings:
    - Path: `*`
    - Module (dropdown): "**FastCgiModule**"
    - Executable: **type in:** `C:\inetpub\wwwroot\app\venv\Scripts\python.exe|C:\inetpub\wwwroot\app\venv\Lib\site-packages\wfastcgi.py`
    - Name: "Django Handler" or "Python FastCGI handler" or whatever - it's just a friendly name for the mapping.
    - Click "**Request Restrictions**"
      - **Deselect** "Invoke handler only if... mapped to:"
      - Verbs: All verbs
      - Access: Script
    - Click OK
    - Click OK
    - When a popup asks "Do you want to create a FastCGI Application for this executable?" click "No" as that has already been handled / set up.
9. The handler should now show in the list of Handler Mappings.
10. Click "**View Ordered List...**" on the right, and move the newly created handler to the top of the list. This will ensure that the python handler is the first one considered for all requests to this application.

Restart your IIS website and it should now be working where the Django application should be reachable at `http://localhost/app/` (assuming your Django site has a page listed there).

> IIS restart commands:\
> `> iisreset /stop`\
> `> net start e3svc`

## Configure Django and IIS Static Files

The Django development server automatically handles serving static files when working on your computer, but now that it's in a production environment, we need to collect the static files to a directory and then tell IIS to serve them from that directory. Most details on serving static files, as well as handling additional details should be found on Django's documentation site: [static files deployment][2].

### Settings

Django's settings need to be modified to include the options `STATIC_ROOT` and `STATIC_URL`.

`STATIC_ROOT` is used to tell Django's `collectstatic` command where in the filesystem to place the found static files. This location could, in theory, be anywhere on the filesystem, but it's good practice to keep these files in a location that makes sense in terms of compartmentalization and context. I put my files inside the project folder next to `manage.py`.

```py
# settings.py or prod.py or wherever your production settings may be...
STATIC_ROOT = '/inetpub/wwwroot/app/static/' # Windows - assumes C as root; don't have to explicitly say "C:"
STATIC_URL = '/app/static/'
```

### Move Files

Run the `collectstatic` management command from the project directory.

Activate the virtualenv:

> `.\venv\scripts\activate`

Run the command:

> `python manage.py collectstatic`

Say "yes" to the prompt from the `collectstatic` management command to confirm the directory you want to copy static files to.

### Set Up a Virtual Directory for IIS to Serve the Static Files

IIS needs to know where these files are located and how to serve them up when browsers request them. THe name of a virtual directory **must match** the value of the `STATIC_URL` setting in Django's `settings.py`, absent the beginning and trailing slashes. For this sample, the url is `app/static`.

1. Open IIS Manager
2. On the left pane, under “Connections" expand the server’s tree
3. Expand the “Sites” folder
4. Right-Click the web site your app lives in (for me, I put everything in "default web site")
5. Click "Add Virtual Directory"
6. Enter the following values:

> Alias: static\
> Physical Path: C:\inetpub\wwwroot\app\static

{{< figure src="images/snip-static-virtual-dir.png" title="static virtual directory in IIS" alt="static directory in the IIS directory tree" caption="Your \"static\" folder should now have a shortcut-looking icon on it, as shown here.">}}

#### Configure Handler Mappings for Static Files

1. Select the "static" virtual directory
2. Open "Handler Mappings"
3. On the right side, select "View Ordered List..."
4. Move the "StaticFile" handler to the top of the list by selecting it, then on the right under "Actions" click "Move Up" until the handler is above all others. If IIS warns you about diverging from inheriting settings, click OK - this is what we want to do.

At this point Django app(s) should be available and serving from IIS at /app or /app/admin from your webserver, with all the static assets and CSS loaded properly. If not, go back over the Static Files settings, and make sure that the static assets collected by `collectstatic` correctly found and placed all the files you're relying on in the correct location.

## Shibboleth / SSO / Remote-User

### IIS / Shibboleth

The Shibboleth service needs to be installed and configured on the webserver. Once installed and configured, the path to the API / App / Site must be listed in shibboleth's configuration file `Shibboleth2.xml`. By default this file can be found in `C:\opt\shibboleth-sp\etc\shibboleth\`.

### Django Configuration

A few things need to be added to middleware and authentication backends to enable use of the remote user environment variable set by shibboleth in IIS for purposes of authenticating users to Django / Apps.

In `prod.py` (or wherever production settings are stored, like `settings.py`) add the following to allow reading of `REMOTE_USER` from the request:

```py
MIDDLEWARE = MIDDLEWARE + [
    # ADDDED REMOTE USER MIDDLEWARE FOR SHIBBOLETH AUTH
    'django.contrib.auth.middleware.PersistentRemoteUserMiddleware',
]

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.RemoteUserBackend',
    'django.contrib.auth.backends.ModelBackend', #Fallback
]
```

Note that in this case `PersistentRemoteUserMiddleware` is appended to the **end** of the `MIDDLEWARE` list, which is imported from `base.py`. If your configuration has other middleware that depends on specific ordering, then this solution may not be optimal for all cases.

There are also two flavors of Remote User Middleware - the generic and the `.Persistent...` variety. For more details on use see [Authenticating using REMOTE_USER][3].

## Thanks and Resources

Below is a listing of all the tabs I had open for reference when figuring this out and writing this.

- Microsoft Docs: [How to Use HTTP Detailed Errors in IIS][4]
- Stack Overflow: [python.exe the fastcgi process exited unexpectedly][5]
- DigitalOcean community: [How to Deploy Python WSGI Applications Using uWSGI Web Server with Nginx][6]
- Microsoft Docs: [Configure Python web apps for IIS][7]
- Django Documentation: [How Django processes a request][8]
- Nitin Nain: [Setting up Django on Windows IIS Server][9]
- Microsoft Docs: [About Sites, Applications, and Virtual Directories in IIS 7 and Above][10]

---
[1]: https://www.python.org/downloads/release/python-382/
[2]: https://docs.djangoproject.com/en/dev/howto/static-files/deployment/
[3]: https://docs.djangoproject.com/en/dev/howto/auth-remote-user/
[4]: https://docs.microsoft.com/en-us/iis/troubleshoot/diagnosing-http-errors/how-to-use-http-detailed-errors-in-iis
[5]: https://stackoverflow.com/questions/42742324/python-exe-the-fastcgi-process-exited-unexpectedly
[6]: https://www.digitalocean.com/community/tutorials/how-to-deploy-python-wsgi-applications-using-uwsgi-web-server-with-nginx
[7]: https://docs.microsoft.com/en-us/visualstudio/python/configure-web-apps-for-iis-windows?view=vs-2019
[8]: https://docs.djangoproject.com/en/3.0/topics/http/urls/#how-django-processes-a-request
[9]: https://nitinnain.com/setting-up-and-running-django-on-windows-iis-server/
[10]: https://docs.microsoft.com/en-us/iis/get-started/planning-your-iis-architecture/understanding-sites-applications-and-virtual-directories-on-iis#about-sites-applications-and-virtual-directories-in-iis-7-and-above
