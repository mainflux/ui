docker_ui:
	docker build --tag=mainflux/ui -f docker/Dockerfile .

run:
	docker-compose -f docker/docker-compose.yml -f docker/aedes.yml up
