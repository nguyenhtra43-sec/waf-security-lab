import requests
import time

target_url = "http://localhost:8080"

print("=" * 60)
print("🛡️  WAF SECURITY AUTOMATED TESTING SUITE")
print("Target:", target_url)
print("=" * 60)

# 1. Kịch bản 1: Kiểm thử SQL Injection (SQLi)
print("\n[+] 1. Testing Scenario 1: SQL Injection Defense...")
sqli_payload = "' OR '1'='1"
try:
    res_sql = requests.get(f"{target_url}/vulnerabilities/sqli/?id={sqli_payload}&Submit=Submit", timeout=5)
    if res_sql.status_code == 403:
        print("  [SUCCESS] SQL Injection blocked by ModSecurity (HTTP 403 Forbidden)")
    else:
        print(f"  [WARNING] SQLi not blocked! Status code: {res_sql.status_code}")
except Exception as e:
    print("  [ERROR] Connection failed:", e)

# 2. Kịch bản 2: Kiểm thử Cross-Site Scripting (XSS)
print("\n[+] 2. Testing Scenario 2: Cross-Site Scripting (XSS) Defense...")
xss_payload = "<script>alert(1)</script>"
try:
    res_xss = requests.get(f"{target_url}/vulnerabilities/xss_r/?name={xss_payload}", timeout=5)
    if res_xss.status_code == 403:
        print("  [SUCCESS] XSS Attack blocked by ModSecurity (HTTP 403 Forbidden)")
    else:
        print(f"  [WARNING] XSS not blocked! Status code: {res_xss.status_code}")
except Exception as e:
    print("  [ERROR] Connection failed:", e)

# 3. Kịch bản 3: Kiểm thử Tấn công vét cạn (Brute Force / Rate Limit)
print("\n[+] 3. Testing Scenario 3: Brute Force Authentication Defense...")
passwords = ["123456", "password", "admin123", "root", "toor", "qwerty"]
blocked = False
try:
    for pwd in passwords:
        res_brute = requests.get(
            f"{target_url}/vulnerabilities/brute/?username=admin&password={pwd}&Login=Login",
            timeout=5
        )
        if res_brute.status_code in [403, 429]:
            print(f"  [SUCCESS] Brute Force threshold reached! Blocked with HTTP {res_brute.status_code}")
            blocked = True
            break
        time.sleep(0.1)
    if not blocked:
        print("  [INFO] Brute Force finished. Rate limit threshold depending on CRS DOS rules.")
except Exception as e:
    print("  [ERROR] Connection failed:", e)

print("\n" + "=" * 60)
print("Security tests completed.")
print("=" * 60)