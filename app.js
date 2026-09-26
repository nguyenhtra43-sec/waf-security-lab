// ==========================================
// WAF SECURITY LAB - INTERACTIVE SIMULATOR LOGIC
// Author: Nguyen Huong Tra (nguyenhtra43-sec)
// ==========================================

// Global State
let currentScenario = 'sqli';
let isWAFEnabled = true;
let currentCodeTab = 'compose';

// 3 Attack Scenarios Database
const scenariosData = {
  sqli: {
    key: 'sqli',
    title: 'Kịch bản 1: SQL Injection (SQLi)',
    desc: 'Chèn chuỗi logic SQL vào tham số truy vấn nhằm vô hiệu hóa mệnh đề WHERE và ép cơ sở dữ liệu trả về toàn bộ dữ liệu bảng người dùng trong DVWA.',
    endpoint: '/vulnerabilities/sqli/?id=',
    method: 'GET',
    rule: 'REQUEST-942-APPLICATION-ATTACK-SQLI (Rule 942100 / 942140 / 949110)',
    blockedScore: 11,
    ruleId: '949110',
    ruleCategory: 'REQUEST-942-APPLICATION-ATTACK-SQLI.conf',
    ruleDetails: 'libinjection SQLi Detection + Anomaly Score Exceeded',
    presets: [
      { name: "DVWA Wildcard Bypass", payload: "%' OR '1'='1" },
      { name: "Auth Bypass Classic", payload: "' OR '1'='1" },
      { name: "UNION Select Dump", payload: "' UNION SELECT 1, user, password FROM users #" },
      { name: "Yêu cầu bình thường", payload: "1" }
    ],
    vulnerableHtml: `
      <div class="w-full bg-[#f8fafc] text-slate-900 p-4 rounded border border-slate-300 font-sans text-xs">
        <div class="border-b pb-2 mb-3 flex items-center justify-between">
          <span class="font-bold text-red-600 flex items-center gap-1.5">
            <i class="fa-solid fa-triangle-exclamation"></i> LỖ HỔNG XẢY RA: TOÀN BỘ CƠ SỞ DỮ LIỆU ĐÃ BỊ TRÍCH XUẤT!
          </span>
          <span class="bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono text-[10px] font-bold">HTTP 200 OK</span>
        </div>
        <div class="font-mono text-[11px] text-slate-700 mb-2">Query executed: SELECT first_name, last_name FROM users WHERE user_id = '%' OR '1'='1'</div>
        <div class="space-y-2 bg-white p-3 rounded border border-slate-200">
          <div class="p-1.5 bg-red-50 border-l-4 border-red-500"><strong class="text-red-700">ID: %' OR '1'='1</strong><br>First name: <span class="font-bold">admin</span> | Surname: <span class="font-bold">admin</span></div>
          <div class="p-1.5 bg-red-50 border-l-4 border-red-500"><strong class="text-red-700">ID: %' OR '1'='1</strong><br>First name: <span class="font-bold">Gordon</span> | Surname: <span class="font-bold">Brown</span></div>
          <div class="p-1.5 bg-red-50 border-l-4 border-red-500"><strong class="text-red-700">ID: %' OR '1'='1</strong><br>First name: <span class="font-bold">Hack</span> | Surname: <span class="font-bold">Me</span></div>
          <div class="p-1.5 bg-red-50 border-l-4 border-red-500"><strong class="text-red-700">ID: %' OR '1'='1</strong><br>First name: <span class="font-bold">Pablo</span> | Surname: <span class="font-bold">Picasso</span></div>
          <div class="p-1.5 bg-red-50 border-l-4 border-red-500"><strong class="text-red-700">ID: %' OR '1'='1</strong><br>First name: <span class="font-bold">Bob</span> | Surname: <span class="font-bold">Smith</span></div>
        </div>
      </div>
    `
  },
  xss: {
    key: 'xss',
    title: 'Kịch bản 2: Cross-Site Scripting (Reflected XSS)',
    desc: 'Chèn mã JavaScript độc hại vào form tìm kiếm. Do ứng dụng không lọc dữ liệu đầu ra, trình duyệt nạn nhân tự động thực thi script và rò rỉ cookie phiên làm việc.',
    endpoint: '/vulnerabilities/xss_r/?name=',
    method: 'GET',
    rule: 'REQUEST-941-APPLICATION-ATTACK-XSS (Rule 941100 / 941110 / 949110)',
    blockedScore: 8,
    ruleId: '941100',
    ruleCategory: 'REQUEST-941-APPLICATION-ATTACK-XSS.conf',
    ruleDetails: 'XSS Filter - Category 1: Script Tag Vector Detected',
    presets: [
      { name: "Alert Script Tag", payload: "<script>alert('XSS_Exploit')<\/script>" },
      { name: "Image Onerror Vector", payload: "<img src=x onerror=alert(document.cookie)>" },
      { name: "SVG Event Handler", payload: "<svg/onload=confirm('Session_Stolen')>" },
      { name: "Nội dung an toàn", payload: "<b>Hello World</b>" }
    ],
    vulnerableHtml: `
      <div class="w-full bg-[#f8fafc] text-slate-900 p-4 rounded border border-slate-300 font-sans text-xs">
        <div class="border-b pb-2 mb-3 flex items-center justify-between">
          <span class="font-bold text-red-600 flex items-center gap-1.5">
            <i class="fa-solid fa-bug"></i> MÃ JAVASCRIPT ĐÃ THỰC THI TRÊN TRÌNH DUYỆT!
          </span>
          <span class="bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono text-[10px] font-bold">HTTP 200 OK</span>
        </div>
        <div class="bg-white p-4 rounded-lg border border-slate-200 text-center">
          <div class="inline-block p-4 bg-amber-50 border border-amber-300 rounded-lg shadow-md mb-2">
            <div class="text-amber-800 font-bold text-sm mb-1 flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-triangle-exclamation"></i> alert(document.cookie) Kích Hoạt!
            </div>
            <div class="font-mono text-xs text-slate-700 bg-white p-2 rounded border border-amber-200">
              PHPSESSID=8e4f1a23c0b56d98e721; security=low
            </div>
          </div>
          <p class="text-slate-500 text-[11px]">Kẻ tấn công có thể chiếm đoạt Cookie phiên này để mạo danh người dùng hợp lệ.</p>
        </div>
      </div>
    `
  },
  brute: {
    key: 'brute',
    title: 'Kịch bản 3: Tấn công vét cạn (Brute Force Authentication)',
    desc: 'Sử dụng từ điển mật khẩu gửi yêu cầu đăng nhập dồn dập (Burst Attack). Khi không có WAF, kẻ tấn công sẽ vét cạn thành công mật khẩu của tài khoản quản trị.',
    endpoint: '/vulnerabilities/brute/?username=admin&password=',
    method: 'GET',
    rule: 'REQUEST-912-DOS-PROTECTION / RATE-LIMIT (Rule 912100 / 949110)',
    blockedScore: 10,
    ruleId: '912100',
    ruleCategory: 'REQUEST-912-DOS-PROTECTION.conf',
    ruleDetails: 'Rate limit breached for IP (Requests > 10 in 5s)',
    presets: [
      { name: "Dictionary Burst (10 req/s)", payload: "pass123&Login=Login" },
      { name: "Thử Default Credential", payload: "password&Login=Login" },
      { name: "Thử Admin123", payload: "admin123&Login=Login" },
      { name: "Đăng nhập bình thường", payload: "correctpass&Login=Login" }
    ],
    vulnerableHtml: `
      <div class="w-full bg-[#f8fafc] text-slate-900 p-4 rounded border border-slate-300 font-sans text-xs">
        <div class="border-b pb-2 mb-3 flex items-center justify-between">
          <span class="font-bold text-red-600 flex items-center gap-1.5">
            <i class="fa-solid fa-unlock-keyhole"></i> KHÔNG CÓ GIỚI HẠN TẦN SUẤT - MẬT KHẨU ĐÃ BỊ TÌM RA!
          </span>
          <span class="bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono text-[10px] font-bold">HTTP 200 OK</span>
        </div>
        <div class="bg-white p-3 rounded border border-slate-200 space-y-1.5">
          <div class="font-mono text-[11px] text-slate-500">[Attempt #14] admin:123456 -> 200 OK (Failed)</div>
          <div class="font-mono text-[11px] text-slate-500">[Attempt #15] admin:qwerty -> 200 OK (Failed)</div>
          <div class="font-mono text-[11px] text-emerald-700 font-bold bg-emerald-50 p-2 rounded border border-emerald-200">
            [Attempt #16] admin:password -> 200 OK (SUCCESS! Welcome to the password protected area admin!)
          </div>
        </div>
      </div>
    `
  }
};

// Code Snippets Data
const codeFiles = {
  compose: `services:
  # Lớp ứng dụng mục tiêu (DVWA)
  vulnerable-web:
    image: vulnerables/web-dvwa
    container_name: dvwa-target
    restart: always
    environment:
      - MYSQL_USER=user
      - MYSQL_PASSWORD=pass

  # Lớp bảo vệ (WAF ModSecurity v3 + Nginx)
  waf:
    image: owasp/modsecurity-crs:nginx
    container_name: waf-server
    ports:
      - "8080:8080" # Ánh xạ cổng 8080 của Host vào 8080 của Container
    environment:
      - BACKEND=http://dvwa-target:80 # Trỏ luồng traffic về ứng dụng
      - PROXY_SSL=off
      - PORT=8080 # Đổi cổng lắng nghe của Nginx bên trong
      - PARANOIA=1 # Mức độ kiểm soát nghiêm ngặt cơ bản
      - ANOMALY_INBOUND_THRESHOLD=5 # Ngưỡng điểm để chặn tấn công
      - MODSEC_RULE_ENGINE=on
    depends_on:
      - vulnerable-web`,

  nginx: `server {
    listen 8080 default_server;
    listen [::]:8080 default_server;

    # Cho phép Nginx nạp tệp cấu hình ModSecurity do container tự động sinh ra
    include /etc/nginx/modsecurity.d/include.conf;

    location / {
        proxy_pass http://dvwa-target:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}`,

  python: `import requests
import time

target_url = "http://localhost:8080"

# 1. Kiểm thử SQL Injection
res_sql = requests.get(f"{target_url}/vulnerabilities/sqli/?id=%27%20OR%20%271%27=%271&Submit=Submit")
if res_sql.status_code == 403:
    print("[SUCCESS] SQL Injection blocked by ModSecurity (403 Forbidden)")

# 2. Kiểm thử XSS Attack
res_xss = requests.get(f"{target_url}/vulnerabilities/xss_r/?name=<script>alert(1)<\\/script>")
if res_xss.status_code == 403:
    print("[SUCCESS] XSS Attack blocked by ModSecurity (403 Forbidden)")

# 3. Kiểm thử Brute Force Burst
for pwd in ["123456", "password", "admin"]:
    res_b = requests.get(f"{target_url}/vulnerabilities/brute/?username=admin&password={pwd}&Login=Login")
    if res_b.status_code in [403, 429]:
        print("[SUCCESS] Rate limiting threshold breached!")
        break`
};

// Initial Logs
const initialLogs = [
  {
    tag: 'sqli',
    type: 'error',
    time: '2026/05/01 09:30:30',
    content: `2026/05/01 09:30:30 [error] 505#505: *6 [client 172.18.0.1] ModSecurity: Access denied with code 403 (phase 2). Matched "Operator 'Ge' with parameter '5' against variable 'TX:ANOMALY_SCORE' (Value: '11' ) [file "/etc/modsecurity.d/owasp-crs/rules/REQUEST-949-BLOCKING-EVALUATION.conf"] [line "81"] [id "949110"] [rev ""] [msg "Inbound Anomaly Score Exceeded (Total Score: 11)"] [data ""] [severity "2"] [ver "OWASP_CRS/3.3.9"] [maturity "0"] [accuracy "0"] [tag "modsecurity"] [tag "application-multi"] [tag "language-multi"] [tag "platform-multi"] [tag "attack-generic"] [hostname "127.0.0.1"] [uri "/vulnerabilities/sqli/"] [unique_id "177762783049.179535"] [ref ""], client: 172.18.0.1, server: localhost, request: "GET /vulnerabilities/sqli/?id=%2527+OR+%271%27%3D%271&Submit=Submit HTTP/1.1", host: "127.0.0.1:8080"`
  },
  {
    tag: 'sqli',
    type: 'info',
    time: '2026/05/01 09:30:30',
    content: `[notice] Matched Rule [id "942100"] [msg "SQL Injection Attack Detected via libinjection"] [data "Matched Data: 1'='1 found within ARGS:id: %' OR '1'='1"] [anomaly_score "+5"]`
  },
  {
    tag: 'xss',
    type: 'error',
    time: '2026/05/01 09:35:12',
    content: `2026/05/01 09:35:12 [error] 505#505: *12 [client 172.18.0.1] ModSecurity: Access denied with code 403 (phase 2). Matched "Operator 'Ge' with parameter '5' against variable 'TX:ANOMALY_SCORE' (Value: '8' ) [file "/etc/modsecurity.d/owasp-crs/rules/REQUEST-949-BLOCKING-EVALUATION.conf"] [line "81"] [id "949110"] [msg "Inbound Anomaly Score Exceeded (Total Score: 8)"] [uri "/vulnerabilities/xss_r/"] [request: "GET /vulnerabilities/xss_r/?name=%3Cscript%3Ealert(1)%3C/script%3E HTTP/1.1"]`
  },
  {
    tag: 'brute',
    type: 'error',
    time: '2026/05/01 09:40:05',
    content: `2026/05/01 09:40:05 [error] 505#505: *45 [client 172.18.0.1] ModSecurity: Access denied with code 403 (phase 1). Matched "Rate limit breached for IP 172.18.0.1 (Requests > 10 in 5s)" [file "/etc/modsecurity.d/owasp-crs/rules/REQUEST-912-DOS-PROTECTION.conf"] [id "912100"] [uri "/vulnerabilities/brute/"]`
  }
];

let logStore = [...initialLogs];

// ----------------------------------------------------
// UI FUNCTIONS
// ----------------------------------------------------

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  renderScenarioUI();
  updateToggleUI();
  renderLogs('all');
  switchCode('compose');
});

// Switch Scenario (sqli | xss | brute)
function switchScenario(scenarioKey) {
  if (!scenariosData[scenarioKey]) return;
  currentScenario = scenarioKey;

  // Update scenario tabs appearance
  const tabKeys = ['sqli', 'xss', 'brute'];
  tabKeys.forEach(key => {
    const tabEl = document.getElementById(`tab-${key}`);
    if (tabEl) {
      if (key === scenarioKey) {
        tabEl.className = 'scenario-tab px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all bg-cyan-600 text-white shadow cursor-pointer';
      } else {
        tabEl.className = 'scenario-tab px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all text-slate-400 hover:text-white cursor-pointer';
      }
    }
  });

  renderScenarioUI();
  executeAttackSimulation();
}

// Render Scenario UI Details
function renderScenarioUI() {
  const data = scenariosData[currentScenario];
  const icon = currentScenario === 'sqli' ? 'database' : currentScenario === 'xss' ? 'code' : 'key';

  const titleEl = document.getElementById('scenario-title');
  if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-${icon} text-cyan-400"></i> ${data.title}`;

  const descEl = document.getElementById('scenario-desc');
  if (descEl) descEl.innerText = data.desc;

  const endpointEl = document.getElementById('target-endpoint');
  if (endpointEl) endpointEl.innerText = data.endpoint;

  const methodEl = document.getElementById('http-method');
  if (methodEl) methodEl.innerText = data.method;

  const ruleEl = document.getElementById('rule-inspect');
  if (ruleEl) ruleEl.innerText = data.rule;

  // Render Presets
  const presetContainer = document.getElementById('payload-presets');
  if (presetContainer) {
    presetContainer.innerHTML = '';
    data.presets.forEach((preset, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `p-2 rounded text-left text-[11px] font-mono border transition-all cursor-pointer ${
        idx === 0 ? 'bg-cyan-950/80 border-cyan-700 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
      }`;
      btn.innerHTML = `<div class="font-semibold truncate">${preset.name}</div><div class="text-[10px] text-slate-500 truncate">${escapeHtml(preset.payload)}</div>`;
      btn.onclick = () => {
        const inputEl = document.getElementById('payload-input');
        if (inputEl) inputEl.value = preset.payload;

        // Highlight selected preset button
        const allBtns = presetContainer.querySelectorAll('button');
        allBtns.forEach(b => {
          b.className = 'p-2 rounded text-left text-[11px] font-mono border bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer';
        });
        btn.className = 'p-2 rounded text-left text-[11px] font-mono border bg-cyan-950/80 border-cyan-700 text-cyan-300 cursor-pointer';

        executeAttackSimulation();
      };
      presetContainer.appendChild(btn);
    });
  }

  // Set default payload into input
  const inputEl = document.getElementById('payload-input');
  if (inputEl && data.presets.length > 0) {
    inputEl.value = data.presets[0].payload;
  }
}

// Master Toggle WAF
function toggleWAF() {
  isWAFEnabled = !isWAFEnabled;
  updateToggleUI();
  executeAttackSimulation();
}

function updateToggleUI() {
  const toggleBtn = document.getElementById('waf-toggle-btn');
  const toggleCircle = document.getElementById('waf-toggle-circle');
  const statusText = document.getElementById('waf-status-text');

  if (!toggleBtn || !toggleCircle || !statusText) return;

  if (isWAFEnabled) {
    toggleBtn.style.backgroundColor = '#059669'; // Emerald 600
    toggleCircle.style.transform = 'translateX(28px)';
    statusText.style.color = '#34d399';
    statusText.innerText = 'BẬT (ModSecurity Active)';
  } else {
    toggleBtn.style.backgroundColor = '#dc2626'; // Red 600
    toggleCircle.style.transform = 'translateX(4px)';
    statusText.style.color = '#f87171';
    statusText.innerText = 'TẮT (Hệ thống không bảo vệ)';
  }
}

// Execute Simulation
function executeAttackSimulation() {
  const data = scenariosData[currentScenario];
  const inputEl = document.getElementById('payload-input');
  const payload = inputEl ? inputEl.value.trim() : '';

  const statusBadge = document.getElementById('status-badge');
  const latency = document.getElementById('response-latency');
  const mockupUrl = document.getElementById('mockup-url');
  const screenBlocked = document.getElementById('screen-blocked');
  const screenVulnerable = document.getElementById('screen-vulnerable');
  const scoreText = document.getElementById('score-text');
  const scoreBar = document.getElementById('score-bar');

  // Random Latency simulation
  if (latency) latency.innerText = `${Math.floor(Math.random() * 15) + 10}ms`;
  if (mockupUrl) mockupUrl.innerText = `http://localhost:8080${data.endpoint}${encodeURIComponent(payload)}`;

  const isNormal = payload === "1" || payload === "<b>Hello World</b>" || payload === "correctpass&Login=Login";

  if (isWAFEnabled && !isNormal) {
    // ----------------------------------------
    // CASE 1: BLOCKED BY WAF (403 FORBIDDEN)
    // ----------------------------------------
    if (statusBadge) {
      statusBadge.className = 'px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-950 text-rose-400 border border-rose-800 flex items-center gap-1';
      statusBadge.innerHTML = '<i class="fa-solid fa-shield-halved"></i> 403 Forbidden';
    }

    if (screenBlocked) {
      screenBlocked.classList.remove('hidden');
      // Update block screen with scenario-specific rule and score
      screenBlocked.innerHTML = `
        <div class="text-center py-6 px-4">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center text-3xl mb-4 shadow-lg shadow-rose-900/30">
            <i class="fa-solid fa-ban"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-1">403 Forbidden - Access Denied</h3>
          <p class="text-xs font-mono text-rose-300 mb-3">Tường Lửa Tầng Ứng Dụng (WAF) Đã Ngăn Chặn Yêu Cầu Này</p>
          <div class="max-w-md mx-auto bg-slate-950 p-3 rounded-lg border border-slate-800 text-left text-xs font-mono space-y-1.5 text-slate-400">
            <div><strong class="text-slate-300">WAF Engine:</strong> ModSecurity v3 / OWASP CRS 3.3.10</div>
            <div><strong class="text-slate-300">Blocking Rule ID:</strong> <span class="text-amber-400 font-bold">${data.ruleId}</span> (${data.ruleDetails})</div>
            <div><strong class="text-slate-300">File Quy Tắc:</strong> <span class="text-cyan-400">${data.ruleCategory}</span></div>
            <div><strong class="text-slate-300">Điểm Đánh Giá:</strong> <span class="text-rose-400 font-bold">${data.blockedScore}</span> (Ngưỡng cho phép: 5)</div>
            <div><strong class="text-slate-300">Hành động:</strong> Giao dịch bị hủy ngay tại Phase 2 trước khi tới DVWA Backend.</div>
          </div>
        </div>
      `;
    }

    if (screenVulnerable) screenVulnerable.classList.add('hidden');

    if (scoreText) {
      scoreText.innerText = `${data.blockedScore} / 5 (Vượt ngưỡng)`;
      scoreText.className = 'font-bold text-rose-400';
    }
    if (scoreBar) {
      scoreBar.style.width = '100%';
      scoreBar.style.backgroundColor = '#e11d48';
    }

    // Add entry to terminal log
    logStore.unshift({
      tag: currentScenario,
      type: 'error',
      time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      content: `[client 172.18.0.1] ModSecurity: Access denied with code 403 (phase 2). Matched "Operator 'Ge' with parameter '5' against variable 'TX:ANOMALY_SCORE' (Value: '${data.blockedScore}' ) [file "/etc/modsecurity.d/owasp-crs/rules/REQUEST-949-BLOCKING-EVALUATION.conf"] [line "81"] [id "${data.ruleId}"] [msg "${data.ruleDetails}"] [uri "${data.endpoint}"] [request: "${data.method} ${data.endpoint}${payload} HTTP/1.1"]`
    });
    renderLogs('all');

  } else {
    // ----------------------------------------
    // CASE 2: WAF OFF OR NORMAL BENIGN REQUEST (200 OK)
    // ----------------------------------------
    if (statusBadge) {
      statusBadge.className = 'px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1';
      statusBadge.innerHTML = '<i class="fa-solid fa-check"></i> 200 OK';
    }

    if (screenBlocked) screenBlocked.classList.add('hidden');

    if (screenVulnerable) {
      screenVulnerable.classList.remove('hidden');

      if (isNormal) {
        if (scoreText) {
          scoreText.innerText = '0 / 5 (An toàn)';
          scoreText.className = 'font-bold text-emerald-400';
        }
        if (scoreBar) {
          scoreBar.style.width = '8%';
          scoreBar.style.backgroundColor = '#10b981';
        }
        screenVulnerable.innerHTML = `
          <div class="w-full bg-[#f8fafc] text-slate-900 p-4 rounded border border-slate-300 font-sans text-xs">
            <div class="text-emerald-700 font-bold mb-2 flex items-center gap-1.5">
              <i class="fa-solid fa-circle-check"></i> Yêu Cầu Hợp Lệ Được Phục Vụ Thành Công (200 OK)
            </div>
            <p class="text-slate-600">Yêu cầu không chứa cú pháp độc hại. Hệ thống vận hành bình thường.</p>
          </div>
        `;
      } else {
        if (scoreText) {
          scoreText.innerText = 'N/A (Tường lửa đang tắt)';
          scoreText.className = 'font-bold text-slate-500';
        }
        if (scoreBar) {
          scoreBar.style.width = '0%';
          scoreBar.style.backgroundColor = '#475569';
        }
        screenVulnerable.innerHTML = data.vulnerableHtml;
      }
    }
  }
}

// Render Terminal Logs
function renderLogs(filter) {
  const terminal = document.getElementById('terminal-body');
  if (!terminal) return;
  terminal.innerHTML = '';

  const filtered = logStore.filter(log => filter === 'all' || log.tag === filter);

  if (filtered.length === 0) {
    terminal.innerHTML = '<div class="text-slate-500 text-xs italic">[Không có log nào phù hợp với bộ lọc hiện tại]</div>';
    return;
  }

  filtered.forEach(log => {
    const row = document.createElement('div');
    row.className = 'p-2 rounded bg-black/40 border border-slate-900/60 font-mono text-[11px] break-words';
    
    if (log.type === 'error') {
      row.innerHTML = `<span class="text-rose-400 font-bold">[DENIED 403]</span> <span class="text-slate-400">${log.time}</span> <span class="text-slate-200">${highlightLog(log.content)}</span>`;
    } else {
      row.innerHTML = `<span class="text-cyan-400 font-bold">[RULE MATCH]</span> <span class="text-slate-400">${log.time}</span> <span class="text-slate-300">${highlightLog(log.content)}</span>`;
    }
    terminal.appendChild(row);
  });
}

function highlightLog(text) {
  return escapeHtml(text)
    .replace(/id &quot;(\d+)&quot;/g, 'id "<span class="text-amber-400 font-bold">$1</span>"')
    .replace(/Value: &#39;(\d+)&#39;/g, 'Value: \'<span class="text-rose-400 font-bold">$1</span>\'')
    .replace(/code 403/g, '<span class="text-rose-400 font-bold">code 403</span>')
    .replace(/phase 2/g, '<span class="text-cyan-400">phase 2</span>');
}

function filterLogs(filter) {
  document.querySelectorAll('.log-filter-btn').forEach(btn => {
    btn.className = 'log-filter-btn px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 cursor-pointer';
  });
  if (event && event.currentTarget) {
    event.currentTarget.className = 'log-filter-btn px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 cursor-pointer';
  }
  renderLogs(filter);
}

function clearTerminalLogs() {
  logStore = [];
  renderLogs('all');
}

function injectLog(type) {
  if (type === 'sqli') {
    switchScenario('sqli');
    const input = document.getElementById('payload-input');
    if (input) input.value = "%' OR '1'='1";
  } else if (type === 'xss') {
    switchScenario('xss');
    const input = document.getElementById('payload-input');
    if (input) input.value = "<script>alert('XSS_Exploit')<\/script>";
  } else {
    switchScenario('sqli');
    const input = document.getElementById('payload-input');
    if (input) input.value = "1";
  }
  isWAFEnabled = true;
  updateToggleUI();
  executeAttackSimulation();
  scrollToTerminal();
}

function scrollToTerminal() {
  const logSection = document.getElementById('logs');
  if (logSection) logSection.scrollIntoView({ behavior: 'smooth' });
}

// Code Viewer Tabs
function switchCode(tabKey) {
  currentCodeTab = tabKey;
  ['compose', 'nginx', 'python'].forEach(key => {
    const tabEl = document.getElementById(`code-tab-${key}`);
    if (tabEl) {
      if (key === tabKey) {
        tabEl.className = 'code-tab px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 cursor-pointer';
      } else {
        tabEl.className = 'code-tab px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-slate-400 hover:text-white cursor-pointer';
      }
    }
  });

  const block = document.getElementById('code-block');
  if (block && codeFiles[tabKey]) {
    block.innerText = codeFiles[tabKey];
  }
}

function copyCurrentCode() {
  const code = codeFiles[currentCodeTab];
  if (!code) return;
  navigator.clipboard.writeText(code).then(() => {
    const btnText = document.getElementById('copy-btn-text');
    if (btnText) {
      btnText.innerText = 'Đã sao chép!';
      setTimeout(() => { btnText.innerText = 'Sao chép code'; }, 2000);
    }
  });
}

// Modal Lightbox
function openModal(imageSrc) {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  if (modal && modalImg) {
    modalImg.src = imageSrc;
    if (modalTitle) modalTitle.innerText = imageSrc;
    modal.classList.remove('hidden');
  }
}

function closeModal() {
  const modal = document.getElementById('image-modal');
  if (modal) modal.classList.add('hidden');
}

// Helper: Escape HTML to avoid XSS issues in UI
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
