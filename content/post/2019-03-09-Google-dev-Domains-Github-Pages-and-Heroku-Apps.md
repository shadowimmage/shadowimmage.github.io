---
title: "Google .dev Domains, GitHub Pages, and Heroku Apps"
subtitle: "How to get things wired up now that you have that sweet, sweet .dev domain name"
linkTitle:
description:
date: 2019-03-09T11:51:59-08:00
lastmod: 2019-03-09T19:10:35-08:00
tags: [post,blog,dev,heroku,google,domains,dns,security,hsts,]
draft: false
shareOff:
---

At the end of February 2019, Google released general access to the .dev top level domain. I had heard about this happening about a year ago, and am now the happy owner of two .dev domains! One of these is chasesawyer.dev and will soon be the new home of this site!

But how to get it set up? When you buy a domain name, nothing is really set up for them - going to those addresses doesn't point to anything Firefox and Google will just say "Server not found." So here's how to change that.

Theres a few things I want to set up for these domains, and I'm going to go through the steps for each. This is also part one of a series of posts on how to accomplish these tasks. Other parts will be linked when they've been figured out and done!

- Custom domain setup for this site, while maintaining hosting via [Github Pages][4]
- Email forwarding to [ProtonMail][5]
- Custom domain setup for my apps on Heroku

## Some Quick Assumptions

I'm going to be making some assumptions throughout this article, most of which can probably be translated to other platforms, but your mileage may vary.

- You're using a .dev domain - part of the [HSTS list][6] (this will come up later)
- You bought your domain, are administering your domain through [Google Domains][7] (rather than godaddy or namecheap or something else - those are probably fine, I just went with Google Domains for expediency when they launched .dev)

## GitHub Pages and Custom Domains

This first one is pretty straightforward - you need to do two things:

1. Determine if you want your GitHub Pages site to be at the root of your custom domain (ie, going to chasesawyer.dev without any prefixes) or if you want it to be at a subdomain (ie, **blog**.chasesawyer.dev or **pages**.chasesawyer.dev)
2. Create a the appropriate DNS record on google domains (domains.google.com/m/registrar/{yourdomainname}/dns) under "Custom resource records.
    - For the former case (Apex domain), see [setting up an apex domain][0]. For this use case, the way that worked best for me was not by using [forwarding][1], but by using [A records][3] in the Google Domains DNS settings for my domain name.
    - For the latter case (subdomain), see [setting up a custom subdomain][2]
3. Update the custom domain option on your GitHub Pages repository to match the domain that you're using. If you don't do this, then your site won't load properly, and, since the .dev domain can only be used via HTTPS, you'll have security problems with your site! (more below)
4. Wait for a little while - your DNS settings need some time to propagate through the DNS system, so that requests to {yourdomain}.dev will properly redirect to your GitHub Pages site. GitHub Pages also has to have time to set up a certificate for your new site.

### Security, HTTPS, Certificates

If, like me, you enjoy using GitHub Pages for hosting your site, you've enjoyed having your site having an https address, and all the security baked into GitHub Pages. When you are setting up sites on a .dev domain since it's part of the [HSTS][7] preload list in most modern browsers, your whatever.dev site can only be loaded via https. This means that you'll need a security certificate for the site you set up on .dev! But how do you do this if you're using GitHub Pages? You don't have access to their webserver, so the [Let's Encrypt][8] [certbot][9] won't work for you. But you need a security certificate for your domain!

What isn't really explained anywhere where I can see, is that this process of getting a security certificate through Let's Encrypt for your GitHub Pages site at your custom domain _is completely automated!_ That's right! _GitHub Pages just does it for you._ This is why step 4 above takes a little while to complete - whatever mechanism at GitHub that serves up pages from your github.io pages site that gets set up on {your custom domain} needs to have a security certificate set up, and that system takes care of getting one through Let's Encrypt.

This is also why I decided to go through with setting up this site with `A` DNS records, because for whatever reason, DNS forwarding didn't work properly, and didn't trigger whatever automated system that sets up a security certificate for your custom domain served through GitHub Pages.

Will this cause problems later on? I am not sure yet. I haven't set up subdomain records on Google Domains yet (like {something}.chasesawyer.dev) but that is gonna be the subject of my next post!

[0]: https://help.github.com/en/articles/setting-up-an-apex-domain
[1]: https://support.google.com/domains/answer/4522141
[2]: https://help.github.com/en/articles/setting-up-a-custom-subdomain
[3]: https://help.github.com/en/articles/setting-up-an-apex-domain#configuring-a-records-with-your-dns-provider
[4]: https://pages.github.com/
[5]: https://protonmail.com
[6]: https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security
[7]: https://domains.google/#/
[8]: https://letsencrypt.org/
[9]: https://certbot.eff.org/