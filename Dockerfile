# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
WORKDIR /usr/src/app
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM install AS prerelease

WORKDIR /usr

COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
RUN bun run build
USER bun
EXPOSE 8080/tcp
ENTRYPOINT [ "bun", "run", "dev" ]

# copy production dependencies and source code into final image
#FROM base AS release
#WORKDIR /usr
#COPY --from=prerelease /usr/dist /usr/dist

# run the app
#USER bun
#EXPOSE 8080/tcp
#ENTRYPOINT [ "bun", "run", "/usr/dist/index.js" ]
