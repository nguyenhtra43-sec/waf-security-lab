FROM owasp/modsecurity-crs:nginx

# Thiết lập biến môi trường
ENV MODSEC_RULE_ENGINE=On \
    ANOMALY_INBOUND=5 \
    ANOMALY_OUTBOUND=4

# Ghi đè trực tiếp SecRuleEngine On vào file cấu hình chính của ModSecurity
RUN sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/' /etc/nginx/modsecurity.d/modsecurity-override.conf.template || true
RUN echo "SecRuleEngine On" >> /etc/nginx/modsecurity.d/modsecurity-override.conf.template

# Copy file cấu hình nginx
COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template