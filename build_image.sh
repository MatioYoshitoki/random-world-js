tag=$(date "+%Y.%m.%d.%H%M%S")
docker build -t dandan-cri-prod-cn-shanghai.cr.volces.com/dandan-thirdparty/new-world-react-js:$tag .
docker push dandan-cri-prod-cn-shanghai.cr.volces.com/dandan-thirdparty/new-world-react-js:$tag
docker rmi dandan-cri-prod-cn-shanghai.cr.volces.com/dandan-thirdparty/new-world-react-js:$tag