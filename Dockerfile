FROM owasp/modsecurity-crs:nginx

# Ép Entrypoint script cấu hình WAF sang chế độ CHẶN (Blocking Mode)
ENV MODSEC_RULE_ENGINE=On \
    MODSEC_REQ_BODY_ACCESS=On \
    ANOMALY_INBOUND=5 \
    ANOMALY_OUTBOUND=4

COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template