##
# Copyright 2017 Google Inc. All Rights Reserved.
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#

# Set the base image to Debian.
# https://hub.docker.com/_/debian/
FROM debian:latest

EXPOSE 80 443 8080

WORKDIR /mdc-web

# Install OS utility packages
RUN apt-get update && apt-get install -y curl git util-linux && apt-get autoclean -y

# Create non-root user account
RUN useradd --create-home --shell /bin/bash demobot
RUN chown -R demobot:demobot .
USER demobot

# Needed in case `git pull` needs to merge
RUN git config --global user.email demobot@example.com
RUN git config --global user.name demobot

# Clone MDC-Web Git repo and install nvm
RUN git clone "https://github.com/material-components/material-components-web.git" .
RUN curl -o- "https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh" | bash

# Copy scripts needed to install node modules
USER root
COPY container/source-nvm.sh /scripts/
COPY container/install-node-modules.sh /scripts/
RUN chmod ugo+x /scripts/*.sh
USER demobot

# Install node modules
RUN /scripts/install-node-modules.sh

# Copy scripts needed to run on startup
USER root
COPY container/execute.sh /scripts/
COPY container/execute-args.sh /scripts/
RUN chmod ugo+x /scripts/*.sh
USER demobot

ENTRYPOINT ["/scripts/execute.sh"]
#CMD [ \
#  "--author", "Spetnik", \
#  "--pr", "1461", \
#  "--remote-url", "https://github.com/Spetnik/material-components-web.git", \
#  "--remote-branch", "fix/ripple-mouseup" \
#]
