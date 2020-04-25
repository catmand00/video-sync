#!/usr/bin/env python

import os
import asyncio
import threading
import queue
import pathlib
import ssl
import json
import websockets
import dotenv

dotenv.load_dotenv()

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
cert = pathlib.Path(__file__).with_name(os.environ['SERVER_CERT_FILE'])
key = pathlib.Path(__file__).with_name(os.environ['SERVER_KEY_FILE'])

ssl_context.load_cert_chain(cert, key)
SECRET_KEY = ''

message_queue = queue.Queue()
connection_dict = {}
dict_lock = threading.RLock()

valid_messages = ['play', 'pause', 'seek', 'volume_change']


def get_play_action():
    return json.dumps({'action': 'play'})


def get_pause_action():
    return json.dumps({'action': 'pause'})


def get_seek_action(timestamp):
    return json.dumps({'action': 'seek', 'timestamp': timestamp})


def get_volume_change_action(volume):
    return json.dumps({'action': 'volume_change', 'volume': volume})


async def echo(websocket, path):
    remote_address = websocket.remote_address
    with dict_lock:
        if remote_address in connection_dict:
            print('already in there')
        else:
            connection_dict[remote_address] = websocket
    try:
        async for message in websocket:
            message_queue.put((remote_address, message))
    except (websockets.exceptions.ConnectionClosedError,
            websockets.exceptions.ConnectionClosedOK):
        # disconnected explicitly with .close() client side
        with dict_lock:
            connection_dict.pop(remote_address)


def seek_subprotocol(url, request_headers):
    protocols = request_headers.get_all('Sec-WebSocket-Protocol')
    if len(protocols) == 0:
        return (500, [], 'Error decoding (check file encoding?)')
    protocols = protocols[0].split(', ')
    with open('SECRET_KEY.txt', 'r') as f:
        SECRET_KEY = f.read().replace('\n', '')
    if SECRET_KEY not in protocols:
        return (500, [], 'Segmentation fault.')


async def send_to_all(msg):
    with dict_lock:
        popping = []
        for addr, sock in connection_dict.items():
            try:
                await sock.send(msg)
            except (websockets.exceptions.ConnectionClosedError,
                    websockets.exceptions.ConnectionClosedOK):
                # Client disconnected silently
                # iterating over dict, cannot edit yet
                popping.append(addr)
        for to_pop in popping:
            connection_dict.pop(to_pop)


def check_messages():
    asyncio.set_event_loop(asyncio.new_event_loop())
    while True:
        frame = message_queue.get()
        msg = frame[1]
        if msg == 'pause' or msg == 'play':
            loop = asyncio.get_event_loop()
            loop.run_until_complete(send_to_all(msg))
    loop.close()


check_thread = threading.Thread(target=check_messages, name="check_messages")
check_thread.start()

asyncio.get_event_loop().run_until_complete(
    websockets.serve(echo,
                     '',
                     8765,
                     ssl=ssl_context,
                     process_request=seek_subprotocol,
                     subprotocols=['pass']))
asyncio.get_event_loop().run_forever()
