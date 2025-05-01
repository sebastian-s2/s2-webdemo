FROM httpd:2.4-alpine

# Copy all content from htdocs
COPY htdocs/ /usr/local/apache2/htdocs/

# Configure Apache to handle .shtml files and enable SSI
RUN sed -i \
    -e 's/#LoadModule include_module/LoadModule include_module/' \
    -e 's/#LoadModule cgid_module/LoadModule cgid_module/' \
    -e 's/#LoadModule cgi_module/LoadModule cgi_module/' \
    /usr/local/apache2/conf/httpd.conf \
    && echo "AddType text/html .shtml" >> /usr/local/apache2/conf/httpd.conf \
    && echo "AddOutputFilter INCLUDES .shtml" >> /usr/local/apache2/conf/httpd.conf \
    && echo "Options +Includes" >> /usr/local/apache2/conf/httpd.conf

# Only expose port 80
EXPOSE 80

CMD ["httpd-foreground"]
