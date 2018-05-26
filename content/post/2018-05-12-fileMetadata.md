---
title: "File Metadata Microservice"
subtitle: "FreeCodeCamp Backend Challenge 5"
linkTitle: "filemetadatams"
description: ""
date: 2018-05-12T19:05:29-07:00
publishDate: 
tags: [sample, freecodecamp, javascript, demo]
keywords: [code, freecodecamp, javascript, js]
type: "post"
draft: false
---

Full-stack microservice (really basic frontend in Pug/HTML) that takes a FormData object from a file upload form and returns the file size in bytes as part of a JSON response.

<!--more-->

### User Stories

- I can submit a FormData object that includes a file upload
- When I submit something, I will receive the file size in bytes within the JSON response

## Code

### [<button style="background-color:Black" type="button" class="btn btn-primary">View on GitHub&nbsp;&nbsp;<span style="vertical-align:middle"><i class="fab fa-github button-icon"></i></span></button>][1]

```javascript
// upload page
exports.upload = function (req, res) {
  res.render('filesize/upload')
}

// File Metadata Microservice - file upload result
exports.result =  function (req, res) {
  res.json({
    'filename': req.file.originalname,
    'size': req.file.size
  })
}
```

## Demo

View this code live on [Heroku][2]

[1]: https://github.com/shadowimmage/fcc-backend-challenges/blob/master/controllers/api/api_challenges/filesize.js
[2]: https://fcc-challenges.herokuapp.com/api/filesize/upload