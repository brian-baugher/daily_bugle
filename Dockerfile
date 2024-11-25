FROM httpd:latest
COPY ./my-httpd.conf /usr/local/apache2/conf/httpd.conf
COPY /front /usr/local/apache2/htdocs/
EXPOSE 80
