FROM nginx:alpine

COPY dist/petshop-ui/browser /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
