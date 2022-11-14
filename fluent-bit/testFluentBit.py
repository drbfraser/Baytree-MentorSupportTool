import json

from socket import *

client=socket(AF_INET, SOCK_STREAM)
print("tcp 1")
client.connect(("127.0.0.1", 24224))
string = {"test" : 123} # AFTER IT doesn't appear on fluent bit
client.sendall(json.dumps(string).encode())
print("tcp 2")
client.close()

import requests

url = "http://127.0.0.1:24223"
test_obj = {'testHttpPost': 'yes!'}
print("http 1")
x = requests.post(url, json = test_obj)
print("http 2")
print(x.text)
