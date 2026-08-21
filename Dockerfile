FROM owasp/modsecurity-crs:nginx

# Ép chế độ Block qua Environment Variable chính chủ của Image
ENV MODSEC_RULE_ENGINE=On
ENV PARANOIA=1
ENV EXECUTING_PARANOIA=1

# Chỉ COPY duy nhất cấu hình trang web
COPY default.conf /etc/nginx/templates/conf.d/default.conf.template