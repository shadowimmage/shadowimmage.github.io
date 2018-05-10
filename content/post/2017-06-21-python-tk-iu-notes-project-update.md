---
title: Python Tk UI Notes, Project Update
date: 2017-06-21
tags: [python, gui, update]
type: blog
---
I've been making a lot of progress on the [python-LEDSerialController](https://github.com/shadowimmage/python-LEDSerialController) project. There's been a lot to learn about how to run the original command line script with a GUI frontend. I chose to use Tk since it's baked into Python already, and there's nothing to configure to get it working. It doesn't look nearly as nice as something that would come out of using a more advanced UI toolkit, but it's also had a lower bar to entry, despite some drawbacks with Tk's documentation. Googling around for solutions to problems as they arise has proved to be effective though.

Getting this project to run smoothly has been a challenge because I'm using one thread to accomplish everything, which comes with the restriction that nothing can be blocking (at least not for long) without causing UI lag (bad) or causing responsiveness on the LED controller (Arduino) to lag. This is further complicated by the way that I've built up the Arduino code to allow it to perform animations with the LED strips and check in on the serial buffer.

All of this combines to create the following conditions:
- The Arduino only checks in with the computer when it's ready for a new command in between running pattern animations, which depends on the interval setting for the last command that was sent
- The UI only updates while the Python thread is not blocked or doing anything long-running
- Updating the Arduino requires checking the computer's serial buffer to see if the Arduino has signaled that it's ready for the next command.

Disadvantages of doing things this way:
- A pattern animation, such as the animated rainbow, will only run for a single cycle, and then stop. More to the point, without any serial input from the host computer, the Arduino will cease to update any LEDs at all.
- The host computer must continually update the Arduino (controller) with what to do next, including, telling it to do the same thing over again.

Advantages of doing things this way:
- Any updates to state on the Python host program can update the controller with new information as soon as it's ready
- UI to Controller update delay is minimal
- UI can remain responsive while the controller is busy and not ready for communication

Timing on the Tk application can be tricky in this situation: checking the serial input as often as possible can push CPU usage to 100%, and accomplishes nothing productive since the Arduino won't be ready for updates that frequently. On the other hand, checking too infrequently will lead to stuttering in continuous patterns, but will leave more time on the host PC for keeping the UI responsive.

The way I solved this was to ensure that any blocking actions are only executed when absolutely necessary. In this instance, I can use the pyserial in_waiting property to know when the Arduino has sent data that needs to be checked:
```python
def serial_has_waiting(self):
    """Return true if there is serial data in the input buffer - non-Blocking"""
    return self.cmdMessenger.comm.in_waiting != 0
```
Using that method allows me to avoid going into my incoming data handling code before there's anything in the input buffer to read:
```python
def getCommandSet(self, src):
    receivedCmdSet = None
    logging.debug(src + ': getCommand...')
    while (self.cmdMessenger.comm.in_waiting == 0): # blocking - here as a final check before self.c.receive()
        time.sleep(0.1)
    receivedCmdSet = self.c.receive()
    logging.debug(src + ': getCommand complete.')
    if (receivedCmdSet[0] == "CMDERROR"):
        logging.error("CMDERROR: " + receivedCmdSet[1][0])
    logging.debug(receivedCmdSet)
    return receivedCmdSet
```
The final piece is making a method that will be called for every cycle of the Tk `mainloop()` - first in main:
```python
if __name__ == '__main__':
    try:
        if setup():
            pre_run_commands()
            app.after(500, update_controller) # HERE
            app.mainloop()
    except KeyboardInterrupt: # Called when user ends process with CTRL+C
        stop()
```
And within `update_controller()`:
```python
def update_controller():
    """Check the LED Controller, and issue, or re-issue a command as needed"""
    if LEDController.serial_has_waiting():
        LEDController.repeat()
    app.after(75, update_controller) # HERE
```
The important part here is the amount of time (in milliseconds) that the `app.after()` is given for the next check. Initially from main, I have it set at 500ms, since we want to get things going and allow a little time for the UI to get started before we start the serial communication with the Arduino in earnest. Later on, it's reduced to 75ms in `update_controller()` so that we can have enough time to update the UI, not overburden the CPU, and also be sure to catch input from the Arduino relatively quickly (within about 75ms, which is pretty fast). This balance is fast enough that animations on the Arduino don't perceptibly have a delay in between iterations.

I might tune these values more, but for now things seem to be running well enough that I can focus on further development of the UI and implementing more advanced actions through the Tk GUI, and eventually (long term) start building out connections to other applications and APIs that would allow the LED strip to react to events from other applications or web services.