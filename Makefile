ui:
	docker build --tag=mainflux/ui -f docker/Dockerfile .

run:
	docker-compose -f docker/docker-compose.yml -f docker/aedes.yml up

release:
	$(eval version = $(shell git describe --abbrev=0 --tags))
	git checkout $(version)
	docker tag mainflux/ui mainflux/ui:$(version)
	docker push mainflux/ui:$(version)
