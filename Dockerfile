FROM owasp/modsecurity-crs:nginx

# Ép Nginx lắng nghe cổng 8080 (Non-root chuẩn trên Cloud)
ENV PORT=8080
ENV LISTEN=8080
ENV MODSEC_RULE_ENGINE=On

# Vô hiệu hóa script bootstrap bị lỗi của image gốc
RUN rm -f /docker-entrypoint.d/0-move-writables.sh

# Copy file cấu hình custom của bạn vào
COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template