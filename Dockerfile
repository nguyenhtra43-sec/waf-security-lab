FROM owasp/modsecurity-crs:nginx
ENV MODSEC_RULE_ENGINE=On
COPY default.conf /etc/nginx/templates/conf.d/default.conf.template