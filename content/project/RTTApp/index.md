---
title: "RTTApp"
subtitle: "A Solution for Tracking Repair Tasks"
date: 2018-05-30T10:06:45-07:00
lastMod: 2018-05-30T10:06:45-07:00
publishDate: 
tags: [project, python, heroku, vue, javascript, postgresql, graphene, apollo, graphql]
keywords: [project, python, heroku, vue, vuejs, vue.js, javascript, js, postgres, postgresql, sql, graphene, apollo]
type: "post"
draft: false
---

## Repair Task Tracker

RTT is a full stack app that addresses the needs of a computer hardware management process, allowing the tracking and resolution of issues/problems with the hardware, as well as  the configuration and components of each major hardware item. RTT is meant to be a back-of-house tool, replacing paper tickets and spreadsheets. The goal of this project was to implement a GraphQL app, with useful data, allowing a seamless user experience as they operate through the app, and data is downloaded and uploaded in the background.

### Developement Status

This project is ongoing development. Progress details are in the project [readme][1].

## Technologies

RTT is a single-page-app built in Vue.js and served from a Python/Django server running within a Heroku dyno (server instance). The data records are stored in a PostgreSQL database, retrieved with a GraphQL implementation using Apollo and Graphene.

## Demo

The backend database schema has been completed; the frontend is still under development. The latest snapshot is live on [heroku][2].

{{< gallery >}}
{{< figure src="images/issues.png" caption="Display of all open issues in the database" >}}
{{< figure src="images/IssueDetail.png" caption="Detail page and update fields for selected issue" >}}
{{< /gallery >}}

[1]: https://github.com/shadowimmage/django-server-apps#development-info---rttapp
[2]: https://chase-sawyer-demos.herokuapp.com/rttApp/