install:
	pip install -r requirements.txt

# Instala as dependências de desenvolvimento
install-dev:
	pip install -r requirements-dev.txt

# Formata o código e executa verificações
format:
	ruff format .
	mypy .
	bandit -r .

# Executa o servidor FastAPI em modo de produção
run:
	uvicorn app.main:app --workers 4 --port 8000

# Executa o servidor FastAPI em modo de desenvolvimento
dev:
	uvicorn app.main:app --workers 4 --port 8000 --reload --log-level debug

# Adiciona uma nova dependência usando Poetry
add-dependency:
	poetry add $(dependency)

# Adiciona uma nova dependência de desenvolvimento usando Poetry
add-dev-dependency:
	poetry add --group dev $(dependency)