http_upgrade="\$http_upgrade" HTML_ROOT=`PWD`/ envsubst < nginx.conf.template > nginx.conf
nginx -c `PWD`/nginx.conf