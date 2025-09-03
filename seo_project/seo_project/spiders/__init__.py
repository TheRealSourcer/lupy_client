import scrapy
from urllib.parse import urlparse
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from bs4 import BeautifulSoup
import cssutils
import re
import requests
from PIL import Image
from io import BytesIO
from pymongo import MongoClient
import json
import os
import logging
from scrapy.exceptions import CloseSpider
import time

# Additional imports for advanced visual analysis
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from axe_selenium_python import Axe

class SEODesignSpider(CrawlSpider):
    name = "seo_design_spider"
    
    # Replace with your seed URLs
    start_urls = [
        'https://www.example.com',
        'https://www.anotherexample.com',
        # Add more seed URLs as needed
    ]
    
    # Define rules for following links
    rules = (
        Rule(LinkExtractor(allow_domains=()), callback='parse_page', follow=True),
    )
    
    # File to persist visited domains
    visited_domains_file = 'visited_domains.json'
    
    # PageSpeed Insights API key
    pagespeed_api_key = os.environ.get('PAGESPEED_KEY')
    
    def __init__(self, *args, **kwargs):
        super(SEODesignSpider, self).__init__(*args, **kwargs)
        # Load visited domains
        if os.path.exists(self.visited_domains_file):
            with open(self.visited_domains_file, 'r') as f:
                self.visited_domains = set(json.load(f))
        else:
            self.visited_domains = set()
        
        # Setup MongoDB
        self.client = MongoClient('mongodb://localhost:27017/')
        self.db = self.client['seo_design']
        self.collection = self.db['results']
        
        # Setup Selenium WebDriver with headless Chrome
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        self.driver = webdriver.Chrome(options=chrome_options)
        
        # Setup Axe for accessibility checks
        self.axe = Axe(self.driver)
    
    def parse_page(self, response):
        domain = urlparse(response.url).netloc
        if domain in self.visited_domains:
            return
        
        self.visited_domains.add(domain)
        
        # Initialize data dictionary
        data = {
            'url': response.url,
            'seo': {},
            'design': {},
            'issues': []
        }
        
        # Perform SEO Analysis using PageSpeed Insights API
        seo_data = self.analyze_seo(response.url)
        data['seo'] = seo_data
        
        # Perform Advanced Visual Analysis
        design_data = self.analyze_design(response.url)
        data['design'] = design_data
        
        # Determine if the website is poorly made based on criteria
        if self.is_poorly_made(seo_data, design_data):
            data['issues'].append('Poor SEO and/or Design')
            # Yield only poorly made websites
            self.collection.insert_one(data)
            yield {
                'url': data['url'],
                'issues': data['issues']
            }
        else:
            # Optionally, store all data or ignore
            self.collection.insert_one(data)
            # To yield only poorly made websites, do not yield otherwise
            pass
    
    def analyze_seo(self, url):
        """Perform SEO analysis using Google PageSpeed Insights API."""
        api_endpoint = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
        params = {
            'url': url,
            'key': self.pagespeed_api_key,
            'category': 'SEO',
            'strategy': 'desktop'  # or 'mobile'
        }
        try:
            response = requests.get(api_endpoint, params=params, timeout=30)
            response.raise_for_status()
            result = response.json()
            
            # Extract relevant SEO metrics
            lighthouse_result = result.get('lighthouseResult', {})
            categories = lighthouse_result.get('categories', {})
            seo_score = categories.get('seo', {}).get('score', 0) * 100
            performance_score = categories.get('performance', {}).get('score', 0) * 100
            accessibility_score = categories.get('accessibility', {}).get('score', 0) * 100
            best_practices_score = categories.get('best-practices', {}).get('score', 0) * 100
            
            seo_metrics = {
                'seo_score': seo_score,
                'performance_score': performance_score,
                'accessibility_score': accessibility_score,
                'best_practices_score': best_practices_score,
                'lighthouse_audit': lighthouse_result.get('audits', {})
            }
            return seo_metrics
        except requests.RequestException as e:
            logging.error(f"PageSpeed Insights API request failed for {url}: {e}")
            return {}
    
    def analyze_design(self, url):
        """Perform advanced visual analysis using Selenium and Axe."""
        design_metrics = {
            'color_contrast': {},
            'responsive': False,
            'large_images': [],
            'accessibility_issues': []
        }
        try:
            self.driver.get(url)
            time.sleep(3)  # Wait for the page to load
            
            # Perform Accessibility Checks using Axe
            self.axe.inject()
            results = self.axe.run()
            violations = results['violations']
            design_metrics['accessibility_issues'] = violations
            
            # Check Responsive Design by analyzing viewport meta tag
            viewport = self.driver.find_element(By.XPATH, "//meta[@name='viewport']")
            if viewport:
                design_metrics['responsive'] = True
            else:
                design_metrics['responsive'] = False
            
            # Check for large images (>1MB)
            images = self.driver.find_elements(By.TAG_NAME, 'img')
            for img in images:
                src = img.get_attribute('src')
                if src:
                    try:
                        img_response = requests.head(src, timeout=10)
                        content_length = img_response.headers.get('Content-Length')
                        if content_length and int(content_length) > 1_000_000:
                            design_metrics['large_images'].append(src)
                    except requests.RequestException:
                        continue  # Skip if image head request fails
            
            # Check Color Contrast Ratios using Lighthouse audits
            # Alternatively, perform manual color contrast checks here
            # For simplicity, using Lighthouse audits
            return design_metrics
        except Exception as e:
            logging.error(f"Design analysis failed for {url}: {e}")
            return design_metrics
    
    def is_poorly_made(self, seo_data, design_data):
        """Determine if a website is poorly made based on defined criteria."""
        # Define thresholds
        seo_threshold = 50  # Minimum score
        performance_threshold = 50
        accessibility_threshold = 50
        best_practices_threshold = 50
        
        # Check SEO scores
        seo_fail = False
        if seo_data:
            if (seo_data.get('seo_score', 100) < seo_threshold or
                seo_data.get('performance_score', 100) < performance_threshold or
                seo_data.get('accessibility_score', 100) < accessibility_threshold or
                seo_data.get('best_practices_score', 100) < best_practices_threshold):
                seo_fail = True
        
        # Check Design metrics
        design_fail = False
        if design_data:
            if not design_data.get('responsive', True):
                design_fail = True
            if design_data.get('large_images'):
                design_fail = True
            if design_data.get('accessibility_issues'):
                design_fail = True
            # Additional design checks can be added here
        
        return seo_fail or design_fail
    
    def spider_closed(self, spider):
        """Actions to perform when spider is closed."""
        # Save visited domains
        with open(self.visited_domains_file, 'w') as f:
            json.dump(list(self.visited_domains), f)
        # Close MongoDB connection
        self.client.close()
        # Quit Selenium WebDriver
        self.driver.quit()
