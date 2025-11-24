FROM nginx:alpine

ARG ANGULAR_DIST=dist/petshop-ui

COPY dist/petshop-ui/browser /usr/share/nginx/html
