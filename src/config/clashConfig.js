/**
 * Clash Configuration
 * Base configuration template for Clash client
 */

export const CLASH_CONFIG = {
	'port': 7890,
	'socks-port': 7891,
	'allow-lan': false,
	'mode': 'rule',
	'log-level': 'info',
	'geodata-mode': true,
	'geo-auto-update': true,
	'geodata-loader': 'standard',
	'geo-update-interval': 24,
	'geox-url': {
		'geoip': "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat",
		'geosite': "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat",
		'mmdb': "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/country.mmdb",
		'asn': "https://github.com/xishang0128/geoip/releases/download/latest/GeoLite2-ASN.mmdb"
	},
	'rule-providers': {
		// 将由代码自动生成
	},
	'dns': {
		'enable': true,
		'ipv6': true,
		'enhanced-mode': 'fake-ip',
		'respect-rules': true,
		'use-hosts': true,
		'use-system-hosts': true,
		'default-nameserver': [
			'223.5.5.5',
			'119.29.29.29',
			'1.1.1.1'
		],
		// 1. 节点域名解析：纯境外 DoH，防止代理节点域名泄漏给国内
		'proxy-server-nameserver': [
			'https://ds.cf105.us.ci/dns-query/sze',
			'https://ds.cf105.cc.cd/dns-query/sze',
			'https://games.lslnyjq.uk:8443/dns-query/sze'
		],
		// 2. 默认全局 DNS：直接走境外 DoH（所有未知域名、冷门境外网站、测试域名全部走这里，绝不试探国内）
		'nameserver': [
			'https://ds.cf105.us.ci/dns-query/sze',
			'https://ds.cf105.cc.cd/dns-query/sze',
			'https://games.lslnyjq.uk:8443/dns-query/sze'
		],
		// 3. 直连出口 DNS：配合 respect-rules 使用，走国内 DoH
		'direct-nameserver': [
			'https://223.5.5.5/dns-query',
			'https://doh.pub/dns-query'
		],
		'direct-nameserver-follow-policy': true,
		// 4. 精准分流策略：仅明确属于国内的域名才发给阿里/腾讯
		'nameserver-policy': {
			'geosite:cn,private': [
				'https://223.5.5.5/dns-query',
				'https://doh.pub/dns-query'
			]
		}
	},
	'proxies': [],
	'proxy-groups': []
};