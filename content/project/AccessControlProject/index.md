---
title: "Access Control Project - UW"
subtitle:
date: 2018-05-11T19:26:29-07:00
lastMod: 2018-05-18T17:26:29-07:00
publishDate: 
tags: [project,uw,]
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

Our team created a solution that leverages our existing classroom control system hardware, adding on components for RFID scanning and electronic drawer locks. Several solutions exist for automatic locking drawers that can be controlled electronically. Our first commercial solution used a lock with a solenoid actuated bolt that would open when voltage was applied via a controlled relay. This had the problem that the bolt couldn't be under pressure from the drawer being pulled on, as the solenoid was not strong enough to pull against the tangential force of the drawer catch against it. The second solution used an eye-bolt as the catch on the drawer, with a locking jaw that was motor actuated. This solution eliminated the issue of a drawer having force upon it and still unlocking, but the eye-bolt and latch had to be perfectly aligned for these to work, and were prone to drifting, leading to the drawer getting out of alignment with the lock and needing to be re-calibrated. The final solution was to replace the drawer guides with a set that behaves similarly to the second solution, but with the locking mechanism integrated into the end of the drawer guide, eliminating the alignment issues of the second solution.

The RFID scanner uses open source hardware and allowed us to rapidly prototype different components in testing, seeing what configurations would work with our existing hardware and podia. We needed to add a RS232 serial interface to allow the scanner hardware to interface with the room's control system, and we found that the scanner was able to read cards through the inch thick podium surface. Being able to read through the wood surface allowed us to hide all the hardware and wiring within the body of the podium.

Installing the electronics for the RFID scanner inside the podium meant that we needed to design a mounting solution that would affix and support the electronics into the 'ceiling' of the podium, with the RFID antenna as close to the place where instructors would tap their cards on the surface of the podium. We used 3D printing to prototype an enclosure that snap-fits the electronics, with ports for connections and supports the antenna up to the internal surface of the top of the podium. Over time we have had a couple changes to the components used in the RFID scanner, and 3D printing allows for iterative changes to the design, that has and can continue to follow the changing needs of the project.

The original designs for the enclosures on this project were designed in [OpenSCAD][1] and are now designed in [Fusion 360][2].

[1]: http://www.openscad.org/
[2]: https://www.autodesk.com/products/fusion-360/overview