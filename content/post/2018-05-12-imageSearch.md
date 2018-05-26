---
title: "Image Search Abstraction Layer"
subtitle: "FreeCodeCamp Backend Challenge 4"
linkTitle: "imagesearchms"
description: ""
date: 2018-05-12T18:50:14-07:00
publishDate: 
tags: [sample, freecodecamp, javascript, mongodb, demo]
keywords: [code, freecodecamp, javascript, mongodb, js]
type: "post"
draft: true
---

This microservice creates an abstraction layer (and history) between the user and the Google Images search API.

<!--more-->

### User Stories

- User Story: I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
- User Story: I can paginate through the responses by adding a ?offset=2 parameter to the URL.
- User Story: I can get a list of the most recently submitted search strings.

## Code

### [<button style="background-color:Black" type="button" class="btn btn-primary">View on GitHub&nbsp;&nbsp;<span style="vertical-align:middle"><i class="fab fa-github button-icon"></i></span></button>][1]

```javascript
const https = require('https')
const imgSearchCollection = 'imgSearches'

// Challenge 4 - Image Search Abstraction Layer (search)
exports.query = function (req, res) {
  const resultsPerQuery = 10
  var localData = {
    searchTerm: '',
    pagination: 1,
  }
  if (!req.params.q) {
    res.json({'error': 'search query required'})
  } else {
    if (req.query.offset) {
      var offset_tmp = Number(req.query.offset)
      if (!isNaN(offset_tmp)) {
        localData.pagination = offset_tmp
      }
    }
    localData.searchTerm = req.params.q
    var options = {
      host: 'www.googleapis.com',
      port: 443,
      path: '/customsearch/v1?',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    options.path += 'searchType=image'
    options.path += '&safe=medium'
    options.path += '&fields=kind,items(title,link,snippet,image/contextLink,image/thumbnailLink)'
    options.path += '&key=' + process.env.G_SEARCH_API_KEY
    options.path += '&cx=' + process.env.G_CSE_ID
    options.path += '&q=' + localData.searchTerm
    options.path += '&start=' + Math.max(localData.pagination * resultsPerQuery, 1)

    const imgReq = https.request(options, function(imgRes) {
      var output = ''
      imgRes.setEncoding('utf8')

      imgRes.on('data', function (chunk) {
        output += chunk
      })

      imgRes.on('end', function () {
        localData.imgJSON = JSON.parse(output)

        var collection = req.app.dbConn.getDB().collection(imgSearchCollection)
        var lastDoc = collection.find().sort({ index: -1 }).limit(1)
        lastDoc.project({_id: 0, index: 1}).toArray(function (err, documents) {
          if (err) console.error(err)

          var insertIndex = 1
          if (documents.length > 0) {
            insertIndex += documents[0].index
          }

          collection.insertOne({
            index: insertIndex,
            query: localData.searchTerm
          }, function(err, r) {
            if (err) console.error(err)
            res.json(localData)
          })
        })
      })
    })

    imgReq.on('error', function (err) {
      res.send('error: ' + err.message)
    })

    imgReq.end()
  }
}

// Challenge 4 - Image Search Abstraction Layer (recent searches)
exports.latest = function (req, res) {
  var collection = req.app.dbConn.getDB().collection(imgSearchCollection)
  var lastSearches = collection.find().sort({ index: -1 }).limit(10)
  lastSearches.project({ _id: 0, query: 1 }).toArray(function (err, documents) {
    if (err) console.error(err.message)
    res.json(documents)
  })
}
```

## Demo

View this code live on Heroku, usage:

Search for images by replacing {query} with your query, and paginate through results with {page}.

- https://fcc-challenges.herokuapp.com/api/imagesearch/q/{query}?offset={page}

Show recent queries at the endpoint:

- [https://fcc-challenges.herokuapp.com/api/imagesearch/latest][2]

[1]: https://github.com/shadowimmage/fcc-backend-challenges/blob/master/controllers/api/api_challenges/imagesearch.js
[2]: https://fcc-challenges.herokuapp.com/api/imagesearch/latest
