---
title: "Car Maintenance App"
subtitle:
linkTitle:
description:
date: 2019-07-25T09:11:41-07:00
lastmod: 2019-10-31T16:36:00-07:00
tags: [post,project,heroku,django,app,dev,]
draft: false
shareOff: false
---

New app in progress! Hopefully it won't take months to complete. Should be pretty simple. Especially since this app is going to be primarily for me - and I'm not going to worry too too much about the UI elements. Thinking this is going to be primarily a django based app with templates and model-based views like the [keys app][1].

Current State: Developing database models

## Purpose

Provide myself and whoever wants it a place to track their car maintenance, and to make sure that they know when the next scheduled service for a particular maintenance item is due. For example, say you have a vehicle who's differential fluid needs to be checked every 60000 miles, this app would let you enter a Maintenance Item of "differential" with an interval of 60000(miles). Then the app can use the last service record relevant to the differential, the mileage of that service, and the current mileage to determine if the differential service or inspection is due.

### Schema

- Cars
    - Manufacturer
    - Model
    - Year
- Maintenance Items \[MI\]
    - (FK/multiple) Car
    - Item
        - Title
        - Mileage Interval (opt)
        - Time Interval (opt)
    - Interval Type
        - ? Time : Mileage : Both
    - Service Type (Replace or Inspect)
- Maintenance Record \[MR\]
    - (FK) Car
    - (FK) Maintenance Item
    - Current Mileage (as of service date)
    - Service Date (timestamp)
- Regular Checks
    - (FK) Car
    - Current Mileage
    - Fuel Economy (estimate?)
    - Oil Level
    - Comments

### Setting up a new vehicle

To set up a new vehicle, we'd enter a new manufacturer and model, then go into the maintenance items table and add all the various items that need to be checked and/or replaced.

#### Intervals

Business logic will check to make sure that either a date or a mileage interval is selected and that the interval type selection matches (time, mileage, or 'both'). When analyzing a vehicle for service items due, the logic can use the setting in Maintenance Items to determine - based on most recent Maintenance Records, the current date, and most recent Regular Check (for non-service mileage) - whether or not service for that particular item is due (or due soon?).

---
[1]: http://chase-sawyer-demos.herokuapp.com/keysApp/
