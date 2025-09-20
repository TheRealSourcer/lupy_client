import scrapy
import re
from urllib.parse import urljoin
import os
import json
import subprocess

REPORT_DIR = "lhci_reports"
EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")

class SEODesignSpider(scrapy.Spider):
    name = "seo_design_spider"
    
    results = {}

    start_urls = [
        "https://raleigh.craigslist.org/",
        "https://www.chamberofcommerce.com/",
        #"https://www.yellowpages.com/",
        #"https://business.parkschamber.com/chamber-member-directory",
        #"https://www.carychamber.com/",
        #"https://www.manta.com/",
        #"https://www.merchantcircle.com/",
    ]

    def parse(self, response):
        emails = list(set(EMAIL_RE.findall(response.text)))
        if emails:
            self.results[response.url] = {"emails": emails, "issues": []}

        for href in response.css("a::attr(href)").getall():
            url = urljoin(response.url, href)
            if url.startswith("http"):
                yield scrapy.Request(url, callback=self.parse)

    def closed(self, reason):
        os.makedirs(REPORT_DIR, exist_ok=True)
        final_results = []

        seo_max = self.settings.get("SEO_MAXIMUM")
        performance_max = self.settings.get("PERFORMANCE_MAXIMUM")
        accessibility_max = self.settings.get("ACCESSIBILITY_MAXIMUM")
        best_practices_max = self.settings.get("BEST_PRACTICES_MAXIMUM")

        for url, data in self.results.items():
            filename = f"lhr-{abs(hash(url))}.json"
            filepath = os.path.join(REPORT_DIR, filename)
            
            result = subprocess.run([
                "lighthouse", url,
                "--output=json",
                f"--output-path={filepath}",
                "--only-categories=performance,accessibility,seo,best-practices",
                "--chrome-flags=--headless"
            ], capture_output=True, text=True)

            print(result.stdout)
            print(result.stderr)

            if result.returncode != 0 or not os.path.exists(filepath):
                print(f"Lighthouse failed for {url}")
            else:
                with open(filepath, "r", encoding="utf-8") as f:
                    report = json.load(f)
                
                scores = {
                    "accessibility": report['categories']['accessibility']['score'],
                    "performance": report['categories']['performance']['score'],
                    "best-practices": report['categories']['best-practices']['score'],
                    "seo": report['categories']['seo']['score'],
                }

                if ((scores["seo"] <= seo_max and scores["best-practices"] <= best_practices_max and scores["accessibility"] <= accessibility_max and scores["performance"] < performance_max) or any(score < 50 for score in scores.values())):
                    data["issues"].append({
                        "accessibility": scores["accessibility"],
                        "performance": scores["performance"],
                        "best-practices": scores["best-practices"],
                        "seo": scores["seo"]
                    })

                    final_results.append({
                        "url": url,
                        "emails": data['emails'],
                        "issues": data["issues"]
                    })

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(final_results, f, indent=2)
        
        print("The results were writthen with", len(final_results), "entries")