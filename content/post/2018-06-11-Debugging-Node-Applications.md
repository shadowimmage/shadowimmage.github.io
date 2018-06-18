---
title: "Debugging Node Applications"
subtitle: "With or Without an IDE"
linkTitle:
description:
date: 2018-06-11T13:04:19-07:00
lastmod: 2018-06-17
tags: [post, blog, node, javascript, debugging]
draft: false
shareOff:
---

When developing an application or project with Node.js, debugging is an important aspect to getting to the bottom of issues. If you use an IDE (integrated development environment) or code editor that has built-in or supported debugging capacities, such as Visual Studio Code, then you have that ability already. But if you are someone who's developing with a more basic code editor - such as Sublime Text, then you can still debug your Node.js application, using Chrome Developer Tools as your debugger, as if you were debugging a live website.

### Background - Node Debugging

Node creates a server and runs your application. When debugging, you need a client to talk to the server to tell it when to stop execution, catch errors, and  to set/catch breakpoints in the code. This is called an inspector client, and that interface is what is presented to you in the Chrome Developer Tools as well as when using the debugger mode in IDEs.

## Set up

For this, you can use any Node server app. We'll be launching the app from the command line, and then open up Chrome and connect to the running Node server, which will be running in debug mode. Initiating the app in this way, it won't actually begin execution until the inspector client (Chrome) connects to Node server.

### Start Node in Debug mode

If you normally start your Node project server with something like 

```shell
node app.js
```

Open a terminal in your Node project folder, and start it with the command

```shell
node --inspect-brk app.js
```

You should then be greeted with a message like this:

```
Debugger listening on ws://127.0.0.1:9229/9b3ec4f2-b590-4372-b34c-1s4affc3a345
For help see https://nodejs.org/en/docs/inspector
```

Then open chrome to the address `chrome://inspect`

From here, you should see your Node instance listed, including the file path to the app that's running. Click the "inspect" link below the file directory shown, and Chrome DevTools will open up. In the console, you should now see 

```
Debugger attached.
```

At this point, your code still hasn't actually begun running yet. DevTools has attached to the Node debugging instance, and has frozen your code at the very beginning of app.js. DevTools will now let you explore your code, and insert breakpoints - places where you want code to halt - before it starts executing your code.

From here you can begin to debug your code to your heart's content, and dig into pesky bugs that might be plaguing you. Using an interactive debugger is also very useful for catching the state of your app when it crashes (runs into an exception) as the debugger will halt at that point, and you can inspect the state of your variables and dig deeper into what may have gone wrong to cause the exception.

For a more in-depth guide on debugging and how to navigate Chrome's DevTools, check out the links below:

- https://developers.google.com/web/tools/chrome-devtools/
- https://nodejs.org/en/docs/guides/debugging-getting-started/

For VS Code:

- https://code.visualstudio.com/Docs/editor/debugging

As a side note, most modern browsers have debugging tools, and they all behave pretty similarly, with the exception of mobile browsers - mobile browsers (to my knowledge) don't come with the ability to debug the code running on them. But if you are debugging a mobile page, then you can run a page as if in a mobile browser from within Chrome or Firefox by opening the DevTools and entering Responsive Design mode. Check out https://developer.mozilla.org/en-US/docs/Tools/Responsive_Design_Mode for Mozilla's implementation of this tool, and how it can be helpful in quickly testing your site's reaction to small screens.