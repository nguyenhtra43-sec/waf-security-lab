FROM owasp/modsecurity-crs:nginx

# Bật chế độ chặn (Blocking mode) cho ModSecurity
ENV MODSEC_RULE_ENGINE=on \
    ANOMALY_INBOUND=5 \
    ANOMALY_OUTBOUND=4 \
    PARANOIA=1 \
    BLOCKING_PARANOIA=1

COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template