import ipaddress
import os
import sys


def get_ip_from_file(file, line_no=False, end_line=False):
    ip_list = []
    f = open(file, encoding="utf8")

    if line_no == False:
        for i in f.readlines():
            ip = i.strip()
            ip_list.append(ip)

    elif end_line == False:
        for i in f.readlines()[line_no:]:
            ip = i.strip()
            ip_list.append(ip)

    else:
        for i in f.readlines()[line_no: end_line]:
            ip = i.strip()
            ip_list.append(ip)

    f.close()
    return ip_list


def is_ip_in_range(ip, start_ip, end_ip, ip_range=False):
    if ip_range:
        return ip in ip_range
    else:
        if ip.version != start_ip.version or ip.version != end_ip.version:
            return False

        return ip >= start_ip and ip <= end_ip


def check_ip_in_blacklist(ip, ip_list):
    for i in ip_list:
        x = i.strip().split()
        # print(x)
        try:
            if len(x) == 2:
                start_ip = ipaddress.ip_address(x[0].strip())
                end_ip = ipaddress.ip_address(x[1].strip())
                if is_ip_in_range(ip, start_ip, end_ip):
                    return True
            else:
                if str(ip) == str(x[0]):
                    return True
        except:
            pass

    return False


try:
    curr_dir = os.getcwd()
    # parent_dir = os.path.dirname(curr_dir)
    folder = os.path.join(curr_dir, "Blacklists/IPblacklists")
    file_lists = os.listdir(folder)
    count = int(sys.argv[2].strip())
    # print(file_lists)

    ip = sys.argv[1].strip()
    ip = ipaddress.ip_address(ip)

    for file in file_lists:
        if not file.endswith(".txt"):
            continue
        file_path = os.path.join(folder, file)
        ip_list = get_ip_from_file(file_path)
        if check_ip_in_blacklist(ip, ip_list):
            count += 1

    print(count)
    sys.stdout.flush()
except Exception as e:
    print(e)
    sys.stdout.flush()
