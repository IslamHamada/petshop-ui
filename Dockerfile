FROM nginx:alpine

COPY dist/petshop-ui/browser /usr/share/nginx/html
