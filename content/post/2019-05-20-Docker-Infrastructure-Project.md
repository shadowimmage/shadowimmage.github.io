---
title: "Docker Infrastructure Project"
subtitle: "Part one of [some number] of posts implementing a docker service architecture"
linkTitle:
description:
date: 2019-05-20T10:41:23-07:00
lastmod:
tags: [post,docker,django,python,infrastructure,]
draft: false
shareOff: false
---

I'm building a web infrastructure project that's based around the project [verbose-equals-true][0] (referred to as VET from now on), which sets out to create a set of services to support modern web apps, using several Docker based images to collect everything into separate concerns. I like the philosophy behind the project, and it looks well thought out, however, as things are always changing in this landscape and nobody has the same development environment, there's always going to be stumbling blocks. It's also my goal to use this other project as more of a framework or set of guidelines that **should** work, and then branch out from there, changing things as I go along so that it works for me.

So with credit to the original creator of this project, [Brian Caffey][2], here are some of my notes on what I found difficult, what problems I ran into, and the things I changed.

## Operating Systems

The project is built in a Linux environment, which has excellent support for Docker, but it's not my primary environment to be working in. I use Windows primarily, and all of my computers are Windows boxes. However, I have some Linux environments set up in Hyper-V already, so I'm using Linux in Windows to implement this Docker project (what could possibly go wrong? Networking, mostly).

## DNS

This is in the Docker documentation [here][1], but not in the [VET][0] documentation: (quoted below from docs.docker.com)

> Troubleshoting for Linux users
>
> ...
>
> _DNS settings_
>
> DNS misconfigurations can generate problems with `pip`. You need to set your own DNS server address to make `pip` work properly. You might want to change the DNS settings of the Docker daemon. You can edit (or create) the configuration file at `/etc/docker/daemon.json` with the `dns` key, as following:
>
> `{
>   "dns": ["your_dns_address", "8.8.8.8"]
> }`
>
> [...]
>
> Before proceeding, save `daemon.json` and restart the docker service.
> `sudo service docker restart`
>

The example they give above has you set the IP address(s) for your local DNS provider, with a fallback address to Google's public DNS. I set my DNS address list to use my local DNS first, falling back to `1.1.1.1` (Cloudflare) and finally `8.8.8.8` for Google's public DNS.

The line in the VET docs that gave me trouble was when it says to first run this line in the terminal:

`sudo docker-compose run backend django-admin.py startproject backend .`

This line will spin up a docker container that will try to run `pip install` for the required packages in `requirements.txt` which failed for me because the docker container didn't know where to look for DNS resolution, and so `pip` couldn't find and install any requisite packages.

After setting up my DNS setting for the Docker daemon as specified above and restarting the docker service, pip install worked as expected 🙌.

## CI

The VET [docs][3] on have you use the GitLab built-in CI offering, which, if I used [GitLab][5] at all, would probably be really easy! But I don't use GitLab and don't really want to get set up with another code repository when I already have [GitHub][6] set up and have integration with [CircleCI][4] already set up. So here's my modifications to the project to get set up with GitHub and CircleCI.

Not really knowing anything about how GitLab's CI systems work, it's hard to translate what it's doing to what needs to be done with CircleCI, so this is maybe not the best solution, but it does work, and I believe that it does the thing it's supposed to do.

### Working Version of CircleCI Config

Here's the first version of the CircleCI configuration file that successfully passed all tests and was able to store testing data in a way that CircleCI could store and parse in results.

```yml
#.circleci/config.yml
version: 2.1
# CircleCI
jobs:
  lint_test_coverage:
    working_directory: ~/project # this is the default
    docker:
    # The first image listed is the primary image and runs all commands
      - image: circleci/python:3.6
        environment:
          TEST_DATABASE_URL: postgresql://postgres@localhost/circle_test?sslmode=disable
          DJANGO_SETTINGS_MODULE: backend.settings-circleci
    # Subsequent images listed run on a common network with the primary image
      - image: circleci/postgres:9.6.9
        environment:
          # these settings affect how the test database is going to be set up - use to connect later
          POSTGRES_USER: postgres
          POSTGRES_DB: circle_test
          POSTGRES_PASSWORD: ""
    steps:
      - checkout
      - run: mkdir test-reports
      - restore_cache:
          key: deps1-{{ .Branch }}-{{ checksum "backend/requirements.txt" }}
      - run:
          name: Install Python Dependencies
          command: |
            python3 -m venv .venv
            . .venv/bin/activate
            pip install -r backend/requirements.txt
      # Save installed environment dependencies in cache for later steps/jobs
      - save_cache:
          key: deps1-{{ .Branch }}-{{ checksum "backend/requirements.txt" }}
          paths:
            - ".venv"
      - run:
          name: install dockerize
          command: wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && sudo tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz
          environment:
            DOCKERIZE_VERSION: v0.3.0
      - run:
          name: Wait for db
          command: dockerize -wait tcp://localhost:5432 -timeout 1m
      - run:
          name: Linting test
          command: |
            . .venv/bin/activate
            cd backend
            flake8 --output-file=../test-reports/flake8.txt
      - run:
          name: coverage test
          command: |
            . .venv/bin/activate
            cd backend
            pytest --cov --junitxml=../test-reports/pytest
      - store_artifacts:
          path: test-reports/
          destination: tr1
      - store_test_results:
          path: test-reports/

workflows:
  version: 2
  lint_test:
    jobs:
      - lint_test_coverage:
          filters:
            branches:
              only: master
```

### Issue 1: DB Credentials

Need to make sure that the postgres configuration passed to the secondary docker image sets up a user and database name that django is later going to connect to. In this case this is called out here:

```yml
- image: circleci/postgres:9.6.9
  environment:
    POSTGRES_USER: postgres
    POSTGRES_DB: circle_test
    POSTGRES_PASS: ""
```

Which needs to be loaded into django's settings from `settings-circleci.py`

```py
from .settings import * # noqa

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'circle_test',
        'USER': 'postgres',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '5432',
    },
}
```

Which are loaded when pytest runs because of the environment variable on the main docker image that is running the tests. I also declared the `TEST_DATABASE_URL` environment variable there, but decided not to make use of it in my `settings-circleci.py` file, finding that it seems to work better to declare the individual parts, rather than to use the URL string.

### Issue #2: Difference in Caching Methods

The source documentation for GitLab lets you declare a cache with a path. With CircleCI it's a little more complicated. For caching things like python dependencies, you need to add steps bracketing the dependency installation, with the same naming scheme for the cache. CircleCI leys you define the naming convention to use as the "key" for the cache file, so for any project make sure the `restore_cache` and `save_cache` use the same key generation method. In this case (from the circleci examples) we use the git branch name (`{{ .Branch }}`) and the checksum of the requirements file (`{{ checksum "backend/requirements.txt" }}`) so that we can maintain separate caches based on the required dependencies, and what git branch is actively being tested.

### Issue #3: Translating `before_script`

For GitLab, this runs the pip installation of project requirements. This is basically the same, only in this case, we need to define a virtual environment (that can later be backed up) with venv, then install the dependencies there, much like what we would achieve with local development.

These lines:

```yml
      - run:
          name: Install Python Dependencies
          command: |
            python3 -m venv .venv
            . .venv/bin/activate
            pip install -r backend/requirements.txt
```

achieve the goal of installing project dependencies, which in the next step are cached for use on the next run (potentially).

### Issue #4: Database not Ready

In preliminary test runs, I ran into the issue that django was complaining about the database not being set up. To solve this, and to ensure that the database will always be ready, I install dockerize and use it to wait for port 5432 on localhost to be ready (with a max time limit of 1 minute) in order to be sure that our postgres container is running and accepting connections. This could also be achieved with a curl command, but this works fine too.

### Issue #5: Remember where you're working

I ran into a lot of failed runs with CircleCI simply because I wasn't calling commands in the right location, trying to change into directories that didn't exist (because I was already there) or tried to save things into directories that were incorrectly named or not in the places I expected them to be in.

#### Working Direcory

CircleCI defaults to `~/project` for the current working directory. This is where code gets checked out to and is where the console is pointing when it starts any `- run:` stanza. You can change the working directory to something else that makes sense if you want to. Some trouble I ran into was trying to cd in to project (which doesn't exist as a subdirectory of project for this project).

#### Saving Test Results

Early on I create the folder `test-reports` (line is `- run: mkdir test-reports`) right after the checkout step. This folder is at `~project/test-reports/`, right at the top level of the project folder, alongside all my top level code folders and files when they're checked out.

During my Linting step and Test step, I tried to save the results to `./test-reports/{whatever}` - but if you look closely, in those two steps, I've cd'd down to the `backend` folder (`~/project/backend/`) which does not contain a `test-reports` folder! So my tests failed because they could not write to that direcory. After testing I realized my mistake and changed `./test-reports/{whatever}` to `../test-reports/{whatever}`.

A single dot, but an important one.

### Issue #6: pytest Won't Set Up Django

This was completely missed in the VET documentation, and I'm pretty sure I didn't miss anything in there that I was supposed to do, but installing `pytest` as part of the `requirements.txt` alone is insufficient to get `pytest` to get Django working properly to run tests against. For that you need to also add `pytest-django` to the project requirements. After I aded that package, Django would come up, connect to the test database and run the simple test that I have defined. Success!

Here's my full `requirements.txt` after that change:

```
Django==2.2.1
psycopg2==2.8.2
flake8==3.7
pytest
pytest-django # <- Add this
pytest-cov
```

## Conclusion of Project Setup

That's it for this post, and ends the alterations I needed to make for the Project Setup phase of the Verbose Equals True clone I'm making. Up next is the Backend API additions to Django, which will also include my first deep dive into Django REST Framework - since in the past I've only really used plain responses, and Apollo/GraphQl for my Django APIs.

[0]: https://verbose-equals-true.tk/
[1]: https://docs.docker.com/get-started/part2/
[2]: https://briancaffey.github.io
[3]: https://verbose-equals-true.tk/docs/guide/project-setup/#code-coverage
[4]: https://circleci.com/
[5]: https://about.gitlab.com/
[6]: https://github.com/
[7]: https://verbose-equals-true.tk/docs/guide/project-setup/#docker-compose