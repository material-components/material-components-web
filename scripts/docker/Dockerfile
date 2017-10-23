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

COPY container/* /scripts/
RUN chmod +x /scripts/*.sh

RUN /scripts/setup-root.sh
USER demobot
RUN /scripts/setup-user.sh

ENTRYPOINT ["/scripts/execute.sh"]
CMD [ \
  "--author", "Spetnik", \
  "--pr", "1461", \
  "--remote-url", "https://github.com/Spetnik/material-components-web.git", \
  "--remote-branch", "fix/ripple-mouseup" \
]
