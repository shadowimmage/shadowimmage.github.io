---
title: "Hugo Gotchas"
date: 2018-05-10T21:04:59-07:00
tags: [post, fyi, note, help]
draft: false
---
# Gotchas

In order of the issue being found:

## Is Strange (Hugo) (Template Logic)

Hugo templates use strange logic - for conditional statements, Hugo uses Polish or prefix notation for the operators. This meas that instead of writing `if this and that`, you have to write `if and this that`. For more complex arrangements of logical conditions, say for a situation in which you need to check three conditions, you have to write it as: `if and (first) ( and (second) (third))` which, in a infix notation style, would have been written `if first and second and third`.

## Hugo uses blackfriday

Hugo uses [blackfriday](https://github.com/russross/blackfriday) as it's markdown engine. This is probably totally fine for most situations, except for when you want to make a list with more than 2 levels. For instance,

- first
    - second
        - third

In the above case, blackfriday normally will collapse the _second_ and _third_ levels both into the _second_ level. I say normally because most linters and stye guides specify an indent of 2 spaces for markdown [citation needed]. If you come from github markdown style, then this is likely the case for you. Unfortunately there's an annoying bug in blackfriday that requires that the indent for each level be 4 spaces. If you don't notice this when scanning through the Hugo documentation on [content formats](https://gohugo.io/content-management/formats/), you'll likely run into a situation where you're confused about your list ending up somewhat flattened.

Fortunately, most linters can be configured to have different indent settings. For Visual Studio Code (my current editor of choice), markdownlint can be configured with a `.markdownlint.json` file in the root of your project directory or in your `.vscode\settings.json` workspace settings file. This isn't a show stopper, but for me, wasted some time while I had to dig through to find the [issue report](https://github.com/russross/blackfriday/issues/329) in blackfriday and then more time to read the markdownlint documentation and figure out how to reconfigure the indent setting to make sure that my lists in my Hugo site markdown will pass.

Question for later:  
Can I catch this / use markdownlint in CircleCI builds?

## Hugo Supports Emoji in Markdown

This wasn't super hard to figure out, but could be easier to find info on (I actually think that the Hugo documentation could use a way better table of contents, and better search). I nearly added an emoji css library to my site head in order to support emoji via `<i>` tags inline in the markdown file, but fortunately found that emoji are natively supported by Hugo, but you have to enable it with the `enableEmoji = true` setting in the site's root configuration. Once you enable emoji support for content files with that setting, you can easily insert emoji with their names between colons (eg `:weary:`).

Protip: want larger emoji on your page? Have a header with an emoji rather than plain text. The emoji will scale to the predefined scale of the header. (Note: this will also anger the markdownlint gods, as the trailing ':' isn't allowed)

## :smile: