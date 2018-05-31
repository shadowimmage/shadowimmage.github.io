---
title: "KeysApp"
subtitle: "A Solution for Tracking Brass Keys"
date: 2018-05-30T10:01:41-07:00
lastMod: 2018-05-30T10:01:41-07:00
publishDate: 
tags: [project, demo, django, python, postgresql, ]
keywords: [project, django, python, postgresql, sql, form, static]
type: "post"
draft: true
---

The Keys App was my first major project that sought to solve a problem with managing key checkouts without requiring a cumbersome customer database / sign up form. This would target an institution that mostly catered to internal customers, such as a university's AV department and it's instructors. It largely replicates a paper-form-based system, with an added layer of data validation and control (emails, phone numbers must be in a valid format; keys can only be returned by their original owners; keys can't be checked out twice; etc.). Each checkout and check-in is recorded and tracked. All changes in the database leave a history.

This project was built entirely upon Django, with some Bootstrap for front-end styling. The app runs as a multi-part form with several steps and each is validated before progress is allowed. The backend leverages the built-in Django admin console and allows navigating and editing all records in the system, while also maintaining data integrity.

## Database Schema

[To come]

## Demo

Hosted on Heroku: <https://chase-sawyer-demos.herokuapp.com/keysApp/>

{{< figure src="images/site-demo.gif" >}}