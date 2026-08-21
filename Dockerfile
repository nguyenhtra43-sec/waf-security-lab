FROM owasp/modsecurity-crs:nginx
COPY default.conf /etc/nginx/templates/conf.d/default.conf.template
COPY modsecurity-override.conf /etc/nginx/templates/modsecurity.d/modsecurity-override.conf.template