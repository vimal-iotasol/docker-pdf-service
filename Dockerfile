FROM node:20-bullseye-slim

# Install ca-certificates and dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  wget \
  gnupg2 \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf-2.0-0 \
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
  libglu1-mesa && \
  update-ca-certificates && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Add Google Chrome repository and install Chrome
RUN wget --no-verbose -O /tmp/linux_signing_key.pub https://dl.google.com/linux/linux_signing_key.pub && \
  if [ ! -s /tmp/linux_signing_key.pub ]; then echo "Failed to download Chrome key" && exit 1; fi && \
  install -D -m 644 /tmp/linux_signing_key.pub /etc/apt/trusted.gpg.d/google-chrome.asc && \
  echo "deb [arch=amd64 signed-by=/etc/apt/trusted.gpg.d/google-chrome.asc] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
  apt-get update && apt-get install -y --no-install-recommends google-chrome-stable && \
  apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/linux_signing_key.pub

# Install OpenSSH server for Azure App Service SSH access
RUN apt-get update && apt-get install -y --no-install-recommends openssh-server && \
  mkdir /var/run/sshd && \
  echo "root:Docker!" | chpasswd && \
  sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
  sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config && \
  echo "Ciphers aes128-cbc,aes256-cbc,3des-cbc" >> /etc/ssh/sshd_config && \
  echo "MACs hmac-sha1" >> /etc/ssh/sshd_config && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app
COPY assets ./assets
COPY logs ./logs

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Set ENV variables
ENV CHROME_BIN=/usr/bin/google-chrome-stable
ENV AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=panalitixstorage;AccountKey=4BsIXhS0htBl21KfakZZSgoiV64jKH1Fsa9QR1ogbFNN+PKX/ue1aKA9GTMZIv5VKLdUBjnoFo84shEtZ/Is0Q==;EndpointSuffix=core.windows.net
ENV CONTAINER_NAME=test

# Expose ports (add 2222 for SSH)
EXPOSE 3000 2222

# Use an entrypoint script to start SSH and your app
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]