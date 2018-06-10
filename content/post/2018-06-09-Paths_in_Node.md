---
title: "File Paths in Node"
subtitle: "How Path Resolution Can Be Confusing"
linkTitle: 
description: "relative vesus absolute paths and how to understand them"
date: 2018-06-09T18:52:55-07:00
lastmod:
tags: [post, blog, express, javascript, node, filesystem, debugging]
draft: false
shareOff: false
---

This week I had an interesting discussion with another new developer who was getting started working on an Express-based project and was frustrated by their static files working one day, and seemingly without provocation, not working the next. I knew from experiencing the same feeling when dealing with static files both in Django and Express that a static file loading problem is difficult to resolve, and how often the problem is often a simple one that is nonetheless opaque to a new developer unfamiliar with filesystems and path resolution.

When static file loaders can't or don't load something, it's often not called  out as an error because when you tell the computer where the static files are, it doesn't make any assumptions about the contents there. And later on when you're trying to load your custom CSS or images and getting nothing loaded, and quiet browser 404 errors for the resource, but not the page overall, the result can be a maddening series of digging into documentation that doesn't often make clear the particulars of path names and how a single dot or slash can make all the difference in the world between success and failure.

## File Paths

A path to a file on a computer, and to an extent, a path to a resource on the internet looks like this: `/rootDirectory/subDirectory/file` with the `file` part usually having some kind of type after a dot, such as `.txt` or `.exe`. For Windows users, the beginning will have a drive letter at the beginning, most commonly C: `C:\\rootDirectory\\subDirectory\\file`.

What happened to me, and I'm sure has happened to others - such as the individual I was talking to this week - is that nothing in the documentation about static paths goes deeply into path resolution. I guess it's just kind of assumed that you as the developer in control of things should know what's happening in the background, but many do not.

### Path Resolution

When you give Express.js (Node) a path to load, it's generally going to be in a _relative_ format. The documentation gives the most basic setup as something like `app.use(express.static('public'))`. The mechanics behind this statement are a bit more complicated than it might seem at first glance.

When you give Node a path such as `'public'`, a function goes through and makes a best guess as to where you mean to point it. Why doesn't it just _know_ that you mean the folder called 'public' (or 'static' or 'img' or whatever)? Because Node needs the _absolute_ path on the file system to that directory, and thus the files and folders inside. And this function is pretty lenient about what it will accept in terms of file paths, and will assume that you know what you're doing.

So, what is the difference between `'public'`, `'/public'`, and `'./public'`?

The first and the last actually resolve to the same destination: _relative_ to the current working directory, find a directory called 'public' and serve the contents as static files. However, the second example resolves to something else entirely: find a directory called 'public' at the _root_ of the file system. Or more explicitly: instead of resolving to `/rootDirectory/subDirectory/project/public/` it will resolve to `/public/`. Or in Windows,  `C:\\public\\`

When path.js (in Node) runs through resolve() for a given path name, there's this comment in the function:

```javascript
/* Lines 201 - 206 of path.js */
  if (code === 47/*/*/ || code === 92/*\*/) {
    // Possible UNC root

    // If we started with a separator, we know we at least have an
    // absolute path of some kind (UNC or otherwise)
    isAbsolute = true;
```

Which if you walk through debugger with the above three options, it becomes clear that the middle option `'/public'` will resolve to an _absolute_ path, rather than a relative path to the current directory where you're working, and that will make all the difference in the world.

Now, if you do want to give an absolute path from the root of the drive you're working on, then you have a way of doing that by starting the path off with a '/' -  otherwise you'll need to use relative paths with either a './' or just the folder/file you're looking for without anything else.

I hope that this helps someone out there understand file paths and relieves some frustration around what `app.use(express.static('public'))` actually means.