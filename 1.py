import socket

def check_dns_records(domain):
    try:
        a_records = socket.gethostbyname_ex(domain)
    except socket.gaierror:
        a_records = None
    try:
        aaaa_records = socket.getaddrinfo(domain, None, socket.AF_INET6)
    except socket.gaierror:
        aaaa_records = None
    return a_records, aaaa_records

rustgamestore_a, rustgamestore_aaaa = check_dns_records('rustgamestore.ru')
www_rustgamestore_a, www_rustgamestore_aaaa = check_dns_records('www.rustgamestore.ru')

print(rustgamestore_a, rustgamestore_aaaa, www_rustgamestore_a, www_rustgamestore_aaaa)
