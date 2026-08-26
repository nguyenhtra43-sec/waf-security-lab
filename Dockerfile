FROM owasp/modsecurity-crs:nginx

# Ép biến môi trường CRS ở cấp Container
ENV SecRuleEngine=On
ENV MODSEC_RULE_ENGINE=On
ENV PARANOIA=1
ENV EXECUTING_PARANOIA=1

# Copy cấu hình Nginx từ thư mục config/ vào container
COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template
COPY config/modsecurity.conf /etc/nginx/templates/modsecurity.d/modsecurity-override.conf.template