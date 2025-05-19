FROM node:20-bullseye-slim

# Install Chrome
RUN apt-get update && apt-get install -y wget gnupg2 && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*

# Install other dependencies
RUN apt-get update && apt-get install -y \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libdrm2 \
  libxshmfence1 \
  libgbm1 \
  libglu1-mesa \
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app
COPY assets ./assets

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy application files
COPY . .

# Set ENV variables
ENV CHROME_BIN=/usr/bin/google-chrome-stable
ENV AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=panalitixstorage;AccountKey=4BsIXhS0htBl21KfakZZSgoiV64jKH1Fsa9QR1ogbFNN+PKX/ue1aKA9GTMZIv5VKLdUBjnoFo84shEtZ/Is0Q==;EndpointSuffix=core.windows.net
ENV CONTAINER_NAME=test

# Expose ports
EXPOSE 3000 9229

CMD ["nodemon", "--inspect=0.0.0.0:9229", "index.js"]
