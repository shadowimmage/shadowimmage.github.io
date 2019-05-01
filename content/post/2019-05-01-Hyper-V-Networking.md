---
title: "Hyper-V Local Networking"
subtitle: "How to make use of Hyper-V's default network switch without needing extra setup"
linkTitle:
description:
date: 2019-05-01T11:44:57-07:00
tags: [post,hyperv,networking,virtualization,]
draft: false
shareOff: false
---

I had to set up an [Ubuntu][3] VM ([Virtual Machine][2]) on my machine recently and because I also use [Docker][5], I had to learn exactly how [Hyper-V][4] handles networking tasks between the host machine and the virtual machines you set up. Hyper-V, as far as I understand, has 3 main networking methods called virtual switches. There's actually a 4th option that comes out of the box, which is something of a hybrid between an "Internal Switch" and an "External Switch". The default switch is interesting, and not particularly intuitive, but after getting used to it, I find it really convenient, if a bit tedious to deal with. It is **absolutely** not something I recommend running anything in for long periods of time, or for anything upon which other people rely. It is, however, good for getting something set up quick and dirty - so long as you understand what it's doing.

For the length of this article, it will be good to understand what a switch is, so read [this Wikipedia article][1] if you are unfamiliar.

So with that, here's a quick overview of what the Hyper-V switches are and can do.

First, there's the **Internal Switch**. This is a virtual switch that allows Host<->Guest connections with static IP addressing allowing inter-machine communication. The downside of this, however, is that the Guest OS is *isolated* from the wider internet that the Host may be connected to.

Second, there's the **External Switch**. This is a virtual switch that is *not* connected to the Host directly, and **consumes a physical host network interface**. This interface is given over to the exclusive use of any VM set up to use the External Switch. The benefit of this is that all VMs on that switch can talk to each other, and can communicate to whatever is connected to that physical network, which may also be the same physical network as your Host (via an external switch, routing, etc. and separate physical network interface). If you have two network interfaces for your computer, then this may be a good solution for long term use. Other benefits include: Static IP addressing of your guest virtual machines, the VMs behave exactly as if they had their own wired (or wireless) network connection to the rest of your physical network, and internet connections are thus possible to and from the Guest machines. Basically, this is just like having real physically separate computers sitting on your desk, with the caveat that you need more than 1 physical network interface (which I don't currently have).

Lastly, there's the **Private Switch**. This is an interesting situation, and I can only think of a couple uses for it, but what it does is only allow VM<->VM communication. There's no way for Host<->VM or Internet<->VM connections with this switch. I think the only situation you'd want to use this is for VM-VM relay communication, where each VM has more than 1 virtual network connection enabled, such as a Router VM, Firewall VM, and other(s), where 1 VM is connected to the internet, relays traffic to an isolated Firewall VM, which then allows traffic through to even deeper VM(s) that are thus protected via layers of networking, without the need for a rack full of hardware. This might theoretically be a useful application for a clustered network simulation or something where everything is isolated from external interference, but that's beyond my interest or skill.

## The "Default Switch" - Getting Up and Running Without Configuring a Bunch of Stuff

The thing that makes the Default Switch work well is that it is the only version of virtual switch that Hyper-V has that has NAT or Network Address Translation. The default switch behaves somewhat like a home router, allowing Guest VMs internet access, as well as Host<->VM communication, without the hardware requirements or setup needs of an External Switch. It also does all the work for you, but also doesn't allow you to take control of it. What this means is that _you cannot set static IPs for your VMs_. Hyper-V gives them DHCP addresses in a limited range, which is randomly selected in the `192.168.xxx.xxx/28` space. The Host can communicate with services running on a Guest at the given IP address that the VM is given, and the Guest(s) can communicate with the Host at it's external IP address via NAT. Guests will get new random IP addresses every (or almost every) time the VM is rebooted, and each time the Host is rebooted, Hyper-V will choose a new random local address space to set up it's DHCP range in, before passing those off to the guest VMs. You also can't disable or remove the Default Switch (as far as I can tell) - but it won't hurt anything being there. If you don't use it, just ignore it.

So, how to get things talking to each other?

Step 1: Gather information. You need to retrieve 2 things: Your Host computer's IP address. This is what you computer is addressed according to your company / home network if another physical computer on that network were to ping it. For me, it's `192.168.1.10` at home and `10.155.43.82` at work. Then you need to get the IP of your VM. In this case I just opened the ethernet settings in Ubuntu and checked the assigned IP address. You can also get this information from the Hyper-V manager window to see what IP your VM got assigned. At the time of taking notes, this was `192.168.18.187`.

Step 2: Set up services on VM: Say you want to run a test web server on your VM and access it from your Host's browser. You'll need to tell your server to bind to the VM IP at whatever port you want to use, for instance `192.168.18.187:8000`. For a [Django][7] server, I'd run: `python manage.py runserver 192.168.18.187:8000`. Then (if it successfully starts up) you can go to your Host browser and go to that address and the Default Switch should route your traffic to the VM running that webserver.

From the VM, if you want to communicate with the Host services (say, a Docker image running [PgAdmin][8]; or your PostgreSQL server that's running on the Host), you can address them from the VM by using your Host's external IP address. For the above example, my Django web server running in my Ubuntu VM, would communicate with my Host's PostgreSQL database server at `10.155.43.82:5432`.

Next time you reboot things, just check your IP addresses, and reconfigure your settings before starting up services again.

[1]: https://en.wikipedia.org/wiki/Network_switch
[2]: https://en.wikipedia.org/wiki/Virtual_machine
[3]: https://www.ubuntu.com/
[4]: https://en.wikipedia.org/wiki/Hyper-V
[5]: https://www.docker.com/
[6]: https://en.wikipedia.org/wiki/Network_address_translation
[7]: https://www.djangoproject.com/
[8]: https://www.pgadmin.org/
[9]: https://www.postgresql.org/
