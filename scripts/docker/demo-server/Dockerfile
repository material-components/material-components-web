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

# https://hub.docker.com/_/debian/
FROM debian:latest

EXPOSE 8080

WORKDIR /mdc-web

# Install OS packages
RUN apt-get update && \
    apt-get install -y \
        build-essential \
        curl \
        git \
        python \
        util-linux \
    && \
    apt-get autoclean -y

# Create non-root user account
RUN useradd --create-home --shell /bin/bash demobot && \
    mkdir -p /scripts && \
    chown -R demobot:demobot . /scripts
USER demobot

# Required in case `git pull` needs to merge
RUN git config --global user.email demobot@example.com && \
    git config --global user.name demobot

# Install nvm and node/npm
# https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#using-pipes
RUN ["/bin/bash", "-c", "set -o pipefail && curl -o- 'https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh' | bash"]
RUN ["/bin/bash", "-c", ". ~/.nvm/nvm.sh && nvm install node"]

# Clone MDC-Web Git repo
RUN git clone 'https://github.com/material-components/material-components-web.git' .

# Install node modules
RUN ["/bin/bash", "-c", ". ~/.nvm/nvm.sh && npm install"]

# Copy all remaining files
COPY --chown=demobot:demobot \
     runtime/ \
     /scripts/
RUN chmod ugo+x /scripts/*.sh

ENTRYPOINT ["/bin/bash", "-c", "/scripts/startup.sh"]
#CMD [ \
#  "--author", "Spetnik", \
#  "--pr", "1461", \
#  "--remote-url", "https://github.com/Spetnik/material-components-web.git", \
#  "--remote-branch", "fix/ripple-mouseup" \
#]
