---
title: "Docker/Balena/Electron/Raspberry Pi Digital Signage"
subtitle: "Building an Environment to Develop and Run an Electron App on a Raspberry Pi 3"
linkTitle:
description:
date: 2019-06-27T18:43:25-07:00
lastmod: 2019-07-24T19:27:04-07:00
tags: [post,balenacloud,electron,js,javascript,raspberrypi,docker,]
draft: false
shareOff:
---

Fair warning: This is a work in progress, and I'm still working out the details for this project.

[Github Repository](https://github.com/uw-it-cte/wiw-events-shifts-display)

I have started to work on getting a digital signage solution set up where I can set up a [Raspberry Pi3][1] to display information on a screen, and that has no local interaction (no UI, running headless without any keyboard/mouse). I wanted a solution to control updates to the app, which is where [BalenaCloud][2] comes in (along with their handy [OS][3] for the Raspberry Pi). I also wanted to figure out a way to develop the app that would display on the screen locally on my Windows machine, and still be able to push the same app to the Raspberry Pi.

The biggest stumbling block or at least the steepest part of the learning curve for this project for me is that I'm deploying several new tools in ways that I've never done before. For one thing, I've never used [Electron][4] to create an app. I've never used Balena or BalenaCloud. And I still don't completely understand [Docker][5] core images and how they're created or how you might go about creating your own. On top of that, the architecture (which?) for a Raspberry Pi is different from the architecture (which?) on a Windows PC, which means that I can't run the same docker image on my PC as I need to run on the Pi, but have to either use a completely different core image with the same resources, or just trust that the Electron app will run the same on both (I haven't worked out all the bugs yet). Another block I had to get through was that most of the examples for running Electron on a Pi3 are about a year or more old, and there's been several updates to multiple components since then, and I want to use the latest versions of all the software if possible. Finally, I had some trouble finding an exact example from someone else that had this exact use case, and so I am taking pieces of lots of examples and putting them together to hopefully end up with a final product that achieves my goals.

## Project Overview!

Briefly, this is what I want this thing to do:

- Connect to an API and load data
    - API is REST-ful
    - API uses tokens for app authentication
    - API token is unrestricted and needs to be secret (it has read/write permission)
- Transform and resolve multiple data aspects through multiple API requests
    - API has endpoints for schedule, users, locations, etc.
- Display data on a screen in a semi-public space
    - Screen is wall-mounted
    - 24x7 uptime
    - 1080p
    - Installation location is in an office, but not monitored, can be accessed any time by any staff
- Refresh data periodically
    - Use cache/local database to avoid excessive API calls
    - Update as often as 5 minutes, or as infrequently as every hour
- Display status info
    - Iconography to display online/offline state, last update time, clock, etc.
- Be graceful with errors
    - What does an API rejection look like vs offline? (use HTTP status codes, probably)
- Allow remote management (BalenaCloud or OpenBalena)
    - Git repository watch
    - CI/CD integration
    - Slack integration
    - Display endpoint remote reboot, shutdown, wipe, etc.

BalenaCloud allows up to ten endpoints (managed display devices) for free. Since this project only needs to support 1 display at the moment, this is perfect. If I end up needing more than ten displays, then I'll probably set up OpenBalena, rather than pay for a cloud plan.

Many of the dockerfile examples from balena / resin.io are kind of out of date, so I'm going to be re-working a dockerfile from scratch. I also am using electron.js v5, which has an [issue][6] with sandboxing the main chrome process that I have found a [workaround][7] (pass Electron executable the `--no-sandbox` option) for, so that's good. I now have a working dockerfile that will build on the pi (or on balenaCloud) and display an electron app. The dockerfile is below.

## Basic Config

### Support tools

Since I'm using balena / balenaCloud, I installed the [balena-cli][8] - I had trouble with getting it working from npm and so I just went with the 'download and extract to a location and add that to your system path' method (standalone zip package) (similar to how I use [Hugo][9]), since I didn't want to use the executable installer for a simple tool like this. Other than that, I'm using Windows 10, [Visual Studio Code][10], and [Postman][11]. Postman is really helpful for exploring and testing the target API service, since it lets me run calls without needing all the code set up first. Typically I use Postman to mock all the example calls I'm going to make to the target API, and then translate those over into code (usually Python, but for this it's in Node, same idea though).

### Dockerfile

```dockerfile
# Specify balena's maintained core image for Raspberry Pi3, Node 10.16, and Ubuntu Bionic
FROM balenalib/raspberrypi3-ubuntu-node:10.16-bionic

# Install necessary modules to support Electron.js runtime, including xorg display and supporting libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
  apt-utils \
  clang \
  xserver-xorg-core \
  xserver-xorg-input-all \
  xserver-xorg-video-fbdev \
  xorg \
  libxcb-image0 \
  libxcb-util1 \
  xdg-utils \
  libdbus-1-dev \
  libgtk2.0-dev \
  libnotify-dev \
  libgnome-keyring-dev \
  libgconf2-dev \
  libasound2-dev \
  libcap-dev \
  libcups2-dev \
  libxtst-dev \
  libxss1 \
  libnss3-dev \
  libsmbclient \
  libssh-4 \
  fbset \
  libexpat-dev && rm -rf /var/lib/apt/lists/*

# Set app working directory
WORKDIR /usr/src/app

# Move package.json to app dir for dependency installation
COPY ./package.json .
RUN npm install && npm cache clean --force && rm -rf /tmp/*

# Copy over app source code
COPY . .
# Systemd
ENV INITSYSTEM on

# set Xorg and FLUXBOX preferences
RUN mkdir ~/.fluxbox
RUN echo "xset s off" > ~?.fluxbox/startup && echo "xserver-command=X -s 0 dpms" >> ~/.fluxbox/startup
# Set xserver to run
RUN echo "#!/bin/bash" > /etc/X11/xinit/xserverrc \
  echo "" >> /etc/X11/xinit/xserverrc \
  echo 'exec /usr/bin/X -s 0 dpms -nocursor -nolisten tcp "$@"' >> /etc/X11/xinit/xserverrc

# Start Electron app using a script
CMD ["bash", "/usr/src/app/start.sh"]
```

## Main

### start.sh

The electron app / executable is started and displayed through the connected screen using the following shell script. This runs in one of the dedicated docker containers running on the Pi3, so similar to running a GUI app on a desktop from within a docker container, you need to tell it how to connect the output visuals to the display.

```shell
#!/bin/bash
export URL_LAUNCHER_NODE=1
export NODE_ENV=production
# By default Docker gives 64MB of shared memory, but to display heavy pages we need more:
umount /dev/shm && mount -t tmpfs shm /dev/shm

# use the locally installed electron module, rather than any that might be installed globally.
# this also gives control to package.json as to which exact version of electron to use.
# Below also sets an X instance with ONLY electronjs running, rather than a full desktop environment
# saving a lot of resources (especially since this is for a headless display without any UI).

rm /tmp/.X0-lock &>/dev/null || true

# Set whether we're using the PI TFT screen, rotation, etc. and start X else, using HDMI output, just start X
if [ ! -c /dev/fb1 ] && [ "TFT" = "1" ]; then
  modprobe spi-bcm2708 || true
  modprobe fbtft_device name=pitft verbose=0 rotate=${TFT_ROTATE:-0} || true
  sleep 1
  mknod /dev/fb1 c $(cat /sys/class/graphics/fb1/dev | tr ':' ' ') || true
  FRAMEBUFFER=/dev/fb1 startx /usr/src/app/node_modules/electron/dist/electron /usr/src/app --enable-logging --no-sandbox
else
  startx /usr/src/app/node_modules/electron/dist/electron /usr/src/app --enable-logging --no-sandbox
```

### Electron App Notes

This app is really basic, since it only connects to one API and blindly presents that information on to a screen - there's no user input to handle, no other cycles beyond updating the screen every minute with new information from the API and perhaps displaying things like the current time. Since it doesn't need to handle a lot of complex items, I'm not including anything exceptional, like a full framework like Vue or React, since these are somewhat overblown for what I need on this project. The most I'm including for presentation is a minified compiled version of [Bootstrap][12].

The trick is scheduling the screen refresh and how it's supposed to handle different states in terms of what the API returns, network status, etc. To handle this I'm implementing a supervisory style main loop that deals with handling the cached data, loads up the environment variables, and reacts to differing application states from the environment (network link up/down/connected, API response codes - such as how to handle a 503 code).

Figuring out where to put these elements (looping to refresh data, handling response codes, etc.) was a little tricky, since I couldn't decide if this should be something in the `renderer.js` file or `main.js`. The answer came from [here (mdn)][13]. I was considering using `setInterval()` to create a never-ending loop, but instead decided to go with a recursive loop that never really ends, but recursively calls `setTimeout()`, with changing values of timeout intervals reacting to changes in app state, such as receiving a non-200 HTML status from the remote API, and using a multiplier on the recursive timeout to wait longer and longer between API requests, in the hopes of eventually receiving a good response again. So normally each data refresh is every 30 seconds. If an API call fails to return or returns a non-200 code, then the next call will wait 60 seconds, then 120 seconds, then 240, and so on. After a successful response, the state returns to a 30-second interval. The idea for this is partially inspired by [Exponential Backoff][14], used in [TCP][15].

#### Renderer.js - Starting up

Starting up the loop for API requests is pretty simple. Once the page is loaded, fire up a couple recursive loops to handle 2 main things: 1.) the clock a the bottom of the screen and 2.) the API data fetch.

```js
function handleReload(interval, initialInterval) {
  // display the active reload interval in the page footer
  const reloadSpan = document.getElementById('reload-interval');
  reloadSpan.innerHTML = `Reloading every ${interval / 1000}s`;
  setTimeout(() => {
    getSchedule().then((result) => {
      if (result.status === 200) {
        const target = document.getElementById('content');
        target.innerHTML = markupResults(result.data).join(''); // markupResults returns an array of HTML elements
        handleReload(initialInterval, initialInterval); // resets interval to initial state
      } else {
        // didn't receive a 200 code :( wait a bit longer before trying next time
        handleReload(interval * 2, initialInterval);
      }
    });
  }, interval);
}

function showClock() {
  setTimeout(() => {
    const target = document.getElementById('clock-row');
    target.innerHTML = markupClock();
    showClock();
  }, 1000);
}

window.onload = () => {
  const initialInterval = 30000; // milliseconds - TODO: make this an Environment Variable
  handleReload(initialInterval, initialInterval);
  showClock();
};
```

As soon as the page on the electron app has finished its initial load, the `window.onload` handler starts both recursive loops. This process continues indefinitely.

### Deployment

1. Set up the Raspberry Pi on the BalenaCloud dashboard, download and flash the BalenaOS image to the microSD card that will run the Pi.
2. Update application- or device-level environment variables. These will allow devices in production to access the API using the key provided through the environment variables. This also allows a unified and quick location to update the key should it be changed or compromised. Note: updating environment variables will cause endpoint devices to reboot.
3. Push the code in the repository to Balena using the balena-cli - this will use the project's Dockerfile to build the application image and then distribute it to all devices assigned to the application on the BalenaCloud Dashboard.
4. Wait for the code to download onto the target device(s) and begin running.

## Local Development

Runs fine with `npm start` which will run a local electron session, loading the code and opening a window on the desktop. Using dotenv, environment variables stored in a `.env` file will be loaded into the main process. When deployed via balena, these environment variables will not be loaded from the .env file (which should contain and store secrets that are not committed to source control) but from the environment variables loaded into the balena console (which are pushed down to target devices within scope).

The .env file should contain API keys and any other things specific to this particular implementation that might change over time, but that wouldn't require any kind of code change / recompilation of the docker image.

[1]: https://www.raspberrypi.org/products/raspberry-pi-3-model-b-plus/
[2]: https://www.balena.io/
[3]: https://www.balena.io/os/
[4]: https://electronjs.org/
[5]: https://www.docker.com/
[6]: https://github.com/electron/electron/issues/17972
[7]: https://github.com/electron/electron/issues/17972#issuecomment-503647871
[8]: https://github.com/balena-io/balena-cli
[9]: https://gohugo.io/
[10]: https://code.visualstudio.com/
[11]: https://www.getpostman.com/
[12]: https://
[13]: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval#Ensure_that_execution_duration_is_shorter_than_interval_frequency
[14]: https://en.wikipedia.org/wiki/Exponential_backoff
[15]: https://en.wikipedia.org/wiki/Transmission_Control_Protocol
