---
title: "New Static Site with Hugo"
date: 2018-05-09T20:51:48-07:00
draft: false
tags: [post, Hugo, update]
---
Built a new site, leaving Jekyll for Hugo, for my github.io page.

# Changes

Moved all my old Jekyll files to a new subdirectory in order to maintain access to the old code and posts, and then transition all the content over to the main Hugo site as settings come together. One major advantage of Hugo is that the build process is super fast, so I've been looking at how to integrate CircleCI with Hugo builds. Fortunately the CircleCI engineering blog has a post on how to get set up doing automated builds via CircleCI.

## CircleCI

One of the caveats of using Github Pages for hosting my static content is that I have to have the site content in the _master_ branch. I had already branched my project to start working with Hugo to the _hugo_ branch, with the intent that this branch would eventually merge back with _master_. After reading a bit more about how Hugo works, it seems that the _hugo_ branch is going to be a permanent feature, with _master_ being overwritten with the content of the /public output from the Hugo build process. The _hugo_ branch will remain indefinitely as the new default branch on the site repository.

On the other hand, this will work out fine, as it will let me ser CircleCI up to pull the current _hugo_ branch when updated, and then upon successful build, will be able to push the resulting build back up to the repository's _master_ branch. This automated build process is perfect for what I'm hoping to achieve, and will let me get more experience with CircleCI, which I haven't touched in months!