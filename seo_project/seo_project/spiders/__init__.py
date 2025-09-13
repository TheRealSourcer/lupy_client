import scrapy
from scrapy.spiders import CrawlSpider, Rule
import re
from urllib.parse import urljoin

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
MAX_PAGES = 1000

class SEODesignSpider(scrapy.Spider):
    name = "seo_design_spider"
    start_urls = [
        "https://raleigh.craigslist.org/",
        "https://www.chamberofcommerce.com/",
        "https://www.yellowpages.com/",
        "https://business.parkschamber.com/chamber-member-directory",
        "https://www.carychamber.com/",
        "https://www.manta.com/",
        "https://www.merchantcircle.com/",
    ]

    def parse(self, response):
        emails = set(EMAIL_RE.findall(response.text))
        
        if emails:
            yield {"url": response.url, "emails": list(emails), "issues": ["Poor SEO and/or Design"]}

        for href in response.css("a::attr(href)").getall():
            url = urljoin(response.url, href)
            if url.startswith("http"):
                yield scrapy.Request(url, callback=self.parse)