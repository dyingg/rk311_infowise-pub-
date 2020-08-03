import pymongo, os
import subprocess
from Naked.toolshed.shell import execute_js
from AI_retrain import retrain
import shutil
import time, datetime


def put_in_file(file, data):
    with open(file, "a+", encoding="utf8") as f:
        f.write(str(data) + '\n')


def get_ip_from_file(file):
    ip_list = []
    f = open(file, encoding="utf8")

    for i in f.readlines():
        ip = i.strip()
        ip_list.append(ip)

    return ip_list


def run_scrapers(scraper_list):
    for i, scraper in enumerate(scraper_list, 1):
        print(i, 'node {}'.format(scraper))
        s = '"' + scraper + '"'
        success = execute_js(s)


def update_db(added, mycol, blacklist):

    query = {"blacklist": blacklist}
    mycol.delete_many(query)

    query_list = []
    for ip in added:
        query = {"blacklist": blacklist, "ip": ip, "cidp": blacklist+ip}
        query_list.append(query)

    mycol.insert_many(query_list)

    # print(len(query_list))
    # mycol.insert_many(query_list[:len(query_list) // 2])



def match_lists(name, old_list, new_list):
    old_map = {i: True for i in old_list}
    new_map = {i: True for i in new_list}
    logs = []
    old, new = [], []

    removed = 0
    for i in old_map:
        if i not in new_map:
            removed += 1
        old.append(i)

    logs.append("{} has removed {} IP addresses from their database".format(name, removed))

    added = 0
    for i in new_map:
        if i not in old_map:
            added += 1
        new.append(i)

    logs.append("{} has added {} IP addresses to their database".format(name, added))

    return old, new, logs


# def update_offline_database(path, file_list):
#     for file in file_list:
#         file_path = os.path.join(path, file)
#         if os.path.exists(file_path):
#             os.remove(file_path)
#
#         shutil.copy(, path)


database_conn = "mongodb+srv://SrutarshiGhosh:1234%40Tatai@cluster0.0tf4x.gcp.mongodb.net/test"


myclient = pymongo.MongoClient(database_conn)
mydb = myclient["copy"]
mycol = mydb["blacklist"]

# print(mycol)

file_path = "."
blacklist_folder = "scrapers/blacklists"
dynamic_lists = list(filter(lambda x: x.endswith(".js"), os.listdir(file_path)))
offline_blacklist_folder = "../whois/Blacklists/IPblacklists"
logs_folder = "Saved Logs"


# if os.path.exists("Logs.txt"):
#     os.remove("Logs.txt")


def update_database():
    updated_ips = []
    logs_list = []

    # run_scrapers(dynamic_lists)

    for lists in dynamic_lists:
        old_list = []
        name = lists.replace('.js', '.txt')
        path = os.path.join(blacklist_folder, name)
        new_list = get_ip_from_file(path)

        l = list(mycol.find({"blacklist": lists.replace('.js', '')}, {"ip": 1}))
        for i in l:
            ip = i["ip"]
            old_list.append(ip)


        remove, add, log = match_lists(name.replace('.txt', ''), old_list, new_list)
        updated_ips.extend(add)
        # update_db(add, mycol, name.replace('.txt', ''))

        logs_list.append(log)

    for log in logs_list:
        print(log[0], '\n', log[1], '\n')

    # print(updated_ips)
    # logs_file = os.path.join(logs_folder, "Log" + str(datetime.datetime.now()) + '.txt')
    #     # put_in_file(logs_file, log[0] + '\n' + log[1] + '\n')

    # retrain(updated_ips)



while True:
    dir_path = os.path.dirname(os.path.realpath(__file__))
    os.chdir(dir_path)

    update_database()
    time.sleep(30)



