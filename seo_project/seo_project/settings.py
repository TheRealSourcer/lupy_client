# Scrapy settings for seo_project project
#
# For simplicity, this file contains only settings considered important or
# commonly used. You can find more settings consulting the documentation:
#
#     https://docs.scrapy.org/en/latest/topics/settings.html
#     https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#     https://docs.scrapy.org/en/latest/topics/spider-middleware.html
BOT_NAME = "seo_project"

# Custom Lupy Settings
# Custom Lupy Settings
# Custom Lupy Settings
# Custom Lupy Settings
# Custom Lupy Settings
# Custom Lupy Settings
# Custom Lupy Settings
# Custom Lupy Settings
# Custom Lupy Settings
# Custom Lupy Settings
# Custom Lupy Settings
# Custom Lupy Settings
SPIDER_MODULES = ["seo_project.spiders"]
NEWSPIDER_MODULE = "seo_project.spiders"
ADDONS = {}
FEEDS = {
    'results.json': {
        'format': 'json',
        'encoding': 'utf8',
        'store_empty': False,
        'overwrite': True,
    }
}
# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = "seo_project (+http://www.yourdomain.com)"
# Obey robots.txt rules
ROBOTSTXT_OBEY = True
# Concurrency and throttling settings
#CONCURRENT_REQUESTS = 16
CONCURRENT_REQUESTS_PER_DOMAIN = 32
DOWNLOAD_DELAY = 1
# Disable cookies (enabled by default)
#COOKIES_ENABLED = False
# Disable Telnet Console (enabled by default)
#TELNETCONSOLE_ENABLED = False
# Override the default request headers:
#DEFAULT_REQUEST_HEADERS = {
#    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
#    "Accept-Language": "en",
#}
# Enable or disable spider middlewares
# See https://docs.scrapy.org/en/latest/topics/spider-middleware.html
#SPIDER_MIDDLEWARES = {
#    "seo_project.middlewares.SeoProjectSpiderMiddleware": 543,
#}
# Enable or disable downloader middlewares
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#DOWNLOADER_MIDDLEWARES = {
#    "seo_project.middlewares.SeoProjectDownloaderMiddleware": 543,
#}
# Enable or disable extensions
# See https://docs.scrapy.org/en/latest/topics/extensions.html
#EXTENSIONS = {
#    "scrapy.extensions.telnet.TelnetConsole": None,
#}
# Configure item pipelines
# See https://docs.scrapy.org/en/latest/topics/item-pipeline.html
#ITEM_PIPELINES = {
#    "seo_project.pipelines.SeoProjectPipeline": 300,
#}
# Enable and configure the AutoThrottle extension (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/autothrottle.html
#AUTOTHROTTLE_ENABLED = True
# The initial download delay
#AUTOTHROTTLE_START_DELAY = 5
# The maximum download delay to be set in case of high latencies
#AUTOTHROTTLE_MAX_DELAY = 60
# The average number of requests Scrapy should be sending in parallel to
# each remote server
#AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
# Enable showing throttling stats for every response received:
#AUTOTHROTTLE_DEBUG = False
# Enable and configure HTTP caching (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#httpcache-middleware-settings
#HTTPCACHE_ENABLED = True
#HTTPCACHE_EXPIRATION_SECS = 0
#HTTPCACHE_DIR = "httpcache"
#HTTPCACHE_IGNORE_HTTP_CODES = []
#HTTPCACHE_STORAGE = "scrapy.extensions.httpcache.FilesystemCacheStorage"
# Set settings whose default value is deprecated to a future-proof value
FEED_EXPORT_ENCODING = "utf-8"
CLOSESPIDER_PAGECOUNT = 1
COLOR_FILTERING = False
RESPONSIVENESS_FILTERING = False
SEO_FILTERING = True
PERFORMANCE_FILTERING = True
ACCESSIBILITY_FILTERING = True
BEST_PRACTICES_FILTERING = True
LANGUAGE_FILTERING = 'undefined'
SEO_MAXIMUM = 30
PERFORMANCE_MAXIMUM = 30
ACCESSIBILITY_MAXIMUM = 30
BEST_PRACTICES_MAXIMUM = 30
