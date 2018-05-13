---
title: "New Site Structure"
date: 2018-05-09T22:19:41-07:00
tags: [post, update]
lastmod: 2018-05-11
draft: true
shareOff: true
---
I took some time this week to look into all the code that I've been collecting and producing over the last year or more and began to assess where everything was being stored and hosted. Since I build a lot of demos and try out new technologies on a pretty consistent (if not sporadic) basis, this has led me to a state where I have several projects hosted on Heroku, on AWS, and offline. So I've been looking for an efficient way to bring all these projects, ideas, code samples, demos, etc into one central hub or site.

With the redesign of _this_ site, I have the opportunity to collect and organize everything together in a much more cohesive format that will hopefully be easy to navigate for visitors and myself. I'm hoping that this can effectively become something of a portfolio as well as a digital notebook that I can maintain and grow.

# Structure

Proposed structure for the site arrangement and layout:

- Profile / home page (<https://shadowimmage.github.io>)
    - Projects/Ideas
        - MyApps (Heroku: App Demos)
            - keysApp
            - rttApp
        - Work stuff
            - SlackR25Bot
    - Samples
        - FreeCodeCamp challenges, etc (Heroku: fcc-challenges)
    - About Me
        - Traditional Resume (?)
        - Contact info
            - social contact links (footer)
    - Architecture notes as a separate section (?)

Aside:

> Turns out that [blackfriday](https://github.com/russross/blackfriday), the markdown engine for Hugo has a [bug (#329)](https://github.com/russross/blackfriday/issues/329) in nested lists that requires 4 space indentation per level, rather than the usual 2 that most other markdown engines use. This threw me off for a long time until I was able to track down the issue.
> ~~I'm beginning to think that I need to write up a 'gotchas' page for Hugo~~
> [Here is the gotchas page]({{< relref "post/2018-05-10-Hugo Gotchas.md" >}})

## :weary:
