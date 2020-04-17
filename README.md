# DEPRECATED
# docker-react-node
A scaffolding for dockerizing react and node

### Usage
*Must have Docker installed

#### Development
To start the dev server, use `source env-dev.sh && docker-compose up`


#### Production
To run production, use `source env-prod.sh && docker-compose -f docker-compose-prod.yml up`

#### Then
Go to `localhost` or `http://your-ip/` depending on which version of docker you have

### view logs of container
- docker logs container-name/containerID

### view logs of container status follow
- docker logs --follow container-name/containerID

### To see last n lines of logs
In this case, last 2500 lines will be displayed
- docker logs --tail 2500 container-name/containerID

### restore db
- go to root project
- docker exec -i 'id_container_mongo' sh -c 'mongorestore --archive' < db.dump

# DEPRECATED