FROM owasp/modsecurity-crs:nginx

# Ép Container chạy với quyền Root để bỏ qua lỗi Permission
USER root

# Bật ModSecurity và đặt Port
ENV MODSEC_RULE_ENGINE=On
ENV PORT=80

# Copy cấu hình custom của bạn vào
COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template