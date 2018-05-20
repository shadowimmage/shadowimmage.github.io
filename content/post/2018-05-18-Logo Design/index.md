---
title: "Logo Design"
subtitle: "Designing and implementing a new logo"
linkTitle:
description:
date: 2018-05-18T14:45:08-07:00
lastmod: 2018-05-19
tags: [post, hugo, update]
draft: false
shareOff:
---

I spent my sick day today designing a new logo for the site using Inkscape. I knew that it had to be something that was unique, so I went online looking around for resources on designing and producing a logo. I know that SVGs are great, because you will never have scaling issues - if you need a larger version, you can simply export it at higher resolution. Or lower. Or whatever. I found some sites for inspiration as well, since I couldn't think of exactly what I was going for initially.

The new design: ![monogram](images/logo100x100.png)

[logobook.com][1] has been really helpful in looking at what kinds of designs you can do with different features or lettering and [Logo Design Love][2] was really helpful in getting my head into a good space for designing a logo. Other than that, the first few iterations of designs were just pen-and-paper drawings in my notebook.

## Tools

Designing a vector graphic is relatively easy if you have a vector graphic editing program. I have known about [Inkscape][3] for a while, and this is what I ultimately used. Another tool I found while looking around for vector graphic tools is a browser-based (or downloadable) tool called [Vectr][4]. I didn't use Vectr much, but it looks useful if you need really simple tools and don't want to get something as heavyweight as Inkscape. That being said, using Inkscape and it's exceptional grid and guide snapping tools really made designing this logo easy.

## Getting it online

In order to fully implement use of the logo, there's several modifications that I had to make, including converting the .svg file to an .ico or .png format that would be browser friendly. Modern browsers support .svg files for page graphics, but most still don't support the format in the favicon space. Only Internet Explorer _requires_ the format be a .ico for the favicon, and most support .png, but in different levels of quality, depending on the browser and age, and if it's a mobile or a desktop browser (not to mention things like consoles with browsers baked in). I didn't know any of that information starting out though, and instead got a good amount of information from [this stackoverflow question][5].

### Changes to Head

```html
<!-- new favicon -->
  <link rel="apple-touch-icon" sizes="180x180" href="{{ "img/apple-touch-icon.png" | absURL }}">
  <link rel="icon" type="image/png" sizes="32x32" href="{{ "img/favicon-32x32.png" | absURL }}">
  <link rel="icon" type="image/png" sizes="16x16" href="{{ "img/favicon-16x16.png" | absURL }}">
  <link rel="manifest" href="{{ "img/site.webmanifest" | absURL }}">
  <link rel="mask-icon" href="{{ "img/safari-pinned-tab.svg" | absURL }}" color="#5bbad5">
  <meta name="msapplication-TileColor" content="#da532c">
  <meta name="theme-color" content="#ffffff">
<!-- end favicon -->
```

This required some minor modifications to the Hugo theme that I've been building off of by changing part of the navbar to include the new monogram svg. Getting the sizing just right required some custom css, which also had to be included in the html head. I also changed the Hugo params in the config file to reflect that the avatar is an avatar, not an icon, and instead use the icon parameter for the file location of the monogram. 

### Changes to Nav

```diff
<div class="navbar-header">
+  <a href="{{ "" | absLangURL }}">
+    <img class="navbar-brand" id="site-logo" src="{{ .Site.Params.logo | absURL }}" alt="{{ .Site.Title }}" />
+  </a>
  <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#main-navbar">
    <span class="sr-only">{{ i18n "toggleNavigation" }}</span>
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
  </button>
  <a class="navbar-brand" href="{{ "" | absLangURL }}">{{ .Site.Title }}</a>
</div>
```

[1]: http://www.logobook.com/
[2]: https://www.logodesignlove.com/
[3]: https://inkscape.org/
[4]: https://vectr.com/
[5]: https://stackoverflow.com/questions/2268204/favicon-dimensions#23734416