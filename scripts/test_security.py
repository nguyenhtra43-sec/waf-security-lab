import requests

target_url = "http://localhost:8080"

# Attack Payloads
sqli_payload = "' OR '1'='1"
xss_payload = "<script>alert(1)</script>"

print("[+] Testing WAF Defense...")

# Test SQLi
res_sql = requests.get(f"{target_url}/?id={sqli_payload}")
if res_sql.status_code == 403:
    print("[SUCCESS] SQL Injection blocked (403 Forbidden)")
else:
    print(f"[WARNING] SQLi status: {res_sql.status_code}")

# Test XSS
res_xss = requests.get(f"{target_url}/?q={xss_payload}")
if res_xss.status_code == 403:
    print("[SUCCESS] XSS Attack blocked (403 Forbidden)")
else:
    print(f"[WARNING] XSS status: {res_xss.status_code}")