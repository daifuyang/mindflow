---
title: aic - 让 AI 生成的代码快速上线
description: 一个让 AI 生成的内容快速上线的云资源管理 CLI 工具，支持七牛云存储、CDN、阿里云 DNS 和 ACME 证书自动签发。
---

我是戴富阳，全栈独立开发者。在用AI写代码的过程中，发现每次想快速预览一个HTML页面或发布一篇文章配图，都要折腾半天：上传云存储、配置CDN、申请证书、绑定域名...

后来我花了半天用 OpenCode 把这些操作写成CLI工具，就是 aic。现在我发文章配图、临时分享页面给客户看，**一条命令10秒搞定**，再也没有打开过任何一个云控制台。

## 痛点

当你用 AI 写完一个 HTML 页面，想要快速预览效果；或者写完一篇文章，想配上封面图发布到线上。你发现需要：

1. 手动上传到云存储
2. 登录 CDN 控制台创建加速域名
3. 去 DNS 控制台添加解析记录
4. 又去证书控制台申请 HTTPS 证书
5. 绑定证书，配置强制 HTTPS...

一套流程下来，AI 生成的快感早已消失殆尽。

## 核心理念

**aic** 的设计目标很简单：让 AI 生成的代码「写完即上线」。

一条命令上传文件，一条命令申请证书，一条命令绑定域名。整个链路无需打开浏览器，所有操作在终端完成，AI 写完直接贴命令，10 秒内看到线上效果。

## 功能特性

aic 目前支持四大能力：

| 模块     | 功能                                   |
| -------- | -------------------------------------- |
| **存储** | 上传、列表、私有 URL、复制、移动、删除 |
| **CDN**  | 创建、删除、上线、下线域名             |
| **DNS**  | 列出记录、添加记录、删除记录           |
| **证书** | ACME DNS 验证申请、上传、绑定          |

### 存储操作

AI 写完一个 HTML，直接上传：

```bash
aic upload index.html
```

生成带签名私有 URL，指定过期时间：

```bash
aic url image.png -e 86400
```

其他常用操作：

```bash
aic list                          # 列出文件
aic stat image.png                # 查看文件信息
aic copy src.png dest.png         # 复制
aic move old.png new.png          # 移动
aic delete image.png              # 删除
```

### CDN + DNS 一键开通

最常用的场景：创建 CDN 域名并自动添加 DNS 解析。

```bash
aic setup:cname cdn.example.com -b my-bucket
```

这条命令会依次：

1. 在七牛云创建 CDN 加速域名
2. 获取 CNAME
3. 自动在阿里云 DNS 添加 CNAME 记录

完成后直接输出结果：

```json
{
  "success": true,
  "cdnDomain": "cdn.example.com",
  "cname": "cname.qiniudns.com",
  "dnsRecord": { "RecordId": "123456" },
  "message": "CDN domain cdn.example.com created and CNAME added"
}
```

其他 CDN 命令：

```bash
aic cdn:create cdn.example.com -b my-bucket   # 创建域名
aic cdn:list                                   # 列出所有域名
aic cdn:info cdn.example.com                   # 域名详情
aic cdn:online cdn.example.com                  # 上线
aic cdn:offline cdn.example.com                 # 下线
aic cdn:delete cdn.example.com                  # 删除
```

### HTTPS 证书自动签发

传统方式申请证书需要登录控制台、填写信息、验证域名，操作繁琐。aic 通过 ACME DNS 验证实现全自动：

```bash
# 申请单域名证书
aic cert:issue cdn.example.com

# 申请泛域名证书
aic cert:issue "*.example.com"

# 使用 ECC 证书
aic cert:issue cdn.example.com -e

# 指定 DNS 提供商（默认阿里云）
aic cert:issue cdn.example.com -d cloudflare
```

支持三种 DNS 提供商：阿里云、Cloudflare、DNSPod。

申请完成后上传并绑定到 CDN 域名：

```bash
# 上传证书到七牛云
aic cert:upload my-cert cdn.example.com /path/to/fullchain.cer /path/to/domain.key

# 绑定证书到 CDN 域名
aic cert:bind cdn.example.com <certId>

# 列出已有证书
aic cert:list
```

### DNS 管理

```bash
aic dns:list example.com                    # 列出域名记录
aic dns:add example.com cdn CNAME cdn.qiniudns.com   # 添加 CNAME
aic dns:add example.com @ A 1.2.3.4         # 添加 A 记录
aic dns:delete <recordId>                   # 删除记录
aic dns:info <recordId>                    # 记录详情
```

## 典型工作流

### 场景一：AI 写 HTML 页面并上线

```bash
# 1. 用 AI 写完页面
vim page.html

# 2. 上传到七牛云存储
aic upload page.html

# 3. 创建 CDN 加速域名（自动配 DNS）
aic setup:cname cdn.example.com -b my-bucket

# 4. 申请 HTTPS 证书
aic cert:issue cdn.example.com

# 5. 上传并绑定证书
aic cert:upload my-cert cdn.example.com ~/.acme.sh/cdn.example.com/fullchain.cer ~/.acme.sh/cdn.example.com/cdn.example.com.key
aic cert:bind cdn.example.com <certId>

# 6. 访问 https://cdn.example.com/page.html
```

### 场景二：AI 生成配图并发布

```bash
# 1. AI 生成封面图保存为 cover.png
aic upload cover.png --prefix articles/2024/

# 2. 获取私有 URL（7 天有效期）
aic url articles/2024/cover.png -e 604800
```

## 安装

```bash
# npm 安装
npm install -g @zerocmf/aic

# 验证安装
aic --version
```

## 配置

创建配置文件 `~/.config/aic/config.toml`：

```toml
[qiniu]
accessKey = "your_access_key"
secretKey = "your_secret_key"
bucket = "your_bucket"
domain = "cdn.example.com"
region = "z0"

[aliyun]
accessKeyId = "your_access_key_id"
accessKeySecret = "your_access_key_secret"

[acme]
path = "~/.acme.sh/acme.sh"
dnsProvider = "aliyun"
email = "your@email.com"
```

### 配置说明

- **qiniu**: 七牛云存储和 CDN 的访问密钥
- **aliyun**: 阿里云 DNS API 密钥（用于自动添加 DNS 记录）
- **acme**: acme.sh 路径和默认 DNS 提供商

## 技术实现

### 命令架构

使用 [commander.js](https://github.com/tj/commander.js/) 构建命令行接口，命令分组清晰：

```
aic upload <file>          # 存储操作
aic cdn:*                   # CDN 操作
aic cert:*                  # 证书操作
aic dns:*                   # DNS 操作
aic setup:cname            # 一键开通
```

### 七牛云 API 封装

`qiniu.ts` 封装了存储和 CDN 的核心操作：

- **QiniuClient**: 存储操作（上传/列表/删除/私有 URL）
- **QiniuCdnClient**: CDN 操作（域名管理/证书绑定）

私有 URL 使用 HMAC-SHA1 签名，兼容七牛云规范。

### ACME DNS 验证

`cert:issue` 命令通过调用 acme.sh 实现 DNS-01 验证：

1. 根据 DNS 提供商设置环境变量（如 `Ali_Key`/`Ali_Secret`）
2. 调用 acme.sh `--issue --dns dns_ali`
3. 自动完成 TXT 记录添加、验证、删除
4. 返回证书路径

支持阿里云、Cloudflare、DNSPod 三种 DNS 提供商。

### 阿里云 DNS API

`aliyun-dns.ts` 封装了阿里云 DNS 的增删改查操作，用于 `setup:cname` 命令自动添加 CNAME 记录。

## 总结

aic 将云资源管理的多个平台、七牛云存储、CDN、阿里云 DNS、ACME 证书申请整合为一个 CLI 工具。核心理念是 **「AI 写完，命令上线」**，让 AI 生成的内容快速可见。

对于经常用 AI 写前端代码、写文章配图、部署简单站点的开发者，aic 能显著提升效率。

## 关注富阳说

- **公众号/微信**：搜索「富阳说」，更多 AI 工具实战分享
- **GitHub**：https://github.com/daifuyang/aic
- **npm**：https://www.npmjs.com/package/@zerocmf/aic

下期预告：**「我用AI编程工具2个月的真实体验」**，聊聊Cursor、OpenCode、OpenClaw的对比，踩过哪些坑，真正好用的场景是什么。
