import requests
from bs4 import BeautifulSoup
import json

tokens = []

for x in range(1, 12):
    result = requests.get("https://etherscan.io/tokens?p=" + str(x))
    c = result.content

    soup = BeautifulSoup(c, "html.parser")

    samples = soup.find_all("tr")


    for sample in samples:
        try:
            if ("token" in sample.find_all("td")[1].find("a")['href']):
                tokens.append({"address": sample.find_all("td")[1].find("a")['href'].replace("/token/", ""), "image": sample.find_all("td")[1].find("img")['src'], "name": sample.find_all("td")[2].find("a").text})

        except Exception as e:
            continue


print(json.dumps(tokens))