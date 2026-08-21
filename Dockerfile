FROM owasp/modsecurity-crs:nginx

ENV MODSEC_RULE_ENGINE=On
ENV PARANOIA=1
ENV EXECUTING_PARANOIA=1

COPY default.conf /etc/nginx/templates/conf.d/default.conf.template
# Copy file override trực tiếp vào thư mục cấu hình đã xử lý
COPY modsecurity-override.conf /etc/nginx/modsecurity.d/modsecurity-override.conf