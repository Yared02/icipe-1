VERSION := v1.0.2

push-image:
	@docker build -f Dockerfile -t prm:$(VERSION) --platform linux/amd64 .
	@docker tag prm:$(VERSION) 923083696216.dkr.ecr.us-east-2.amazonaws.com/prm:$(VERSION)
	@docker push 923083696216.dkr.ecr.us-east-2.amazonaws.com/prm:$(VERSION)

auth:
	@aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 923083696216.dkr.ecr.us-east-2.amazonaws.com
