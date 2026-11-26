/**
 * Sing-box Configuration
 * Base configuration template for Sing-box client
 * Updated DNS configuration mapped from Clash DNS policy (excluding YouTube rule)
 */

// 保留原始 Clash DNS 策略参考（已移除 YouTube 规则）
export const CLASH_DNS_REFERENCE = {
	"default-nameserver": [
		"223.5.5.5",
		"119.29.29.29",
		"1.1.1.1"
	],
	// 1. 节点域名解析：纯境外 DoH，防止代理节点域名泄漏给国内
	"proxy-server-nameserver": [
		"https://ds.cf105.us.ci/dns-query/sze",
		"https://ds.cf105.cc.cd/dns-query/sze",
		"https://games.lslnyjq.uk:8443/dns-query/sze"
	],
	// 2. 默认全局 DNS：直接走境外 DoH（所有未知域名、冷门境外网站、测试域名全部走这里，绝不试探国内）
	nameserver: [
		"https://ds.cf105.us.ci/dns-query/sze",
		"https://ds.cf105.cc.cd/dns-query/sze",
		"https://games.lslnyjq.uk:8443/dns-query/sze"
	],
	// 3. 直连出口 DNS：配合 respect-rules 使用，走国内 DoH
	"direct-nameserver": [
		"https://223.5.5.5/dns-query",
		"https://doh.pub/dns-query"
	],
	"direct-nameserver-follow-policy": true,
	// 4. 精准分流策略：仅明确属于国内的域名才发给阿里/腾讯（已移除 youtube_domain）
	"nameserver-policy": {
		"geosite:cn,private": [
			"https://223.5.5.5/dns-query",
			"https://doh.pub/dns-query"
		]
	},
	"respect-rules": true,
	"use-hosts": true,
	"use-system-hosts": true
};

export const SING_BOX_CONFIG = {
	dns: {
		servers: [
			// 1. 节点域名解析：纯境外 DoH
			{
				type: "https",
				tag: "dns_proxy_server",
				server: "ds.cf105.us.ci",
				path: "/dns-query/sze",
				detour: "🚀 节点选择",
				domain_resolver: "dns_resolver"
			},
			{
				type: "https",
				tag: "dns_proxy_server_backup",
				server: "ds.cf105.cc.cd",
				path: "/dns-query/sze",
				detour: "🚀 节点选择",
				domain_resolver: "dns_resolver"
			},
			{
				type: "https",
				tag: "dns_proxy_server_games",
				server: "games.lslnyjq.uk",
				server_port: 8443,
				path: "/dns-query/sze",
				detour: "🚀 节点选择",
				domain_resolver: "dns_resolver"
			},
			// 2. 默认全局 DNS：纯境外 DoH
			{
				type: "https",
				tag: "dns_proxy",
				server: "ds.cf105.us.ci",
				path: "/dns-query/sze",
				detour: "🚀 节点选择",
				domain_resolver: "dns_resolver"
			},
			// 3. 直连出口 DNS：国内 DoH
			{
				type: "https",
				tag: "dns_direct",
				server: "223.5.5.5",
				path: "/dns-query",
				detour: "DIRECT",
				domain_resolver: "dns_resolver"
			},
			{
				type: "https",
				tag: "dns_direct_pub",
				server: "doh.pub",
				path: "/dns-query",
				detour: "DIRECT",
				domain_resolver: "dns_resolver"
			},
			// default-nameserver / bootstrap 解析器
			{
				type: "udp",
				tag: "dns_resolver",
				server: "223.5.5.5",
				detour: "DIRECT"
			},
			{
				type: "udp",
				tag: "dns_resolver_dnspod",
				server: "119.29.29.29",
				detour: "DIRECT"
			},
			{
				type: "udp",
				tag: "dns_resolver_cf",
				server: "1.1.1.1",
				detour: "🚀 节点选择"
			},
			// FakeIP（保留原结构以便需要时调用）
			{
				type: "fakeip",
				tag: "dns_fakeip",
				inet4_range: "198.18.0.0/15",
				inet6_range: "fc00::/18"
			}
		],
		rules: [
			// Direct mode must not depend on a proxy node for DNS resolution.
			{
				clash_mode: "direct",
				query_type: [
					"A",
					"AAAA",
					"CNAME"
				],
				server: "dns_direct"
			},
			// 4. 精准分流策略：国内及私有域名走国内 DoH
			{
				rule_set: ["geolocation-cn", "cn", "private"],
				query_type: [
					"A",
					"AAAA",
					"CNAME"
				],
				server: "dns_direct"
			},
			// 2. 默认全局 DNS：境外及未知域名直接走境外 DoH
			{
				query_type: ["A", "AAAA", "CNAME"],
				server: "dns_proxy"
			},
			{
				query_type: [
					"A",
					"AAAA",
					"CNAME"
				],
				invert: true,
				action: "predefined",
				rcode: "REFUSED"
			}
		],
		final: "dns_proxy"
	},
	ntp: {
		enabled: true,
		server: 'time.apple.com',
		server_port: 123,
		interval: '30m',
		detour: 'DIRECT'
	},
	inbounds: [
		{ type: 'mixed', tag: 'mixed-in', listen: '0.0.0.0', listen_port: 2080 },
		{ type: 'tun', tag: 'tun-in', address: '172.19.0.1/30', auto_route: true, strict_route: true, stack: 'mixed' }
	],
	outbounds: [
		{ type: "direct", tag: 'DIRECT' }
	],
	route: {
		default_domain_resolver: "dns_resolver",
		final: "🚀 节点选择",
		"rule_set": [
			{
				"tag": "geosite-geolocation-!cn",
				"type": "local",
				"format": "binary",
				"path": "geosite-geolocation-!cn.srs"
			}
		],
		rules: []
	},
	experimental: {
		cache_file: {
			enabled: true,
			store_fakeip: true
		}
	}
};

export const SING_BOX_CONFIG_V1_11 = {
	dns: {
		servers: [
			// 1. 节点域名解析：纯境外 DoH
			{
				tag: "dns_proxy_server",
				address: "https://ds.cf105.us.ci/dns-query/sze",
				address_resolver: "dns_resolver",
				detour: "🚀 节点选择"
			},
			{
				tag: "dns_proxy_server_backup",
				address: "https://ds.cf105.cc.cd/dns-query/sze",
				address_resolver: "dns_resolver",
				detour: "🚀 节点选择"
			},
			{
				tag: "dns_proxy_server_games",
				address: "https://games.lslnyjq.uk:8443/dns-query/sze",
				address_resolver: "dns_resolver",
				detour: "🚀 节点选择"
			},
			// 2. 默认全局 DNS：纯境外 DoH
			{
				tag: "dns_proxy",
				address: "https://ds.cf105.us.ci/dns-query/sze",
				address_resolver: "dns_resolver",
				detour: "🚀 节点选择"
			},
			// 3. 直连出口 DNS：国内 DoH
			{
				tag: "dns_direct",
				address: "https://223.5.5.5/dns-query",
				address_resolver: "dns_resolver",
				detour: "DIRECT"
			},
			{
				tag: "dns_direct_pub",
				address: "https://doh.pub/dns-query",
				address_resolver: "dns_resolver",
				detour: "DIRECT"
			},
			// default-nameserver / bootstrap 解析器
			{
				tag: "dns_resolver",
				address: "223.5.5.5",
				detour: "DIRECT"
			},
			{
				tag: "dns_resolver_dnspod",
				address: "119.29.29.29",
				detour: "DIRECT"
			},
			{
				tag: "dns_resolver_cf",
				address: "1.1.1.1",
				detour: "🚀 节点选择"
			},
			// FakeIP（保留原结构以便需要时调用）
			{
				tag: "dns_fakeip",
				address: "fakeip"
			}
		],
		rules: [
			// Direct mode must not depend on a proxy node for DNS resolution.
			{
				clash_mode: "direct",
				query_type: [
					"A",
					"AAAA",
					"CNAME"
				],
				server: "dns_direct"
			},
			// 4. 精准分流策略：国内及私有域名走国内 DoH
			{
				rule_set: ["geolocation-cn", "cn", "private"],
				query_type: [
					"A",
					"AAAA",
					"CNAME"
				],
				server: "dns_direct"
			},
			// 2. 默认全局 DNS：境外及未知域名直接走境外 DoH
			{
				query_type: ["A", "AAAA", "CNAME"],
				server: "dns_proxy"
			},
			{
				query_type: [
					"A",
					"AAAA",
					"CNAME"
				],
				invert: true,
				server: "dns_direct",
				disable_cache: true
			}
		],
		final: "dns_proxy",
		strategy: "prefer_ipv4",
		independent_cache: true,
		fakeip: {
			enabled: true,
			inet4_range: "198.18.0.0/15",
			inet6_range: "fc00::/18"
		}
	},
	ntp: {
		enabled: true,
		server: 'time.apple.com',
		server_port: 123,
		interval: '30m',
		detour: 'DIRECT'
	},
	inbounds: [
		{ type: 'mixed', tag: 'mixed-in', listen: '0.0.0.0', listen_port: 2080 },
		{ type: 'tun', tag: 'tun-in', address: '172.19.0.1/30', auto_route: true, strict_route: true, stack: 'mixed' }
	],
	outbounds: [
		{ type: "direct", tag: 'DIRECT' }
	],
	route: {
		final: "🚀 节点选择",
		"rule_set": [],
		rules: []
	},
	experimental: {
		cache_file: {
			enabled: true,
			store_fakeip: true
		}
	}
};
