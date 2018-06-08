---
title: "Exercise Tracker Full-Stack App"
subtitle: "Free Code Camp (v2) APIs Challenge 4"
linkTitle: "exerciseTracker"
description: "Project for Free Code Camp - Build a full stack web application for "
date: 2018-06-08T18:20:43-07:00
publishDate: 
tags: [sample, javascript, freecodecamp, mongodb, express, pug]
keywords: [code, mongo, mongodb, nosql, freecodecamp, js, javascript, express, pug]
type: "post"
draft: false
---

This project involved setting up a couple MongoDB collections and then building a responsive frontend for user interaction. This app allows adding users by name, then using that user's ID to add activities. The API allows for querying for user activities by user ID as well.

The UI uses a pug template and bootstrap for most styling, and some custom css rules to fine tune elements.

This was actually the first project that I completed out of the new Free Code Camp curriculum, and replaced the previous Google Image Search Abstraction project that I had already completed previously.

<!--more-->

## Code

### [<button style="background-color:Black" type="button" class="btn btn-primary">View on GitHub&nbsp;&nbsp;<span style="vertical-align:middle"><i class="fab fa-github"></i></span></button>][1]

```javascript
const mongoObjectId = require('mongodb').ObjectID

const trackerCollection = 'exerciseTracker'
const trackerUserCollection = 'exerciseTrackerUsers'

// Challenge 4v2 - Exercise Tracker - UI page
exports.uiPage = function (req, res) {
  res.render('exercise/index')
}

exports.addUser = function (req, res) {
  // lookup username; insert and return ID if not taken; otherwise return error message.
  const collection = req.app.dbConn.getDB().collection(trackerUserCollection)
  const lookup = collection.find({
    username: req.body.username
  }).toArray(function (err, documents) {
    if (err) {
      console.log(err)
      res.status(500).send('Unable to complete action.')
    } else {
      if (documents.length > 0) { // username was found
        res.status(400).send('Username \'' + req.body.username + '\' already taken.')
      } else {
        collection.insertOne({'username': req.body.username}, function (err, result) {
          if (err) {
            console.log(err)
            res.status(500).send('500 server error; unable to save username.')
          } else {
            res.json({
              'username': req.body.username,
              '_id': result.insertedId
            })
          }
        })
      }
    }
  })
}

exports.addActivity = function (req, res) {
  // given the userID, activity description, duration, and optionally, date
  // look up the userID - if it exists, enter a new data entry about the activity to the database
  // if the user id doesn't exist, respond with a 400 user not found message
  var dateEpoch = new Date().getTime()
  if (req.body.date) {
    dateEpoch = new Date(req.body.date).getTime()
  }
  const collection = req.app.dbConn.getDB().collection(trackerUserCollection)
  const lookup = collection.find({
    '_id': mongoObjectId(req.body.userId)
  }).toArray(function (err, documents) {
    if (err) {
      console.log(err)
      res.status(500).send('Unable to complete action.')
    } else {
      if (documents.length > 0) { // user found
        const updateCollection = req.app.dbConn.getDB().collection(trackerCollection)
        const update = updateCollection.insertOne({
          userId: documents[0]._id,
          description: req.body.description,
          duration: req.body.duration,
          date: dateEpoch
        }, function (err, result) {
          if (err) {
            console.log(err)
            res.status(500).send('500 server error: unable to add entry.')
          } else { // save successful
            res.json({
              'username': documents[0].username,
              'description': req.body.description,
              'duration': req.body.duration,
              '_id': documents[0]._id,
              'date': new Date(dateEpoch).toDateString()
            })
          }
        })
      } else {
        res.status(400).send('Unable to locate userID: ' + req.body.userId)
      }
    }
  })
}

exports.getUserLog = function (req, res) {
  // return user exercise data given the user's id.
  // Check for optional parameters and validate them:
  var opts = {from: null, to: null, limit: 0}
  var queryParams = {
    'userId': mongoObjectId(req.query.userId)
  }
  if (req.query.from && req.query.to) {
    if (!isNaN(Date.parse(req.query.from)) && !isNaN(Date.parse(req.query.to))) {
      queryParams['date'] = { 
        $gte: Date.parse(req.query.from), 
        $lte: Date.parse(req.query.to)
      }
    }
  } else if (req.query.to) {
    if (!isNaN(Date.parse(req.query.to))) {
      queryParams['date'] = { $lte: Date.parse(req.query.to) }
    }
  } else if (req.query.from) {
    if (!isNaN(Date.parse(req.query.from))) {
      queryParams['date'] = { $gte: Date.parse(req.query.from) }
    }
  }
  if (req.query.limit && !isNaN(req.query.limit)) {
    opts.limit = Math.ceil(Math.abs(req.query.limit))
  }
  if (!req.query.userId) {
    res.status(400).send('Must query for an ID.')
  } else {
    const usersDb = req.app.dbConn.getDB().collection(trackerUserCollection)
    const activitiesDb = req.app.dbConn.getDB().collection(trackerCollection)
    const lookupUser = usersDb.find({
      '_id': mongoObjectId(req.query.userId)
    }).toArray(function (err, userDocs) {
      if (err) {
        console.log(err)
        res.status(500).send('Unable to query user.')
      } else {
        if (userDocs.length > 0) { // user found, can find their stuff.
          
          var activitiesCursor = activitiesDb.find(queryParams)
          if (opts.limit) {
            activitiesCursor = activitiesCursor.sort('date', 1).limit(opts.limit)
          }
          activitiesCursor.toArray(function (err, activitiesDocs) {
            if (err) {
              console.log(err)
              res.status(500).send('Unable to query user activities.')
            } else {
              var resData = {
                _id: req.query.userId,
                username: userDocs[0].username,
                count: activitiesDocs.length,
                logData: []
              }
              for (var i = 0; i < activitiesDocs.length; i++) {
                resData.logData.push({
                  'description': activitiesDocs[i].description,
                  'duration': activitiesDocs[i].duration,
                  'date': new Date(activitiesDocs[i].date).toDateString()
                })
              }
              res.json(resData)
            }
          })
        } else {
          res.status(400).send('Unable to locate userID: ' + req.query.userId)
        }
      }
    })
  }
}
```

## Demo

View this code live here: <https://fcc-challenges.herokuapp.com/exerciseTracker/>

[1]: https://github.com/shadowimmage/fcc-backend-challenges/blob/master/controllers/api/api_challenges/exercise.js