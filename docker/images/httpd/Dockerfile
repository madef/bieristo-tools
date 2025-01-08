FROM php:8.3-apache

ENV APACHE_DOCUMENT_ROOT /app/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Mise a jour des paquets et installation des dependances
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libssl-dev \
    pkg-config \
    curl \
    gnupg \
    git \
    nano \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/mongodb/mongo-php-driver.git \
    && cd mongo-php-driver \
    && git submodule update --init \
    && phpize \
    && ./configure \
    && make \
    && make install \
    && docker-php-ext-enable mongodb \
    && cd .. \
    && rm -rf mongo-php-driver \
    && apt-get clean && rm -rf /var/lib/apt/lists/*


#RUN pecl config-set preferred_state stable \
#    && pecl config-set http_proxy https://pecl.php.net

# Installation de l'extension MongoDB
#RUN pecl channel-update pecl.php.net \
#    && pecl install mongodb \
#    && docker-php-ext-enable mongodb

# Telechargement et installation de Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Activation du module rewrite d'Apache (souvent utile pour les URLs)
RUN a2enmod rewrite

# Deplace le contexte de travail dans le dossier web
WORKDIR /app/public

# (Optionnel) Creation d'un package.json minimal
RUN npm init -y

# Installation de standard et tailwindcss
# Choisissez si vous voulez les installer en global ou en local:
# - Installation en global (pour usage direct en CLI, npx n'est pas obligatoire):
# RUN npm install -g standard tailwindcss
#
# - Installation en local (devDependencies) pour le projet:
#RUN npm install --save-dev standard tailwindcss

# Expose le port 80 pour Apache
EXPOSE 80

# Lancement d'Apache en foreground
CMD ["apache2-foreground"]
