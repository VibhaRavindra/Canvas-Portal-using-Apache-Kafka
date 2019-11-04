## Pre requisites
The project makes use of ReactJS, NodeJS, Kafka, Redux and MongoDB
This project assumes a running kafka and zookeeper instance.
You should also have nodejs installed in the system.

## Kafka Topics
The bunch of kafka topics used by the project are all listed in `all_topics.txt` folder in `Lab2`. Please create all these topics in Kafka.
Create the topics like this: bin/kafka-topics.sh --create --topic my-kafka-topic --zookeeper localhost:2181 --partitions 1 --replication-factor 1


## Running all services
* To run the frontend code:
** Go to Frontend Folder
** Do `npm install`
** Do `npm start`
* To run the Backend & Kafka_Backend  code:
** Go to Backend & Kafka_Backend Folder
** Do `npm install`
** Do `node index.js`

You need to start all 3 services (Frontend, Backend and Kafka_Backend)

## important settings
To connect to your own instance of MongoDB, in Kafka_Backend edit connection string inside MongoDbConnection.js
Backend server port is configured in `Backend/index.js`

In `Frontend/package.json` edit the `proxy` setting to the hostname & port of Backend server.

