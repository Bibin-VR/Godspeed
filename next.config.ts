import type { NextConfig } from "next"

const isGithubPagesBuild = process.env.GITHUB_PAGES === "true"
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1]
const basePath = isGithubPagesBuild && repositoryName ? `/${repositoryName}` : undefined

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  eslint: {
    ignoreDuringBuilds: true,
  },
  ...(isGithubPagesBuild
    ? {
        output: "export" as const,
        basePath,
        assetPrefix: basePath,
        trailingSlash: true,
        images: {
          unoptimized: true,
        },
      }
    : {}),
}

export default nextConfig
