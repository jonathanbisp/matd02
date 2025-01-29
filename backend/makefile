install:
	pip install -r requirements.txt

# Instala as dependências de desenvolvimento
install-dev:
	pip install -r requirements-dev.txt

# Formata o código e executa verificações
lint:
	ruff format .
	mypy .
	bandit -r .

docker-build:
	docker build . -t backend

docker-run:
	docker run -d --name backend -p 8000:8000 backend

#stop only the backend container
docker-stop:
	docker stop backend

#stop and remove the backend container and image
docker-clear:
	docker rm backend
	docker rmi backend

# Executa o servidor FastAPI em modo de produção
run:
	uvicorn app.main:app --workers 4 --port 8000

# Executa o servidor FastAPI em modo de desenvolvimento
dev:
	uvicorn app:app --workers 1 --port 8000 --reload --log-level debug

# Adiciona uma nova dependência usando Poetry
add-dependency:
	poetry add $(dependency)

# Adiciona uma nova dependência de desenvolvimento usando Poetry
add-dev-dependency:
	poetry add --group dev $(dependency)