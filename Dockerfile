# Usa o ambiente do Node.js
FROM node:18

# Cria a pasta do aplicativo
WORKDIR /app

# Copia os arquivos de configuração (se você tiver um package.json)
COPY package*.json ./

# Instala as dependências (se houver)
RUN npm install

# Copia todos os seus arquivos (.js, .json) para o servidor
COPY . .

# Expõe a porta de acesso
EXPOSE 8080

# Comando para rodar o seu código (troque pelo nome do seu arquivo principal)
CMD ["node", "server.js"]
