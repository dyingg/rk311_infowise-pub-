from nmap_test import *


ip_list = []
ip_file = open('ips.txt')

for ip in ip_file.readlines():
    ip_list.append(ip)

print(*ip_list)
start = 25

for i in ip_list[start:]:
    f = open('stored_data.txt', 'a')
    x = i.strip().split()
    if len(x) == 2:
        continue
    ip = x[0]
    status, open_ports = nmap_test(ip, '1')
    open_ports_string = "none"
    if open_ports != []:
        open_ports_string = ""
        for port in open_ports:
            open_ports_string += str(port) + " "

    data = "IP: {}\nStatus: {}\nOpen Ports: {}\n\n".format(ip, status, open_ports_string)
    print(data)
    f.write(data)
    f.close()

"""
109.123.74.94
149.28.182.155
"""