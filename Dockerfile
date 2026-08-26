FROM owasp/modsecurity-crs:nginx

# Thiết lập biến môi trường bắt buộc chặn cho CRS entrypoint
ENV MODSEC_RULE_ENGINE=On

# Copy cấu hình Nginx vào vị trí template
COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template