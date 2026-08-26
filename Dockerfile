FROM owasp/modsecurity-crs:nginx

ENV MODSEC_RULE_ENGINE=On \
    MODSEC_REQ_BODY_ACCESS=On \
    PARANOIA=1 \
    BLOCKING_PARANOIA=1

# Ép ModSecurity bật chế độ chặn (On) thay vì chỉ cảnh báo (DetectionOnly)
RUN echo "SecRuleEngine On" > /etc/nginx/templates/modsecurity.d/modsecurity-override.conf.template

COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template