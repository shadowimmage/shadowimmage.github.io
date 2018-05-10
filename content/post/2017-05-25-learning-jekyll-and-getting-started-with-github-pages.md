---
title:  "Learning Jekyll and Getting Started with Github Pages"
date:   2017-05-25
tags: [jekyll, update, learning]
---
~~First Post!~~

Learning how to set up Jekyll on GitHub Pages is actually a little harder than I was expecting from the outset. Mostly because most of the things that you need to set up Jekyll for local development, and a lot of the things that come prepackaged with it aren't actually necessary for running it on GitHub Pages.

Here is the Gemfile content for this page when I first started and got things working:

```ruby
source "https://rubygems.org"
ruby RUBY_VERSION
# ...
gem "jekyll", "~> 3.3"

gem "jekyll-theme-slate"

# If you have any plugins, put them here!
group :jekyll_plugins do
    gem "jekyll-feed"
    gem "github-pages"
end
```

This is actually a mix of what you end up with when you [create a site from scratch on GitHub Pages using the theme chooser](https://help.github.com/articles/creating-a-github-pages-site-with-the-jekyll-theme-chooser/#using-the-jekyll-theme-chooser-with-a-new-repository) with an empty repository. And it's also different from the one you'd get by starting locally using the [Jekyll Quick-start guide](https://jekyllrb.com/docs/quickstart/). While the Quick-start mentions [this](http://jmcglone.com/guides/github-pages/) helpful guide to getting started using Jekyll on GitHub Pages (which I worked through and found to bve educational in getting things set up), it doesn't make use of the nice (an easy to use) templates / themes that you can select through the GitHub Pages repository settings. To do that, you need to use the template HTML / CSS from the theme baked into GitHub Pages by copying ```default.html``` according to [this](https://help.github.com/articles/customizing-css-and-html-in-your-jekyll-theme/) article on GitHub Help.

Once you have your theme working, and you have a working website that you can reach, and your content is showing up the way you expect, you can begin customizing and adding in plugins, custom CSS, etc. 

One final issue I ran into was a dependency issue with the ```Gemfile.lock``` vs. the ```Gemfile``` when trying to set up this site to use [CircleCI](https://circleci.com/) \(more for fun getting to know CircleCI than anything else\). The issue was that when I created a local Jekyll deployment for testing with the same repository as the one I was using for GitHub Pages, I had been making a lot of ignorant changes to my ```Gemfile```. There were conflicting entries between the two and my resolution \(since there wasn't much here to break yet\) was to rename ```Gemfile.lock``` to ```Gemfile.lock.old``` left my ```Gemfile``` as it was, and then reran ```bundle install```, which will regenerate ```Gemfile.lock```, without any conflicts between them.

Once that was ironed out, CircleCI was able to complete without errors, but without a ```circle.yml```, it also didn't have any tests to run in order to say anything about the state of the project. So I put together a basic configuration:

```yml
machine:
    ruby:
        version: 2.4.0

dependencies:
    post:
        - bundle exec jekyll build

test:
    post:
        - bundle exec htmlproofer ./_site --check-html --disable-external

```

The above is basically lifted from the [CircleCI page in the Jekyll docs](https://jekyllrb.com/docs/continuous-integration/circleci/), plus specifying the ruby version that's currently being used by GitHub Pages.

_Another_ issue that I ran into trying to get this page to build on CircleCI was [this Jekyll issue (#2938)](https://github.com/jekyll/jekyll/issues/2938). So I had to add "vendor" to the exclude list - this was not immediately clear (since I hardly know YAML at all) because it's listed on the fixes as 
> ```yml
> exclude: [vendor]
> ```
But if you want it in a YAML list, it needs to be noted as
```yml
exclude:
    - vendor
    - .... other excludes ....
```

---
So after all that, do I have a passing build? No.

htmlproofer found some ```<a href="#">``` placeholder tags and failed.

But at least now it's failing because of something I wrote, rather than because of a configuration issue! 

Success and progress.