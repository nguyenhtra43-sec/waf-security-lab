FROM owasp/modsecurity-crs:nginx

# Nạp file cấu hình Nginx vhost
COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template