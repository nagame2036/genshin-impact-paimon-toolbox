import os

items = [
    {
      "id": 50000,
      "name": "anemo-slime",
      "group": 500
    },
    {
      "id": 50001,
      "name": "large-anemo-slime",
      "group": 500
    },
    {
      "id": 50002,
      "name": "geo-slime",
      "group": 500
    },
    {
      "id": 50003,
      "name": "large-geo-slime",
      "group": 500
    },
    {
      "id": 50004,
      "name": "electro-slime",
      "group": 500
    },
    {
      "id": 50005,
      "name": "large-electro-slime",
      "group": 500
    },
    {
      "id": 50006,
      "name": "mutant-electro-slime",
      "group": 500
    },
    {
      "id": 50007,
      "name": "dendro-slime",
      "group": 500
    },
    {
      "id": 50008,
      "name": "large-dendro-slime",
      "group": 500
    },
    {
      "id": 50009,
      "name": "hydro-slime",
      "group": 500
    },
    {
      "id": 50010,
      "name": "large-hydro-slime",
      "group": 500
    },
    {
      "id": 50011,
      "name": "pyro-slime",
      "group": 500
    },
    {
      "id": 50012,
      "name": "large-pyro-slime",
      "group": 500
    },
    {
      "id": 50013,
      "name": "cryo-slime",
      "group": 500
    },
    {
      "id": 50014,
      "name": "large-cryo-slime",
      "group": 500
    },
    {
      "id": 50100,
      "name": "hilichurl",
      "group": 501
    },
    {
      "id": 50101,
      "name": "hilichurl-fighter",
      "group": 501
    },
    {
      "id": 50102,
      "name": "wooden-shield-hilichurl-guard",
      "group": 501
    },
    {
      "id": 50103,
      "name": "rock-shield-hilichurl-guard",
      "group": 501
    },
    {
      "id": 50104,
      "name": "rock-shield-hilichurl-guard",
      "group": 501
    },
    {
      "id": 50105,
      "name": "pyro-hilichurl-berserker",
      "group": 501
    },
    {
      "id": 50106,
      "name": "pyro-hilichurl-grenadier",
      "group": 501
    },
    {
      "id": 50107,
      "name": "unusual-hilichurl",
      "group": 501
    },
    {
      "id": 50200,
      "name": "anemo-samachurl",
      "group": 502
    },
    {
      "id": 50201,
      "name": "geo-samachurl",
      "group": 502
    },
    {
      "id": 50202,
      "name": "dendro-samachurl",
      "group": 502
    },
    {
      "id": 50203,
      "name": "hydro-samachurl",
      "group": 502
    },
    {
      "id": 50204,
      "name": "hilichurl-shooter",
      "group": 503
    },
    {
      "id": 50300,
      "name": "electro-hilichurl-shooter",
      "group": 503
    },
    {
      "id": 50301,
      "name": "pyro-hilichurl-shooter",
      "group": 503
    },
    {
      "id": 50302,
      "name": "cryo-hilichurl-shooter",
      "group": 503
    },
    {
      "id": 50400,
      "name": "electro-cicin",
      "group": 504
    },
    {
      "id": 50401,
      "name": "hydro-cicin",
      "group": 504
    },
    {
      "id": 50500,
      "name": "fatui-skirmisher-anemoboxer-vanguard",
      "group": 505
    },
    {
      "id": 50501,
      "name": "fatui-skirmisher-pryoslinger-bracer",
      "group": 505
    },
    {
      "id": 50502,
      "name": "fatui-skirmisher-cryogunner-legionnaire",
      "group": 505
    },
    {
      "id": 50503,
      "name": "fatui-skirmisher-hydrogunner-legionnaire",
      "group": 505
    },
    {
      "id": 50504,
      "name": "fatui-skirmisher-electrohammer-vanguard",
      "group": 505
    },
    {
      "id": 50505,
      "name": "fatui-skirmisher-geochanter-bracer",
      "group": 505
    },
    {
      "id": 50600,
      "name": "treasure-hoarder-scout",
      "group": 506
    },
    {
      "id": 50601,
      "name": "treasure-hoarder-crusher",
      "group": 506
    },
    {
      "id": 50602,
      "name": "treasure-hoarder-gravedigger",
      "group": 506
    },
    {
      "id": 50603,
      "name": "treasure-hoarder-marksman",
      "group": 506
    },
    {
      "id": 50604,
      "name": "treasure-hoarder-handyman",
      "group": 506
    },
    {
      "id": 50605,
      "name": "treasure-hoarder-pugilist",
      "group": 506
    },
    {
      "id": 50606,
      "name": "treasure-hoarder-electro-potioner",
      "group": 506
    },
    {
      "id": 50607,
      "name": "treasure-hoarder-hydro-potioner",
      "group": 506
    },
    {
      "id": 50608,
      "name": "treasure-hoarder-pyro-potioner",
      "group": 506
    },
    {
      "id": 50609,
      "name": "treasure-hoarder-cryo-potioner",
      "group": 506
    },
    {
      "id": 50610,
      "name": "treasure-hoarder-seaman",
      "group": 506
    },
    {
      "id": 50700,
      "name": "pyro-whopperflower",
      "group": 507
    },
    {
      "id": 50701,
      "name": "cryo-whopperflower",
      "group": 507
    },
    {
      "id": 100000,
      "name": "blazing-axe-mitachurl",
      "group": 1000
    },
    {
      "id": 100001,
      "name": "wooden-shieldwall-mitachurl",
      "group": 1000
    },
    {
      "id": 100002,
      "name": "rock-shieldwall-mitachurl",
      "group": 1000
    },
    {
      "id": 100003,
      "name": "stonehide-lawachurl",
      "group": 1000
    },
    {
      "id": 100100,
      "name": "hydro-abyss-mage",
      "group": 1001
    },
    {
      "id": 100101,
      "name": "pyro-abyss-mage",
      "group": 1001
    },
    {
      "id": 100102,
      "name": "cryo-abyss-mage",
      "group": 1001
    },
    {
      "id": 100200,
      "name": "ruin-guard",
      "group": 1002
    },
    {
      "id": 100201,
      "name": "ruin-hunter",
      "group": 1002
    },
    {
      "id": 100300,
      "name": "fatui-electro-cicin-mage",
      "group": 1003
    },
    {
      "id": 100400,
      "name": "fatui-pryo-agent",
      "group": 1004
    },
    {
      "id": 100500,
      "name": "geovishap-hatchling",
      "group": 1005
    },
    {
      "id": 100600,
      "name": "eye-of-the-storm",
      "group": 1006
    }
  ]

path = os.path.abspath('.')
for _, _, files in os.walk(path):
  for file in files:
    file_split = file.split('.')
    for item in items:
      if (file_split[0] == item["name"]):
        os.rename(os.path.join(path, file), os.path.join(path, str(item["id"]) + '.png'))