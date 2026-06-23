export const SITE_URL = "https://shuo.daifuyang.com"

export const SITE_NAME = "富阳说"

export const SITE_TITLE = "富阳说：AI 工具、自动化运维与独立开发实践"

export const SITE_DESCRIPTION =
  "富阳说记录 AI 工具、自动化运维、独立开发、开源 CMS 与提示词工程实践，帮助开发者和中小企业享受 AI 便利。"

export const SITE_TAGLINE = "做 1000 个 AI 工具，让每个人享受 AI 便利。"

export const SITE_KEYWORDS = [
  "富阳说",
  "AI 工具",
  "AI 辅助开发",
  "自动化运维",
  "CI/CD",
  "独立开发",
  "开源 CMS",
  "提示词工程",
]

export const THEME_COLOR = "#2563eb"

export const AUTHOR_NAME = "戴富阳"

export const AUTHOR_URL = "https://daifuyang.com"

export const AUTHOR_SAME_AS = [
  "https://github.com/daifuyang",
  "https://www.zerocmf.com",
]

export const SITE_LOGO = "/brand/logo.svg"

export const DEFAULT_OG_IMAGE =
  "/assets/images/covers/aic-intro/cover-wechat.jpg"

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString()
}
