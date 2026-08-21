FROM owasp/modsecurity-crs:nginx

# Thiết lập chế độ Blocking mặc định
ENV MODSEC_RULE_ENGINE=On
ENV PARANOIA=1
ENV EXECUTING_PARANOIA=1

COPY default.conf /etc/nginx/templates/conf.d/default.conf.template