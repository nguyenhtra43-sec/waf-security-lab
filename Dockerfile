FROM owasp/modsecurity-crs:nginx

ENV MODSEC_RULE_ENGINE=On
ENV MODSEC_REQ_BODY_ACCESS=On
ENV PARANOIA=1

COPY default.conf /etc/nginx/templates/conf.d/default.conf.template

# Ép trực tiếp chế độ Blocking vào file override cấu hình của ModSecurity
RUN echo "SecRuleEngine On" > /etc/nginx/templates/modsecurity.d/modsecurity-override.conf.template