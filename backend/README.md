# Backend da aplicação de gestão de Carga Horária Complementar e Extensão

Esta pasta contempla o código-fonte do backend da aplicação de gestão de Carga Horária Complementar e Extensão para a disciplina MATD02, ministrada pelo Professor Cláudio Nogueira Sant`Anna.

## Estrutura do Projeto

- `app/`: Contém o código-fonte principal do backend.
  - `main.py`: Ponto de entrada da aplicação.
- `poetry.lock`: Arquivo de bloqueio de dependências gerado pelo Poetry.
- `pyproject.toml`: Arquivo de configuração do Poetry.
- `requirements-dev.txt`: Dependências de desenvolvimento.
- `requirements.txt`: Dependências de produção.
- `makefile`: Comandos de automação para o projeto.

## Dependências

As principais dependências do projeto incluem:

- `fastapi`: Framework web para construção de APIs.
- `pydantic`: Validação de dados.
- `sqlalchemy`: ORM para interação com o banco de dados.
- `uvicorn`: Servidor ASGI para execução da aplicação FastAPI.

## Como Executar Em Desenvolvimento

1. Tenha o python 3.12 instalado na sua maquina. Crie um ambiente python.

2. Utilize o comando a seguir para instalar as dependências:
```bash
make install-dev
make dev
```

3. Lembre-se de rodar as ferramentas de lint disponiveis, antes de fazer um PR, através do comando:
```bash
make lint
```
Se seu código não seguir o padrão do projeto ele ira criar uma falha no GitHub.

## Como Executar em Produção

1. Tenha o Docker instalado em sua maquina.

2. Execute o comando:
```bash
make docker-build
make docker run
```

Quando o comando terminar de executar basta acessar http://localhost:8000

3. Para parar o container utilize:
```bash
make docker-stop
```

3. Para limpar tudo execute:
```bash
make docker-clear
```

