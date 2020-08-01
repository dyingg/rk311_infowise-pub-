import ipaddress
import sys


def check_version(ip1, ip2):
    return ip1.version == ip2.version

def binary_ip_search(ip, start_ip_list, end_ip_list, n):
    left, right = 0, n

    while left <= right:
        mid = (left + right) // 2

        if not check_version(ip, start_ip_list[mid]):
            if int(ip.version) == 4:
                right = mid - 1
            else:
                left = mid + 1
        elif not check_version(ip, end_ip_list[mid]):
            if int(ip.version) == 6:
                left = mid + 1
            else:
                right = mid - 1

        elif ip < start_ip_list[mid]:
            right = mid - 1
        elif ip > end_ip_list[mid]:
            left = mid + 1
        else:
            return mid

    return False


def get_data_from_file(file):
    start_ip_list = []
    end_ip_list = []
    asn_list = []
    org_list = []
    
    f = open(file, encoding="utf8")
    
    for i in f.readlines():
        data = i.strip().split('    ')
        start_ip_list.append(ipaddress.ip_address(data[0]))
        end_ip_list.append(ipaddress.ip_address(data[1]))
        asn_list.append(data[2])
        org_list.append(data[3])
        
    return start_ip_list, end_ip_list, asn_list, org_list


ip_search_file = "./Blacklists/ip_search_database.txt"


# print(df.head())
start_ip_list, end_ip_list, asn_list, org_list = get_data_from_file(ip_search_file)
n = len(start_ip_list)


ip = sys.argv[1]
ip = ipaddress.ip_address(ip)

ind = binary_ip_search(ip, start_ip_list, end_ip_list, n)
if ind:
    asn = asn_list[ind]
    hostName = org_list[ind]
    
    print(asn, hostName)
else:
    print(-1)

sys.stdout.flush()