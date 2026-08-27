FROM owasp/modsecurity-crs:3.3.10-nginx-202608131208

ENV MODSEC_RULE_ENGINE=On
ENV PORT=80

# Xóa bỏ script 0-move-writables.sh gây ra vòng lặp lỗi crash
RUN rm -f /docker-entrypoint.d/0-move-writables.sh

COPY config/nginx.conf /etc/nginx/templates/conf.d/default.conf.template