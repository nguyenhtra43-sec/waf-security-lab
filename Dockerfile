FROM owasp/modsecurity-crs:nginx

# 1. Ép biến môi trường
ENV MODSEC_RULE_ENGINE=On
ENV PARANOIA=1

# 2. Thay thế triệt để "DetectionOnly" thành "On" ở tất cả các file cấu hình trong container
RUN find /etc/nginx/ -type f -exec sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/g' {} +
RUN find /etc/modsecurity/ -type f -exec sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/g' {} + || true

# 3. Ghi đè trực tiếp lệnh SecRuleEngine On vào cuối file modsecurity.conf
RUN echo "SecRuleEngine On" >> /etc/nginx/modsecurity.d/modsecurity-override.conf || true

# 4. Copy file nginx config
COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template