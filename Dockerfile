FROM owasp/modsecurity-crs:nginx

# Cấu hình ModSecurity và CRS bằng biến môi trường của Image
ENV SEC_RULE_ENGINE=On \
    ANOMALY_INBOUND=5 \
    ANOMALY_OUTBOUND=4 \
    PARANOIA=1 \
    BLOCKING_PARANOIA=1

# Chỉ copy template nginx nếu cần tùy chỉnh location/server block
COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template