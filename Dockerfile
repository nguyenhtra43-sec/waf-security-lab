FROM owasp/modsecurity-crs:nginx

ENV MODSEC_RULE_ENGINE=On
ENV MODSEC_REQ_BODY_ACCESS=On
ENV PARANOIA=1

COPY default.conf /etc/nginx/templates/conf.d/default.conf.template

# Chuyển sang root để tạo file override
USER root
RUN echo "SecRuleEngine On" > /etc/nginx/templates/modsecurity.d/modsecurity-override.conf.template

# Chuyển lại user mặc định của image
USER nginx