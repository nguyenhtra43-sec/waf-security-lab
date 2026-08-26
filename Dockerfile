FROM owasp/modsecurity-crs:nginx

# Cấu hình WAF Blocking Mode
ENV MODSEC_RULE_ENGINE=On \
    MODSEC_REQ_BODY_ACCESS=On \
    ANOMALY_INBOUND=5 \
    ANOMALY_OUTBOUND=4

# Copy cấu hình Nginx vào vị trí chính thức
COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template