FROM owasp/modsecurity-crs:nginx

ENV SEC_RULE_ENGINE=On
ENV ANOMALY_INBOUND=5
ENV ANOMALY_OUTBOUND=4

COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template
COPY config/modsecurity.conf /etc/nginx/modsecurity.d/modsecurity.conf