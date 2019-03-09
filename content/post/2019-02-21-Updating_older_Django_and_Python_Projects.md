---
title: "Maintaining Older Django and Python Projects"
subtitle: "Notes on Legacy Software Maintenance and Building Workable Environments"
linkTitle:
description:
date: 2019-02-21T09:26:35-08:00
lastmod: 2019-03-09T12:34:56-08:00
tags: [post,django,python,virtualenv,]
draft: false
shareOff:
---

I have been working on the backend for a project that I've written about {{previously--link}}. The established tools server that will be supporting my new React frontend app(s) will be using a backend built on Python 2.7 and Django 1.11, and thus I've had to remember how to get a development environment set up that will appropriately support the project running locally on my machine. I have a personal site that runs on the same version of Django, but with Python 3.6 as the underlying code base. Having used these tools previously, I decided that it was time to bump my personal Django instance up to something more modern and learn what it would take to get my apps-demos server (available at chase-sawyer-demos.herokuapp.com) up to Django 2.1 with Python 3.7 backing it up. I also wanted to keep some notes here on what the experience has been like setting up a legacy development environment from scratch after not having worked on a project for some time or picking up someone else's project.

Below are some of my notes and experiences on having gone through this process.

## The Work Environment and Long File Names

I had a further complication with this project in that some of the dependencies required were projects maintained by other groups here, were clearly developed on a MacOS or Linux environment as the file names and directories for files within these projects were too long for Windows to handle. This meant that I could not successfully clone the codebase on to my usual development computer (Windows 10 based). I dug through some documentation for Windows that stated that it can _technically_ support longer than 260 or so characters, and that the NTFS filesystem has no technical reason to restrict these files from existing. However, many programs and utilities baked into Windows still use the maximum path length limit (like explorer.exe - the Windows file manager). I decided that instead of trying to hack Windows into working so that I could get a working copy of the backend server that I am using to host the API and database connections for this project, I could just use a VM. I am already using Hyper-V as part of having Docker running on my dev environment, and Hyper-V has a nearly-one-click solution to installing an Ubuntu 18.04 LTS VM on Windows, so I set that up as my designated Python 2.7 + Django 1.11 development instance so that I could handle the long paths required for this project to run successfully.

Having set up an Ubuntu 18.04 LTS VM on my main Windows machine, I installed git, vscode, and virtualenv for Python, along with Python27 for Ubuntu so that I could get a working virtual environment set up for this project before I cloned in the existing backend project with all it's dependencies and get things up and running before starting my new backend app within that framework.

But then I remembered something - Django is built around app reusability and so I went back to my app structure and moved it out into a super basic from-scratch Django project which allows me to work on any machine to build the app, without any dependence on the existing older project structure. This approach uses Django 1.11 to match the work environment's Django version, but uses the Python 3.7 version that I have installed on most all of my development machines - this shouldn't be too problematic, as Django 1.11 supports Python 3 and I have been taking steps to ensure that the coding I'm doing is Python 2 and 3 compatible. I'll edit here if this turns out to be a bad idea.