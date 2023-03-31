#判断是否启动redis
NAME="myredis"	# 容器名称
if [[ -n $(docker ps -q -f "name=${NAME}") ]];then
    echo "myredis is running"
else
    echo "myredis is down!"
    docker restart $NAME
fi

# 重构容器
image_version=`date +%Y%m%d%H%M`;
echo $image_version;
git pull origin master;
docker stop expresscontainer;
docker rm expresscontainer;
docker build -t expressimage:$image_version .;
echo '-------------镜像创建成功----------------';
docker images;
docker run -p 3001:3001 -d --name expresscontainer expressimage:$image_version;
echo '-------------容器启动成功----------------';
docker logs expresscontainer;
# 1、删除所有悬空镜像，不删除未使用镜像：docker rmi $(docker images -f "dangling=true" -q)
# 2.删除所有未使用镜像和悬空镜像：docker rmi $(docker images -q)
# docker rmi $(docker images -f "dangling=true" -q);