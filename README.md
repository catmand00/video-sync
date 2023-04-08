# video-sync

Websocket server + bookmarklet functions to remotely sync video playback of HTML5 video elements (eg, YouTube), similar to Netflix Party and others.

Features:
- Sync video play, pause, volume change, and seek (change video time)
- Bookmarklets can be saved so connecting/disconnecting to server is done with single click


## Server

The websocket server listens for connection requests, then adds those connected addresses to a map. For every signal received from any of the connected parties, it will resend that signal
to every other connected party. Once a client disconnects, it is removed from the map.

## Bookmarklets

Bookmarklet takes care of required client side functionality. It attaches listeners to the `video` element which send messages to the server whenever actions occur (eg, play/pause).
The bookmarklet also listens for messages from the websocket and then automatically activates those actions on the `video` element. The server handles the logic of not resending messages to the original sender, 
but the bookmarklet needs to make sure the websocket initiated play/pause does not in turn generate another message to the websocket.
