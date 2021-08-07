container_name=kitchen_postgres
ls_output=$(docker container ls -af name=$container_name)

if [[ $ls_output == *$container_name* ]]; then
  docker start $container_name
else
  docker run --name $container_name -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
fi
