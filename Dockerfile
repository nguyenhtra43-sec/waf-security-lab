FROM owasp/modsecurity-crs:3.3.10-nginx-202608131208

ENV MODSEC_RULE_ENGINE=On
ENV PORT=80

# Sửa script entrypoint để bỏ qua lỗi nếu thư mục bootstrap trống
RUN sed -i 's/cp -r /usr/local/bootstrap/nginx/\*/cp -r /usr/local/bootstrap/nginx/\* 2>/dev/null || true/g' /docker-entrypoint.d/0-move-writables.sh 2>/dev/null || rm -f /docker-entrypoint.d/0-move-writables.sh

COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template