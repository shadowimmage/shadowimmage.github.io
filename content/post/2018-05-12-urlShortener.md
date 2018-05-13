---
title: "Url Shortener Microservice"
subtitle: "FreeCodeCamp Backend Challenge 3"
linkTitle: "urlshortenerms"
description: ""
date: 2018-05-12T18:13:23-07:00
publishDate: 
tags: [sample, freecodecamp, javascript, mongodb, demo]
keywords: [code, freecodecamp, javascript, mongodb, js]
type: "post"
draft: false
---

## Description

The challenge here was to create a URL Shortener microservice. It uses a database to associate a short url ID with the original url, and once created, the microservice will redirect visitors of the short URL to the original URL.

<!--more-->

Example creation input:

- https://fcc-challenges.herokuapp.com/shortener/new/https://www.google.com
- https://fcc-challenges.herokuapp.com/shortener/new/http://foo.com:80

Example creation output:

```JSON
{
  "original_url":"http://foo.com:80",
  "short_url":"https://fcc-challenges.herokuapp.com/shortener/8170"
}
```

Usage:

- `https://fcc-challenges.herokuapp.com/shortener/2871`

Will redirect to:

- `https://www.google.com/`

## Demo

View this code live on Heroku at fcc-challenges.herokuapp.com/shortener/...

- URL Creation: [new/https://www.google.com][2]
- Retrieval: [2871][3]

## Code

### [<button style="background-color:Black" type="button" class="btn btn-primary">View on GitHub&nbsp;&nbsp;<span style="vertical-align:middle"><i class="fab fa-github"></i></span></button>][1]

#### Shortener

```javascript
// URL Shortener (part1) - Short URL Creator
exports.new = function (req, res) {
  var resData = {
    original_url: 'invalid URL',
    short_url: null
  }
  resData.short_url = req.hostname + '/shortener/'
  // console.log(req.url)
  var url = req.url.slice(5)
  // console.log(req.url.slice(5))
  if (validUrl.isUri(url)) {

    resData.original_url = url
    var collection = req.app.dbConn.getDB().collection(shortUrlCollection)
    var lastDoc = collection.find().sort({ index: -1 }).limit(1)
    lastDoc.project({_id: 0, index: 1}).toArray(function (err, documents) {
      if (err) console.error(err)
      var insertIndex = 1
      if (documents.length > 0) {
        // console.log(documents[0].index);
        insertIndex += documents[0].index
      }
      collection.insertOne({
        index: insertIndex,
        url: resData.original_url
      }, function(err, r) {
        if (err) console.error(err)
        resData.short_url += insertIndex
        res.json(resData)
      })
    })
  } else { //end valid url section
    res.json(resData)
  }
}
```

#### Resolver

```javascript
// URL Shortener (part 2) - Short URL resolver/redirector
exports.getId = function (req, res) {
  if (req.params.id) {
    var collection = req.app.dbConn.getDB().collection(shortUrlCollection)
    var shortDestDoc = collection.find({
      index: parseInt(req.params.id)
    }).project({
      _id: 0,
      url: 1
    }).toArray(function (err, documents) {
      if (err) console.error(err)

      if (documents.length > 0) {
        res.redirect(documents[0].url)
      } else {
        res.end('Invalid short URL id.')
      }
    })
  } else {
    res.end(JSON.stringify({'error':'invalid URL'}))
  }
}
```

[1]: https://github.com/shadowimmage/fcc-backend-challenges/blob/master/controllers/shortener/index.js
[2]: https://fcc-challenges.herokuapp.com/shortener/new/https://www.google.com
[3]: https://fcc-challenges.herokuapp.com/shortener/2871
