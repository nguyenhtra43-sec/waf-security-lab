FROM owasp/modsecurity-crs:nginx

# Cấu hình BẬT CHẶN chuẩn đét cho OWASP CRS v4
ENV MODSEC_RULE_ENGINE=On \
    MODSEC_REQ_BODY_ACCESS=On \
    MODSEC_AUDIT_ENGINE="RelevantOnly" \
    ANOMALY_INBOUND=5 \
    ANOMALY_OUTBOUND=4

# Copy cấu hình Nginx
COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template