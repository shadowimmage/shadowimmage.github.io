---
title: "Request Header Parser Microservice"
subtitle: "FreeCodeCamp Backend Challenge 2"
linkTitle: "headerparserms"
description: ""
date: 2018-05-12T17:55:20-07:00
publishDate: 
tags: [sample, javascript, freecodecamp, demo]
keywords: [code, javascript, freecodecamp]
type: "post"
draft: false
---

The goal for this one is to get return to the user the IP address, language, and operating system of the browser/user making the request.

<!--more-->

## Code

### [<button style="background-color:Black" type="button" class="btn btn-primary">View on GitHub&nbsp;&nbsp;<span style="vertical-align:middle"><i class="fab fa-github button-icon"></i></span></button>][1]

```javascript
// whoami.js
// FreeCodeCamp // Backend Challenge 2 - Get requesting client IP Address
exports.who = function (req, res) {
  var resData = {
    ipaddress: null,
    language: null,
    software: null
  }
  resData.ipaddress = req.ip
  if (req.header('accept-language')) {
    resData.language = req.header('accept-language').split(',')[0]
  }
  if (req.header('user-agent')) {
    var userAgent = req.header('user-agent')
    var lParenIndex = userAgent.indexOf('(')
    var rParenIndex = userAgent.indexOf(')')
    if (lParenIndex > -1 && rParenIndex > -1) {
      resData.software = userAgent.substr(lParenIndex+1, rParenIndex-lParenIndex)
    }
  }

  res.json(resData)
}

```

## Demo

View this code live on Heroku at [fcc-challenges.herokuapp.com/api/whoami][2]

[1]: https://github.com/shadowimmage/fcc-backend-challenges/blob/master/controllers/api/api_challenges/whoami.js
[2]: https://fcc-challenges.herokuapp.com/api/whoami
