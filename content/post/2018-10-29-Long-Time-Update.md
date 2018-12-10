---
title: "Long Time Update; New Projects"
subtitle:
linkTitle:
description: "A significantly overdue update"
date: 2018-10-20T19:06:53-07:00
lastmod: 2018-12-09T16:26:45-07:00
tags: [post, update, uw, cloud]
draft: false
shareOff: true
---

> Author's Note: this post has taken a long time to get written - so long, that I already have my 2018 Hactoberfest t-shirt and stickers! It's content spans mid-October through December. I've done my best to make it a cohesive whole.

<!--more-->

Happy Hacktoberfest! This has been the second year that I've participated, and I'm looking forward to getting my t-shirt and stickers when they're available from DigitalOcean. Really briefly, here's a list of things that I've been working on and doing in the last few months since my last update.

I've started working through the project prompts on The Odin Project - Still finding it difficult to stick with these self-directed learning sites. The advantage I think that The Odin Project has over Free Code Camp is that their projects are more easily shown off to other people. So far I've managed a couple project solutions without having to set up anything other than the GitHub repository where my fork's code lives. The project code is all served from GitHub pages by having a `gh-pages` branch pointing to the desired live version of the page project.

The following have been completed:

- [etch-a-sketch](https://shadowimmage.github.io/odin-project_etch-a-sketch/)
- [Rock-Paper-Scissors](https://shadowimmage.github.io/odin_project-Rock-Paper-Scissors/)

I'll admit, it's not a terribly impressive list. But in my defense, work has come up with a way to keep me thoroughly engaged by giving me the capacity to pitch, prioritize, and execute upon projects of my own to improve processes and practices. What this has boiled down to is:

- 4 projects pitched in August/September
- 4 approved projects
- 1 active project in early development / preparation stage (described below)
- 3 projects scheduled / prioritized for execution following active project
- 1 developer (me)

Given the constraint of me as Project Manager, Lead Developer, and Architect, I've been pretty busy taking on one of the heaviest lifts I've ever engaged in professionally: bring a year-old React app up to date, with a database backend (from scratch), and analytics/live dashboards. You might think that this seems pretty easy, so let me explain further the current state-of-affairs.

## The Active Project

The react app is served statically from a generic managed LAMP server, which I have no access to. The server's resources are behind the UW's NetID authentication, but the actual React site has nothing to do with this, you simply must be authenticated in order to load the app at all.

There is no backend in any sense that I've ever thought of as a "backend". It's Google Sheets. All of it. Dynamic elements of the React site are all fields set up in various tabs of a single Google Sheets spreadsheet. Changing values in particular cells of the spreadsheet change the values displayed in the React app. The React app then uses those values to modify forms and dynamically change so that users can submit information about classroom checks (problems and details about them, or everything is fine). This information populates a "form responses" tab in that same spreadsheet, which then is checked by a formula in another tab, and that subsequently updates the React app.

What black magic makes all this data go around without collapsing? [Firebase][1]. And [Google Apps Scripts][2].

So Google Apps Scripts allow you to use Javascript to modify Google Docs, Sheets, etc. with custom functions and the like (such as macros). These scripts _(can)_ have triggers, which can be time based (I'd say, [cron][3]-adjacent) or based on actions that happen with the associated Google Sheet or Doc. Firebase is a no-sql document object store with some really fancy real-time update functionality built into their libraries that provide some attractive quality-of-life features to app developers - specifically, updates to date in Firebase are automagically synced to all online clients, and any offline changes from clients are cached locally and later synced when that client goes back online.

In our case, Google Sheets holds all the data, any change to any part of the document triggers an Apps Scripts function that uploads all te watched cells to Firebase. Those changes are live-synced to any clients watching (clients being those with the main React app loaded). These triggers are dependent on user interaction. The opposite direction data-flow (the React app to Google Sheets) is _not_ realtime. Or not quite. Form data filled out in the React app is uploaded to Firebase into a sort-of update queue. This is where data lives until cleared out by another Apps Script attached to this Google Sheet. This function has a time-based trigger that runs as often as Google allows: every minute of every day forever. Each minute (or so), this script checks the Firebase database ('queue') to see if there's been a change to the queue, and if so, it pulls that data and populates a new row of the form responses tab, then clears that data from the Firebase queue, which causes another update to Firebase, because that new incoming data changed the Sheets, which means the Firebase data needs updating, which will cause an update to any listening React clients.

It sounds complicated, and it is. Learning how everything was put together in the first place took some time to learn, and then maintaining it is another battle entirely. The whole apparatus depends on triggers associated with the Google Apps Scripts, which are directly attached to their relevant Google Apps document.

Some more background: Google Apps scripts can be either standalone, or they can be attached to a document. If they are standalone, then they exist and behave much like other Google documents or spreadsheets (they show up like another ). They are little files that exist somewhere. If they are attached to a document, then those scripts do not actually have any independent identity. They are intrinsically linked to whatever document that they were created in. This means that they are not easily found for shared documents, like the ones that we are dealing with here. They also have a peculiar association with other Google Cloud applications and functions, in that they appear to be projects, and have similar properties, but you cannot see the engine or virtual machine they run within, nor are they cloud functions per se, and their API usage doesn't necessarily show up in the Cloud Console. (This could just be my misunderstanding how these things work, but this has been my observation thus far). To edit scripts, you need to find them in the [Google Apps Scripts developers console (G Suite Developer Hub)][0], or by first finding the document that they're attached to and then opening that document's scripts.

Now, about those [triggers][4]: until very recently there was no way (that I could find) to find the triggers associated with a **shared** document/spreadsheet attached apps script, unless you were the user that created that trigger. Now in the last couple of weeks (since November 20th or so) they allow other users that can see the shared document/script to see that there _are_ triggers, but not who that user is or a whole lot of detail about the trigger parameters. (YMMV - this is taken from the perspective of a user within an organization (the UW) where documents are shared amongst many users (within one of our Team Drives)). When I first began ~~looking into~~ taking over this project, I couldn't see any triggers attached to any of the functions that were associated with our master Google spreadsheet, so to me, it was clear that these functions were happening, but I couldn't see _how_. This led to a failure for our crew one night, since (for reasons unknown) the magical invisible triggers just _stopped working_. Now, this probably wasn't the case, but since I could never see the triggers responsible for all the data moving back and forth, I _also_ couldn't see that they weren't there or if they were broken in some other way. I had anticipated this, and the resolution was just to re-create these triggers under my own UW Google account.

Going forward, this is fine, but it brings me back to another fundamental flaw in this kind of system: Transitioning these resources over to a new team member/user. Triggers can't be moved/transferred/shared/etc. And similarly Scripts that are associated within a Googel Doc or Sheet are intrinsically tied to it. They can't move away from that document, and if that document is deleted, then the Script associated with it goes too. Making your scripts separately from your G Suite applications seems like a wise decision from the outset, but that wasn't immediately clear when these scripts were initially made. Of course copy-paste makes moving their content to local files or to independent Scripts on Google would ostensibly be a valid way of breaking this interdependency, it's still no Git. And of course today I used this very functionality to create two Slack Custom Integrations that run within this script framework with daily triggers to create some automated notifications for staff. These scripts are trivial so I feel no particular attachment to making sure they don't disappear suddenly, but on the other hand, for something more mission-critical, it's more concerning.

Long term I'm going to work out a way of potentially deploying these Apps Scripts programmatically, so that they can live somewhere else and be deployed through some kind of automated system? (looking at you [Github Actions][5]...)

### Ongoing Development

Ok, so here's a small list of the things that need to happen (completely out of order, some already completed): Write a project charter, and try to anticipate the speed at which decisions will be made within a bureaucratic government organization during the holiday season). Update Create-React-App (and React), all their dependencies, the Google Firebase library, and any other utility libraries. Audit the list of packages in `package.json` and determine what can stay and what is extraneous. Add eslint and settle on some rules to bring some order to the code base. Update React components to be more modular - break out what needs separation, cull redundancy, and prepare the app that is using Firebase as it's backend ready to switch over to a SQL database for a backend. Build out the architecture of the SQL database. Build an API between the database and the app. Build a Tableau dashboard and report set that pull from the SQL database. Build in Business Logic everywhere to ensure the core data in the SQL database is and remains valid into the future. Clean up and transition legacy data over to the SQL Database. Decide on what flavor of Database to have in the first place. Figure out how to get the app to be integrated into the UW NetID (Shibboleth) SSO, and use information about the users to control what users can and cannot do, including who can manage data in the SQL database (via a manager view within the app). Build a manager interface within the app.

It's an ambitious project, but one that I feel like I have all the pieces for, and the actual plumbing of all the parts and figuring out how they all go together is the most fun and enjoyable part of all of this.

[0]: https://script.google.com/
[1]: https://firebase.google.com/
[2]: https://developers.google.com/apps-script/
[3]: https://en.wikipedia.org/wiki/Cron
[4]: https://developers.google.com/apps-script/guides/triggers/
[5]: https://github.com/features/actions