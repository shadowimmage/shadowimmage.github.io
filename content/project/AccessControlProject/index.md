---
title: "Access Control Project - UW"
subtitle:
date: 2018-05-11T19:26:29-07:00
lastMod: 2018-05-18T17:26:29-07:00
publishDate: 
tags: [project,]
type: "post"
draft: true
---

The idea for this project began as a discussion around how to eliminate the need for traditional brass keys for classroom equipment access. The traditional keys required users to check them out from our office any time they wanted to use some technology in a classroom for teaching or for special events.

## Background

The problem with this system was that the brass keys could be lost, copied, (despite being marked "do not duplicate") and shared or lent to others. In addition, after many years (decades?) of the program being in operation, several thousand keys were produced and tracked. The tracking of these keys went through several generations of paper forms and digital record systems (some still based around paper checkout and return forms), as well as changes to management and policy. Over time records, keys, and other documentation had been lost or fragmented.

We decided to try a new system that would avoid the need for brass keys entirely.

In the past decade the University (and media as a whole) has been transitioning from analog systems to digital systems, and with that our team has been upgrading classroom equipment to use digital signals, and digital control systems. The spread of digital control systems that we can integrate with has been key in allowing us to experiment with creating a new access control methodology that avoids analog tools like keys.

## Solution

We built a system that uses UW members' HuskyCards (campus ID card issued to all faculty, staff, and students) to allow them to unlock classroom control systems and equipment drawers in classroom podia. The system uses RFID to read tags built into the HuskyCard to look up the user in the university's identity database, and pull that user's group memberships to determine whether or not they are allowed to access the classroom equipment. The advantages of this method of controlling access to technology is manifold.

As each user is separately identifiable via HuskyCard, the control system can remember users' last used settings and, upon tapping their HuskyCard again later, will recall those settings for their convenience. For example, if an instructor uses a laptop every day, then upon tapping their HuskyCard on the classroom's podium, the control system will turn on the projector and route the laptop input to the projector.

Blank/generic RFID cards can be added to the authentication backend separately from the identity database, allowing temporary access cards to be issued to individuals that don't qualify for a HuskyCard, such as guest or visiting instructors. Temporary cards can also be set to 'expire' or invalidated if the individual card is not returned on time or is lost.

Usage / login statistics can be gathered to see how many individual users are using classroom technology. We can also track what kinds of people are using our equipment, such as students vs. faculty, and at what times of day.

Finally this system allows us to save time when instructors forget to bring their ID with them. In the past if an instructor forgot their key to the classroom equipment, we would have to send a technician out with a key to unlock the equipment, and after class finished a technician would have to return and re-lock the equipment. The new Access control system eliminates the need for this as we can unlock the equipment remotely through our control system monitoring interface, in real time, while the instructor is on the phone with the help desk.

## Development

