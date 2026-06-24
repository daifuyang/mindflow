---
title: "我用 OrangePi 远程唤醒家里 PC"
date: 2026-06-23
status: draft
platform:
  - 掘金
  - 微信公众号
tags:
  - AI辅助开发
  - 自动化运维
  - OrangePi
  - Wake on LAN
  - FRP
  - 远程桌面
order: 6
cover:
  wechat: /assets/images/covers/2026-06-23-orangepi-wol-remote-pc/cover-wechat.jpg
---

# 我用 OrangePi 远程唤醒家里 PC

> **富阳说：做 1000 个 AI 工具，让每个人享受 AI 便利。**

最近我把家里闲置的 OrangePi 改造成了一个远程开机网关。

我的需求很简单：人在外面时，可以先远程唤醒家里的 Windows PC，然后用 Windows 远程桌面 App 连回去使用。

我的主板本身支持 Wake on LAN，所以理论上不缺“被唤醒”的能力。真正缺的是一个可靠的“远程按按钮”的入口。传统做法通常是买远程开机卡，插到主板上，通过手机 App 或云端服务模拟按电源键。

但我刚好有一台 OrangePi 开发板长期在线，于是干脆把它改造成两样东西：

| 角色 | 作用 |
|---|---|
| 远程开机卡 | 接收外部指令，在局域网内发送 WOL 魔术包 |
| VPN / 内网路由器 | 作为家里网络和公网服务器之间的入口，承接远程连接 |

这样就不需要额外买远程开机卡，也不需要把 PC 长期开着。

这件事听起来像是 Wake on LAN 的标准场景，但真正落地时会遇到一个问题：**公网很难直接把 WOL 广播包送进家里的局域网。**

所以我现在的方案不是让公网直接发魔术包，而是让一台长期在线的 OrangePi 留在家里，由它在局域网内完成真正的唤醒动作。

整体链路是这样的：

```text
Windows App / 浏览器
        |
        v
阿里云服务器
        |
        v
FRP 隧道
        |
        v
家中 OrangePi
        |
        v
Wake on LAN 广播包
        |
        v
家里的 Windows PC
```

PC 被唤醒之后，再通过阿里云服务器转发 RDP 端口，用 Windows 远程桌面 App 连接。

## 当前实际架构

我家里这台网关是 OrangePi Zero3，长期在线，承担两个职责：

| 职责 | 说明 |
|---|---|
| 远程唤醒网关 | 收到外部请求后，在局域网内发送 WOL 魔术包 |
| 远程连接中转 | 通过 FRP 把 PC 的 RDP 端口转发到阿里云服务器 |

当前网络结构大致是：

```text
OrangePi 网卡：end0
OrangePi 局域网 IP：192.168.18.1/24
局域网广播地址：192.168.18.255
被唤醒 PC：192.168.18.200
```

PC 离线时，在 OrangePi 上看到的邻居状态类似：

```text
192.168.18.200 FAILED
```

这个状态说明 OrangePi 知道目标 IP，但当前无法访问它。等 PC 开机后，这个 IP 会重新可达，RDP 转发也会恢复。

## 唤醒服务

OrangePi 上跑了一个简单的 Python 服务：

```text
/home/orangepi/wake.py
```

它监听：

```text
0.0.0.0:8080
```

服务由 PM2 管理，进程名是：

```text
wol-service
```

它提供三个入口：

| 路径 | 方法 | 作用 |
|---|---|---|
| `/` | GET | 显示一个简单的 Wake on LAN 页面 |
| `/api/status` | GET | 检查 PC 是否在线 |
| `/api/wake` | POST | 发送 WOL 魔术包 |

页面很简单：显示 `daifuyang-pc` 的在线状态和一个 `Wake Up` 按钮。点一下按钮，就会请求 `/api/wake`。

## WOL 不是靠命令行工具，而是 Python 直接发包

这套实现没有依赖 `wakeonlan` 或 `etherwake` 命令，而是在 Python 里直接构造魔术包。

核心逻辑可以简化成这样：

```python
mac_bytes = bytes.fromhex(mac.replace(':', ''))
magic = b'\xff' * 6 + mac_bytes * 16

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_BINDTODEVICE, b"end0")
sock.sendto(magic, ('<broadcast>', 9))
sock.close()
```

关键点有两个：

| 点 | 作用 |
|---|---|
| `SO_BROADCAST` | 允许发送 UDP 广播包 |
| `SO_BINDTODEVICE` | 强制从 OrangePi 的 `end0` 网卡发出 |

目标 PC 的信息写在脚本里，实际保存的是：

```text
name: daifuyang-pc
mac: XX:XX:XX:XX:XX:XX
interface: end0
status check: ping 192.168.18.200
```

真正运行时，把这里换成自己主机的完整 MAC 地址即可。

## ARP 在这里到底做什么

很多人一听远程唤醒，会以为公网要直接发 ARP 或广播包。

实际不是。

公网不能可靠地把局域网广播包送进家里，所以我这套方案里：

```text
公网请求只负责传命令
真正的 WOL 广播只在家里局域网内发生
```

ARP 在这里主要有两个作用：

| 作用 | 说明 |
|---|---|
| 判断在线状态 | OrangePi 可以通过邻居表或 ping 判断 `192.168.18.200` 是否可达 |
| 支撑远程连接 | PC 在线后，OrangePi 才能连到 `192.168.18.200:3389` |

但唤醒本身不依赖实时 ARP。

因为 PC 关机后，ARP 表很可能已经失效。如果唤醒依赖 ARP 动态查 MAC，反而会不稳定。

所以我的做法是：

```text
ARP / ping 用来判断状态
固定 MAC 用来发送魔术包
```

这是这套方案能稳定工作的关键。

## 阿里云服务器做公网入口

OrangePi 不直接暴露在公网，而是通过 FRP 主动连接阿里云服务器。

OrangePi 上的 FRP Client 配置在：

```text
/etc/frp/frpc.toml
```

对应的 systemd 服务是：

```text
frpc-orangepi.service
```

服务启动命令是：

```text
/usr/local/bin/frpc -c /etc/frp/frpc.toml
```

这样就不需要家里有公网 IP，也不需要在家庭路由器上开放入口。

当前 FRP 里有几条关键代理：

| 代理名 | 本地服务 | 云服务器端口 | 作用 |
|---|---|---|---|
| `wol-web` | `127.0.0.1:8080` | `8888` | 远程访问 WOL 页面和 API |
| `pc-rdp` | `192.168.18.200:3389` | `13389` | 远程桌面连接家里 PC |
| `orangepi-ssh` | `127.0.0.1:22` | `16023` | 远程 SSH 到 OrangePi |
| `novnc-web` | `127.0.0.1:6080` | `6080` | 浏览器访问 OrangePi 虚拟桌面 |
| `orangepi-opencode` | `127.0.0.1:4096` | `14097` | 远程访问 OrangePi 上的 OpenCode |

其中 WOL 这条链路最关键：

```text
OrangePi 127.0.0.1:8080
        |
        v
FRP
        |
        v
阿里云 8888
```

## 给 WOL 页面套一层 HTTPS 和密码

公网入口没有直接裸露端口，而是用域名访问：

```text
https://wol.example.com
```

Nginx 配置文件是：

```text
/path/to/wol.example.com.conf
```

实际配置做了几件事：

| 配置 | 作用 |
|---|---|
| HTTP 跳 HTTPS | 避免明文访问 |
| SSL 证书 | 给 WOL 入口域名开启 HTTPS |
| Basic Auth | 访问页面前需要用户名密码 |
| 反向代理 | 转发到阿里云本机 `127.0.0.1:8888` |

核心逻辑类似：

```nginx
server_name wol.example.com;

auth_basic "WOL Access";
auth_basic_user_file /etc/nginx/.htpasswd;

location / {
    proxy_pass http://127.0.0.1:8888;
}
```

最终访问链路就是：

```text
https://wol.example.com
        |
        v
阿里云 Nginx
        |
        v
127.0.0.1:8888
        |
        v
FRP 隧道
        |
        v
OrangePi:8080
        |
        v
wake.py
```

## Windows App 如何连接

我这里说的 Windows App，实际就是 Windows 上的远程桌面 App。

完整使用流程是：

1. 打开 WOL 页面
2. 输入 Basic Auth 用户名和密码
3. 页面显示 `daifuyang-pc` 当前状态
4. 点击 `Wake Up`
5. OrangePi 在局域网内发送 WOL 魔术包
6. 等 Windows PC 开机
7. 打开 Windows 远程桌面 App
8. 连接阿里云服务器的 RDP 转发端口

RDP 链路是：

```text
Windows Remote Desktop App
        |
        v
阿里云服务器:13389
        |
        v
FRP
        |
        v
OrangePi
        |
        v
192.168.18.200:3389
        |
        v
家里的 Windows PC
```

所以 PC 开机以后，远程桌面不是直接连家里的公网 IP，而是连阿里云服务器的转发端口。

## 离线时看到的现象

PC 没开机时，FRP 日志里会看到类似错误：

```text
pc-rdp connect to local service [192.168.18.200:3389] error: no route to host
```

这不是 FRP 坏了，而是说明：

1. 阿里云到 OrangePi 的 FRP 隧道是通的。
2. OrangePi 正在尝试连接家里的 PC。
3. 但 PC 当前离线，所以 `192.168.18.200:3389` 不可达。

等 PC 被唤醒后，`3389` 端口可达，远程桌面连接就能正常建立。

## 为什么这套方案比直接公网 WOL 稳

这套方案稳定的原因是职责分得很清楚。

| 问题 | 传统公网 WOL | 当前方案 |
|---|---|---|
| 家里没有公网 IP | 很麻烦 | 不需要，OrangePi 主动连阿里云 |
| 路由器不转发广播 | 容易失败 | 不依赖路由器公网广播转发 |
| PC 关机后 ARP 失效 | 可能找不到 MAC | MAC 固定写入脚本 |
| 远程桌面入口 | 需要暴露家里网络 | 通过 FRP 转发到阿里云 |
| 安全控制 | 容易裸露端口 | HTTPS + Basic Auth + FRP |

本质上，公网只负责把“唤醒命令”传给 OrangePi。

真正的魔术包，永远只在家里的局域网里发。

## 比远程开机卡更适合我的地方

如果只看“远程点亮电脑”这一件事，买一张远程开机卡当然也能解决。

但我现在这个方案的好处是，OrangePi 不只是替代远程开机卡，而是顺手变成了家里的远程网络入口。

| 对比项 | 远程开机卡 | OrangePi 方案 |
|---|---|---|
| 硬件成本 | 需要额外购买 | 利用已有开发板 |
| 安装方式 | 需要接主板跳线或插卡 | 只要 OrangePi 在同一局域网 |
| 唤醒方式 | 模拟按电源键 | 利用主板自带 WOL 能力 |
| 远程连接 | 通常只负责开机 | 同时承接 FRP / VPN / RDP 转发 |
| 可扩展性 | 功能固定 | 可以继续加监控、告警、Web 控制台 |
| 可维护性 | 依赖厂商 App 或云服务 | 自己掌控服务和配置 |

对我来说，最大的收益有三个。

第一，不需要买远程开机卡。

我的主板本来就支持 WOL，只要有一台局域网内的设备能发魔术包，就能把它唤醒。OrangePi 正好长期在线，完全可以承担这个角色。

第二，OrangePi 同时变成了家里的 VPN / 内网路由器。

远程开机只是第一步。真正使用电脑，还需要连回家里的网络。OrangePi 通过 FRP 把家里的 RDP、SSH、Web 服务转出去，后续也可以接 WireGuard、Tailscale 或 ZeroTier，让它成为一个更完整的远程入口。

第三，方案完全可编排。

远程开机卡通常只能“点一下开机”。现在这套方案可以扩展成：点开机、查在线状态、检测 RDP 端口、失败告警、定时关机、自动重试，甚至接入自己的 Web 控制台。

换句话说，远程开机卡解决的是“开机按钮”问题；OrangePi 解决的是“我如何从外面安全回到家里网络”的问题。

## 当前方案的不足

这套方案已经能用，但也有一些可以继续优化的地方。

| 问题 | 当前状态 | 后续优化 |
|---|---|---|
| 目标 PC 写死 | 只支持一台 `daifuyang-pc` | 改成 JSON 配置，支持多台主机 |
| 认证较简单 | 目前依赖 Basic Auth | 可以加一次性 token 或 WebAuthn |
| 状态判断依赖 ping | 如果 PC 禁 ping，状态会不准 | 改成检测 `3389` 端口 |
| RDP 通过云端转发 | 虽然经 FRP 转发，但仍需注意安全 | 限 IP、加 VPN 或改用 Tailscale |

其中我最想优先优化的是状态判断。

因为最终要连的是 RDP，所以比起 ping，更准确的在线判断应该是：

```text
192.168.18.200:3389 是否可连接
```

## 总结

我现在这套 OrangePi 远程唤醒方案可以概括成一句话：

> 用阿里云服务器做公网入口，用 FRP 打通回家链路，用 OrangePi 在局域网内发 WOL，用 Windows 远程桌面 App 连接被唤醒的 PC。

完整链路是：

```text
打开 WOL 页面
        |
        v
点击 Wake Up
        |
        v
OrangePi 发魔术包
        |
        v
PC 开机
        |
        v
Windows 远程桌面 App 连接阿里云端口
        |
        v
进入家里 PC
```

这套方案的关键不是 WOL 本身，而是把“公网控制”和“局域网唤醒”分开。

公网只传命令，局域网负责唤醒。

OrangePi 在中间承担的角色，就是一台低功耗、常在线、稳定可靠的家庭远程开机网关。
