image_version=`date +%Y%m%d%H%M`;
echo $image_version;
git pull --rebase origin master;
docker stop expresscontainer;
docker rm expresscontainer;
docker rmi expressimage;
docker build -t expressimage:$image_version .;
echo '-------------镜像创建成功----------------';
docker images;
docker run -p 8081:8081 -d --name expresscontainer expressimage:$image_version;
echo '-------------容器启动成功----------------';
docker logs expresscontainer;
# 1、删除所有悬空镜像，不删除未使用镜像：docker rmi $(docker images -f "dangling=true" -q)
# 2.删除所有未使用镜像和悬空镜像：docker rmi $(docker images -q)
# docker rmi $(docker images -f "dangling=true" -q);