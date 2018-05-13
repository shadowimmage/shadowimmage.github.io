---
title: "Timestamp Microservice"
subtitle: "FreeCodeCamp Backend Challenge 1"
linkTitle: "timestampms"
description: "Coding Sample"
date: 2018-05-12
publishDate: 2018-05-10
tags: [post, sample, freecodecamp, demo]
keywords: [code, freecodecamp, javascript, js]
type: "post"
draft: false
---

## Description

The goal is to create a microservice that will take a date string or a unix timestamp and make a JSON response with both versions of the given timestamp / date.

<!--more-->

## Code

### [<button style="background-color:Black" type="button" class="btn btn-primary">View on GitHub&nbsp;&nbsp;<span style="vertical-align:middle"><i class="fab fa-github"></i></span></button>][1]

```javascript
// timestamp.js
// Challenge 1 - Timestamp conversion UNIX <--> Standard

exports.convert = function (req, res) {
  var timestamp = req.params.timestamp
  var resData = {
    unix: null,
    natural: null
  }
  if (!timestamp) {
    res.json(resData)
  } else {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    if (isNaN(parseInt(timestamp))) {
      // is a string
      var date = new Date(timestamp)
      resData.natural = months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear()
      resData.unix = Math.floor(date.getTime() / 1000)
    } else {
      // is a number (expect unix time)
      var unixDate = new Date(timestamp * 1000)
      resData.natural = months[unixDate.getUTCMonth()] + ' ' + unixDate.getUTCDate() + ', ' + unixDate.getUTCFullYear()
      resData.unix = timestamp
    }
    res.json(resData)
  }
}
```

## Demo

View this code live on Heroku at fcc-challenges.herokuapp.com/...

- Unix-style input: [api/timestamp/1450137600][2]
- Timestamp input: [api/timestamp/December%2015,%202015][3]

[1]: https://github.com/shadowimmage/fcc-backend-challenges/blob/master/controllers/api/api_challenges/timestamp.js
[2]: https://fcc-challenges.herokuapp.com/api/timestamp/1450137600
[3]: https://fcc-challenges.herokuapp.com/api/timestamp/December%2015,%202015
