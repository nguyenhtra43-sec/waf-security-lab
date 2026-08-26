FROM owasp/modsecurity-crs:nginx

# Copy cấu hình vào đúng vị trí template theo quy định của Image
COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template