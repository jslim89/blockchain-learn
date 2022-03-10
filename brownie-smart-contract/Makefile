PROJECT_NAME=blockchain

up:
	docker-compose -p $(PROJECT_NAME) -f docker/dev.yml up -d --build --force-recreate

down:
	docker-compose -p ${PROJECT_NAME} -f docker/dev.yml down --remove-orphans

build:
	docker-compose -p $(PROJECT_NAME) -f docker/dev.yml build

