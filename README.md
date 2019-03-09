# Chase Sawyer
[![CircleCI](https://circleci.com/gh/shadowimmage/shadowimmage.github.io.svg?style=svg)](https://circleci.com/gh/shadowimmage/shadowimmage.github.io)
[Go to site](https://chasesawyer.dev/)

## Maintenance

The following are some notes for maintaining the site and repository.

### Updating Dependencies - Hugo v0.50

Hugo itself can be updated by grabbing the latest release from the [Hugo GitHub Releases](https://github.com/gohugoio/hugo/releases) page and downloading the latest release version of the Hugo executable.

Once a new version of Hugo has been checked and verified as working, the version of hugo used to build the site needs to be updated in the build step of `circle.yml`.

### Creating New Content

Console:
`hugo new /post/2018-10-31-Sample-Post.md -k post`

The `-k {kind}` flag will determine what kind of archetype template will be used for the file created at the given path. The path itself does not determine the archetype that gets used.

#### Testing Content Before Publishing

Viewing the site or content before publishing an article can be extraordinarily helpful.

Run `hugo server` with the optional flags `-D, --buildDrafts`, `-E, --buildExpired`, and/or `-F, --buildFuture`. `hugo server --help` has full command reference.

### CI

Pushing to the 'hugo' branch on github will trigger the circleCI build process. Currently the CI Process only checks out the site, updates the template, and pushes/publishes the resulting site from the /public/ output from Hugo. This eliminates the need to do local builds on whatever development machine is being used.

NOTE: The version of Hugo used to build the site must be updated in the circle.yml configuration to keep up with the current hugo releases.

'hugo' is the master branch for this repository.

### BeautifulHugo Theme - Dependency

The theme used is maintained via github submodule. Any upstream changes need to be manually synced to receive changes made to the upstream repository that may have been changed.

> More info see: [Working on a Project with Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)

Manual fetch+merge:

1. Go into the relevant submodule directory
2. `git fetch`
3. `git merge`

Easy update: `git submodule update --remote {moduleName}` - which is the same as the manual fetch+merge.

The above two assume that you don't want to make any changes to or contribute to the submodule's development, you're just consuming the product.

#### Contributing to submodule development

Assuming you do want to make changes and to have those changes checked into the submodule's repository, a couple steps need to be taken first:

1. Fork the submodule's repository into your own account
2. Check out the latest code from the submodule repository in your own project, to make sure you have the most recent changes to match your new fork
3. Replace your submodule's remote repository with your fork
4. Add a branch to your local submodule to begin tracking changes (get out of 'detached head' mode)
5. Add the original repository back as an 'upstream' remote to be able to pull updates from the original source repository
6. Manage your forked submodule as if it were any other project on GitHub - make and commit changes, upload those to your remote repository, then make pull requests to the upstream repository with your changes to contribute
