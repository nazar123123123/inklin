from pymongo import MongoClient
import json
from datetime import datetime, timedelta

import pymongo
from bson.objectid import ObjectId

client = MongoClient("mongodb://mongo-mongodb:27017")

date_1_day_ago = datetime.now() - timedelta(days=1)

date_1_day_ago = datetime(2018, 5, 30)
db = client.visualise_ethereum

transactions = db.transactions

tokens = transactions.distinct("to",{"type" : "token", "block_time": {"$gte": date_1_day_ago}})


tokenlist = ""
for t in tokens:
    tokenlist = tokenlist + str(t) + "\n"

tokenfile = open("token_addresses.txt", "w") 
tokenfile.write(tokenlist)
tokenfile.close()
