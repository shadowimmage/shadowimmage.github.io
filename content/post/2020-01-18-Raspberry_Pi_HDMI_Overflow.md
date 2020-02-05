---
title: "Raspberry Pi HDMI Overscan"
subtitle: "Getting settings right for a Rappberry Pi outputting to a 4k display (and others)"
linkTitle:
description:
date: 2020-01-18T13:04:13-08:00
lastmod:
tags: [post,balena,raspberrypi,short,note]
draft: false
shareOff: false
---

I had a problem when I moved my Raspberry Pi over to using a 4K display, which is just about the only resolution that professional displays come in these days, as manufacturers have all moved on to 4K as a standard. The problem was with overscanning and the display not having the ability to correctly scale the image signal coming from the Raspberry Pi, which was still a 1920x1080 signal.

There's a collection of settings in `config.txt` on the Raspberry Pi that can mitigate this problem:

- disable_overscan
- overscan_left
- overscan_right
- overscan_top
- overscan_bottom

For me, I deleted all the explicit overscan settings, and enabled the `disable_overscan` setting. 

Here's my fixed up `config.txt`:

```ini
enable_uart=1
disable_overscan=1
disable_splash=1
dtparam=i2c_arm=on
dtparam=spi=on
dtparam=audio=on
gpu_mem=32
```

More settings and info can be found here: <https://www.opentechguides.com/how-to/article/raspberry-pi/28/raspi-display-setting.html>
