# See https://gist.github.com/remarkablemark/aacf14c29b3f01d6900d13137b21db3a

# set the base image to Debian
# https://hub.docker.com/_/debian/
FROM debian:latest

FROM gcr.io/cloud-builders/git
FROM gcr.io/google-appengine/nodejs

WORKDIR /mdc-web

EXPOSE 8080

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# update the repository sources list
# and install dependencies
RUN apt-get update \
  && apt-get install -y curl vim less sudo tmux \
  && apt-get -y autoclean

#RUN useradd --create-home --shell /bin/bash --password `openssl passwd -1 user` user
#RUN echo -e user:user | chpasswd
#RUN chown -R user:user .
#RUN sudo adduser user sudo

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash

#USER user

# Install NVM
# https://github.com/creationix/nvm/blob/master/README.md
#RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash
#RUN . "$HOME/.nvm/nvm.sh"
#RUN nvm install node
#RUN nvm use node

RUN git clone "https://github.com/material-components/material-components-web.git" .
#RUN npm install --unsafe-perm

CMD ["git", "fetch", "--tags", "--prune"]
CMD ["git", "checkout", "master"]
#CMD ["npm", "install"]
#CMD ["npm", "install", "--unsafe-perm"]
#CMD ["ls", "-Al"]
#CMD ["npm", "run", "dev"]

# Keep the container running forever.
# Then, in another terminal window, run this command to get shell access to the container:
#   $ docker exec -t -i $(docker ps -lq) /bin/bash
#   -OR-
#   $ docker run -it $(docker ps -lq) /bin/bash
# To kill the container:
#   $ docker ps -lq | xargs docker stop
CMD ["/bin/bash", "-c", ". ~/.profile; ~/.nvm/nvm.sh; nvm install node; nvm use node; sudo npm install; tail -f /dev/null"]
