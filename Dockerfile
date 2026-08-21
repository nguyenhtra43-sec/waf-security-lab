FROM owasp/modsecurity-crs:nginx

# Biến môi trường bật Blocking Mode và CRS
ENV MODSEC_RULE_ENGINE=On
ENV PARANOIA=1
ENV EXECUTING_PARANOIA=1

USER root

# Copy default config Nginx
COPY default.conf /etc/nginx/templates/conf.d/default.conf.template

# Copy override config vào thư mục templates
COPY modsecurity-override.conf /etc/nginx/templates/modsecurity.d/modsecurity-override.conf.template

# Tạo trước thư mục cấu hình và phân quyền sạch sẽ
RUN mkdir -p /etc/nginx/modsecurity.d/ && \
    chown -R nginx:nginx /etc/nginx/templates/ /etc/nginx/modsecurity.d/

USER nginx