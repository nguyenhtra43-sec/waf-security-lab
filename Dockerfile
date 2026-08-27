FROM owasp/modsecurity-crs:nginx

# Giữ nguyên cấu trúc mặc định của Image và ép biến môi trường bật ModSecurity
ENV MODSEC_RULE_ENGINE=On
ENV PORT=80

COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template