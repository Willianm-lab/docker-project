# imagem base
FROM python:3.11-slim

# cria diretório da app
WORKDIR /app

# copia requirements e instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copia código
COPY . .

# expõe porta do Flask
EXPOSE 5000

# comando para rodar
CMD ["python", "app.py"]
