---
title: "SlackR25Bot - UW"
date: 2018-05-02T21:24:58-07:00
publishDate: 2018-05-02
lastMod: 2018-05-13
tags: [project, aws, lambda, sns, slack, UW]
type: "post"
draft: false
resources:
- src: "images/invocation.PNG"
  title: "invocation"
- src: "images/help.gif"
  title: "help command"
---

This project was built for [Classroom Technologies & Events][1] at the [University of Washington][2].

<!--more-->

# [<button style="background-color:Black" type="button" class="btn btn-primary">View on GitHub&nbsp;&nbsp;<span style="vertical-align:middle; font-size:1.5em"><i class="fab fa-github"></i></span></button>][6]

## <i class="fab fa-aws"></i> <i class="fab fa-node-js"></i>

## Background

The University has been updating their course scheduling from an onsite instance of R25 (unable to link because documentation doesn't exist on the internet anymore) - a product from [CollegeNET][3]. Part of that process involved moving the scheduling database off-site. This allowed for a new integration to our Slack instance that could contact the R25 web service, now hosted on the CollegeNET servers, rather than secured locally on one of the UW's servers.

### Timeline

I came up with the idea for this project around April 18th, 2018, after talking to some colleagues about transitioning other internal tools that leveraged the local SQL database over to the R25 web service after the system transitioned to the cloud. Our department had recently been granted access to the web service, and I had spent the earlier part of the month translating Python scripts that had been digesting local SQL results to talking to the R25 web service and digesting XML instead. I spent about a week researching the possible integrations between Slack and external apps, and decided to use a Slack Slash Command for the integration's implementation.

## Implementation

Full details on the [README][6]

To quickly get up and running I started out with [AWS Lambda][5] and getting up to speed with what was necessary to get an AWS Lambda function working on the web. This led me to [Serverless][4] as a way of accelerating development and management of AWS resources.

The first version of the integration used only one Lambda function, but in order to echo commands back to the user in a channel and also respond later asynchronously, two Lambda functions are required. This is because each Lambda function can only reply to the request / trigger that started it once. If the Lambda function replies to Slack to acknowledge receipt of the command, then it won't be able to reply later once the R25 data has been retrieved and processed. If the Lambda function waits until it's gathered and processed all the R25 data, then it might miss the 3-second window to acknowledge the Slack command, and even if it does reply within the time frame, the confirmation of the command happens after the results are returned to Slack, making the confirmation show up not only late, but out of order. Thus two Lambda functions are required: one to parse and return acknowledge the command and another to query and process the R25 web service data.

## Screenshots

### Invoking

{{< figure src="images/invocation.PNG" caption="Invocation" caption-position="bottom" caption-effect="slide" >}}

### Help

{{< figure src="images/help.gif" caption="Help" caption-position="bottom" caption-effect="slide" >}}

---

[1]: https://www.cte.uw.edu/wordpress/
[2]: https://www.washington.edu/
[3]: https://corp.collegenet.com/
[4]: https://serverless.com/
[5]: https://aws.amazon.com/lambda/
[6]: https://github.com/uw-it-cte/uw-slack-r25-bot