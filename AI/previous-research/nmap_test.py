import nmap
import json

def nmap_test(ip_addr, port_list, ip6=False):
    nm = nmap.PortScanner()
    port_string = "1-10000"# port_parser(port_list)
    
    if ip6:
        nm.scan(ip_addr, port_string, '-sV -T5 --script=banner -6')
    else:
        nm.scan(ip_addr, port_string, '-sV -T5 --script=banner')

    try:
        print(nm.command_line())
        print(nm.scaninfo())
        state = nm[ip_addr].state()
        # print("Ip Status: ", state)
        print(nm[ip_addr])

    except:
        return {'error': "IP may be Down!"}


    open_ports, filtered_ports = [], []

    try:
        for port in nm[ip_addr]['tcp'].keys():
            if 'filtered' in nm[ip_addr]['tcp'][port]['state']:
                filtered_ports.append(port)
            elif 'open' in nm[ip_addr]['tcp'][port]['state']:
                open_ports.append(port)

    except:
        pass

    try:
        for port in nm[ip_addr]['udp'].keys():
            if 'filtered' in nm[ip_addr]['udp'][port]['state']:
                filtered_ports.append(port)
            elif 'open' in nm[ip_addr]['udp'][port]['state']:
                open_ports.append(port)
    except:
        pass

    # print("Open Ports: ", len(open_ports), open_ports)
    # print("Filtered Ports: ", len(filtered_ports), filtered_ports)
    #
    # score = 0
    # for port in open_ports:
    #     score += get_weight(port_list, port)
    #
    # for port in filtered_ports:
    #     score += get_weight(port_list, port) // 2
    #
    # print(score)
    #
    return {'open ports': open_ports,
            'filtered ports': filtered_ports,
            'state': state,
            }



def port_parser(port_list):
    s = "T:"
    for elem in port_list:
        if port_list[elem]['protocol'] == 'tcp':
            s += str(elem) + ','

    s += 'U:'

    for elem in port_list:
        if port_list[elem]['protocol'] == 'udp':
            s += str(elem) + ','

    return s


# [{"port": 1008, "protocol": "tcp"}]
# port_list = {
#     {1723: {'protocol': 'tcp', 'weight': 10},
#     {443: {'protocol': 'tcp', 'weight': 1000},
#     {4789: {'protocol': 'udp'},
#     {500: {'protocol': 'udp'},
#     {1701: {'protocol': 'udp'},
#     {1194: {'protocol': 'udp'},
# }


def get_port_list(no=32, all=False):
    data = json.load(open('port_data.json'))
    if all:
        return data
    else:
        return data[:min(no, len(data))]


def get_weight(port_list, port_no):
    return int(port_list[str(port_no)]['weight'])

def get_total_score(file='total_weight_score.json'):
    data = json.load(open(file))
    return int(data["Total Score"])


if __name__ == '__main__':
    port_list = "1-10000"
    print(port_parser(get_port_list(all=True)))
    #get_port_list(all=True)
    # f = open('ips.txt')
    #
    # for i in f.readlines():
    #     ip = i.strip()
    #     ip6 = False
    #     x = ip.split(':')
    #     if len(x) > 1:
    #         ip6 = True
    #
    #     out = open('open_filtered_ports.txt', 'a+')
    #
    #     try:
    #         open_ports, filtered_ports, state = nmap_test(ip, port_list, ip6=ip6)
    #
    #         out.write(ip + '\n')
    #         out.write("Status: {}\n".format(state.upper()))
    #
    #         if open_ports:
    #             out.write("Open Ports: ")
    #             for p in open_ports:
    #                 out.write(str(p) + ' ')
    #             out.write('\n')
    #
    #         if filtered_ports:
    #             out.write("Filtered Ports: ")
    #             for p in filtered_ports:
    #                 out.write(str(p) + ' ')
    #             out.write('\n')
    #
    #         out.write('\n')
    #
    #     except:
    #         out.write(ip + '\n')
    #         out.write("Status: DOWN\n")
    #
    #     out.close()
    nmap_test('193.47.236.46', port_list, ip6=False)
