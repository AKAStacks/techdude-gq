---
title:  "The WeMo, the Samsung and the Sword"
date: 2020-08-24
---

## It Begins

A long time ago, in a board room far, far away a gallant group of product designers at Samsung put together a beautiful 1080p television. A crisp 52 inch LED display, glass 2.5 inch bezel sporting an elegant burgundy to black gradient, "touch" controls, and a whopping four HDMI inputs all lived proudly on this television. The [Samsung LN52A750](https://www.bhphotovideo.com/c/product/544327-REG/Samsung_LN52A750R1FXZA_LN52A750_52_1080p.html) would be sold for more than $2,500 US--it had to be good.

<div style="width:100%; display: grid; place-items: center;">
        <img class="image" src="https://lcdtvbuyingguide.com/lcdtvpics/lcdtv/samsung-a750.jpg">
        <i>Image credit: lcdtvbuyingguide.com</i>
</div><br />

Years later, the scavengers of the world (myself included) would get their hands on this TV for the low-low price of fuck-all; thank you, mindless consumerism! Fewer would deem to use this TV as their primary PC display. I was one of those lucky fools.

In 2008, you could hardly get a prettier television. In 2020, we expect a few things from our TVs that we didn't back then. Exhibit A: we want our TVs to time-out after No Signal. A primary fault of this particular display was that it did not, in fact, time-out after No Signal. It will instead stay on all night, telling you just how little signal it is receiving.

## So what?

So? We don't just settle for shit like that, come on! 

I sent a message to my local LUG mailing list for suggestions. A brilliant man (whose name I won't disclose because he is infinitely more professional than myself) responded enthusiastically suggesting I get a [WeMo D1 Dev Board](https://www.amazon.com/Organizer-ESP8266-Internet-Development-Compatible/dp/B081PX9YFV) to do the interfacing for me. I belong to the best LUG in the entire world, evidenced by the fact that he put together a circuit diagram as well.

He also met up with me to give me all the components. What did I do to get so lucky? I don't know. He insisted that these componenents were "just sitting around."

This was my first foray into working with development boards. Seeing as this board has WiFi included, his implementation used a web-interface to trigger the function-call that would send the IR signal to my TV. It was slick, and pretty easy given all of the libraries that were available for the hardware. What I didn't like about this was that anyone in my house could just turn off the TV willy-nilly.

So, rather than implement some security that could inevitably be circumvented, I changed the interface to serial over USB. This was an experience in and of itself. For example: I knew I could `echo "toggle" > /dev/ttyUSB0` to write commands to the bus, but I had no idea how to read feedback from the bus. `cat /dev/ttyUSB0` would block the processor and never terminate, while only showing me some jibberish unicode. It took me a while to figure out I needed to use `stty -F /dev/ttyUSB0 9600` (where 9600 is the baud-rate specified in the code when opening the Serial port) in order to get anything legible out of the `cat` command; further, I would need to `cat < /dev/ttyUSB0` to properly close the connection and therefore allow the processor to continue doing its thing. I ended up relying on `screen /dev/ttyUSB0 9600` to read feedback consistently and test input (just typing "toggle" fast enough would write it to the serial bus, triggering the function on the board).

I also spent far too much time figuring out that any feedback I provided via the serial interface was pushed to the same bus that input was--that is to say, when the D1 tried to tell my computer "OK," the D1 interpreted "OK" as input and tried to interpret it as a command. Then, when it said "Unknown command: OK," it would interpret *that* as input, resulting in an infinite loop.

Cool. So I formatted my feedback with a ">" at the beginning and incorporated a check into the part of the code that would read/peek at the serial bus for input. After a couple hours, everything was working as expected! I went ahead and wrote a [wrapper](https://github.com/AKAStacks/irproject/blob/master/tvctl) for this functionality and went to write an excessive "thank you" letter to the mailing-list.

## Good job with the babby stuff (systemd time)

Hey, thanks! I guess, eventually, I want this to be useful for someone so I'll also include what I had to do to make my TV turn on and off on poweron/shutdown/wake/suspend.

### suspend/wake

Let's start with suspend/wake since that's the easy part! I popped this script into `/usr/lib/systemd/system-sleep`:

{% highlight bash %}
#!/bin/bash

if [[ "${1}" == "pre" ]]; then
	/usr/local/bin/tvctl toggle
elif [[ "${1}" == "post" ]]; then
	/usr/local/bin/tvctl toggle
fi
{% endhighlight %}

and *bazinga* it works. I know it's redundant but get over it, or just do better.

### poweron/poweroff

This one's a little more tricky, because you have to be sure the serial connection is live before you try and send the command. Since I'm not exactly in love with systemd's methodology for doing things like that, I just went ahead and created my own target that gets run after `graphical.target` is reached. To do that, I put the following in `/etc/systemd/system/bespoke.target`:

{% highlight bash %}
[Unit]
Description="My Bespoke Target"
Requires=graphical.target
After=graphical.target
AllowIsolate=yes
{% endhighlight %}

I created a `tvctl.service` file in the same directory, and filled it with:

{% highlight bash %}
[Unit]
Description=TV Power Toggle
Conflicts=reboot.target
After=graphical.target

[Service]
Type=oneshot
ExecStartPre=/usr/local/bin/tvctl init
ExecStart=/usr/local/bin/tvctl toggle
RemainAfterExit=yes
ExecStop=/usr/local/bin/tvctl toggle
StandardOutput=journal

[Install]
WantedBy=bespoke.target
{% endhighlight %}

Then I created a `/etc/systemd/system/bespoke.target.wants` folder, and did a quick `ln -s /etc/systemd/system/tvctl.service /etc/systemd/system/bespoke.target.wants` to ensure that my target would load the service.

Finally, I had to make my new target the default systemd load target. That's as simple as `ln -s /etc/systemd/system/bespoke.target /etc/systemd/system/default.target`

I checked that everything was going to work with `systemctl status bespoke.target` and then rebooted (after turning my TV off with the remote for the final time.)

## Word up

It worked, and I stopped thinking about it. Then I wrote this, and hopefully it will help someone. Feel free to [contact me](#footer) on my social media if you have some kind of trouble with it. I may have left out a step toward the end, because I didn't really take notes as I was doing this. Sorry 'bout it.

Godspeed, dude.
