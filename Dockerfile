FROM owasp/modsecurity-crs:3.3.10-nginx-202608131208

ENV MODSEC_RULE_ENGINE=On
ENV PORT=80

COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template

# Bỏ qua hoàn toàn entrypoint script mặc định và chạy trực tiếp Nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]