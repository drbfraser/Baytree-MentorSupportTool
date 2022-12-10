import json

from socket import *

test_obj = {'testHttpPost': 'yesno!'}

client=socket(AF_INET, SOCK_STREAM)
print("tcp 1")
client.connect(("127.0.0.1", 24224))

client.sendall(json.dumps(test_obj).encode())
print("tcp 2")
client.close()

import requests

url = "http://127.0.0.1:24223"

print("http 1")
x = requests.post(url, json = test_obj)
print("http 2")
print(x.text)
