FROM owasp/modsecurity-crs:nginx

# Thiết lập các biến môi trường cấu hình chặn trực tiếp cho OWASP CRS
ENV MODSEC_RULE_ENGINE=On \
    CRS_ANOMALY_INBOUND=5 \
    CRS_ANOMALY_OUTBOUND=4

# Copy cấu hình Nginx
COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template