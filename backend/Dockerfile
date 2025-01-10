# Etapa 1: Build
FROM python:3.12-slim AS builder

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando os arquivos de requisitos e o Makefile
COPY requirements.txt .
COPY makefile .

# Instalando dependências do sistema
RUN apt-get update && apt-get install -y make

# Instalando as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiando o restante do código da aplicação
COPY ./app ./app

# Etapa 2: Imagem final
FROM python:3.12-slim

# Definindo o diretório de trabalho
WORKDIR /app
EXPOSE 8000

# Copiando as dependências instaladas e o código da aplicação do estágio de build
# Copiando as dependências instaladas e o código da aplicação do estágio de build
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /app /app

# Instalando dependências do sistema (se necessário)
RUN apt-get update && apt-get install -y make

# Comando para rodar a aplicação FastAPI
ENTRYPOINT ["python3", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]