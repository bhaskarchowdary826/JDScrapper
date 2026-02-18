#!/usr/bin/env python3
"""
api_scraper.py — Called by Next.js API to scrape a single city+keyword combo.
Outputs JSON to stdout.
Usage: python3 api_scraper.py --city "Mumbai" --keyword "builders" --output json
"""

import argparse
import json
import sys
import time

def scrape(city: str, keyword: str) -> list:
    """Main scrape function - returns list of records as dicts"""
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.service import Service
        from selenium.webdriver.chrome.options import Options
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC
        from webdriver_manager.chrome import ChromeDriverManager
    except ImportError as e:
        print(f"Import error: {e}", file=sys.stderr)
        return []

    city_fmt = city.replace(' ', '-').lower()
    keyword_fmt = keyword.replace(' ', '-').lower()
    url = f"https://www.justdial.com/{city_fmt}/{keyword_fmt}/"

    print(f"Scraping: {url}", file=sys.stderr)

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    chrome_options.add_argument(f"user-agent={user_agent}")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option("useAutomationExtension", False)

    driver = None
    data = []

    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        driver.get(url)
        time.sleep(5)

        # Handle popup
        try:
            btn = WebDriverWait(driver, 8).until(
                EC.presence_of_element_located((By.CLASS_NAME, 'maybelater'))
            )
            if btn.is_displayed():
                btn.click()
                time.sleep(1)
        except:
            pass

        # IMPROVED SCROLLING — Load ALL content
        last_height = driver.execute_script("return document.body.scrollHeight")
        no_change_count = 0
        scroll_attempts = 0
        max_scrolls = 100  # Increased from 4 to 100

        print(f"Starting to scroll and load all listings...", file=sys.stderr)

        while no_change_count < 8 and scroll_attempts < max_scrolls:  # Increased threshold
            # Scroll down
            driver.execute_script("window.scrollBy(0, window.innerHeight);")
            scroll_attempts += 1
            time.sleep(2)  # Give time to load

            # Handle popup during scroll
            try:
                close_btn = driver.find_element(By.CLASS_NAME, 'jd_modal_close')
                if close_btn.is_displayed():
                    close_btn.click()
            except:
                pass

            # Check if height changed
            new_height = driver.execute_script("return document.body.scrollHeight")
            
            if new_height == last_height:
                no_change_count += 1
                print(f"Scroll {scroll_attempts}: No new content ({no_change_count}/8)", file=sys.stderr)
            else:
                no_change_count = 0
                last_height = new_height
                print(f"Scroll {scroll_attempts}: New content loaded! Height: {new_height}px", file=sys.stderr)

        print(f"Scrolling completed after {scroll_attempts} scrolls", file=sys.stderr)

        # Scroll to top to ensure all elements are in viewport
        driver.execute_script("window.scrollTo(0, 0);")
        time.sleep(2)

        # Extract data
        parent_divs = driver.find_elements(By.CLASS_NAME, 'resultbox_info')
        print(f"Found {len(parent_divs)} listings", file=sys.stderr)

        for div in parent_divs:
            try:
                name = "N/A"
                phone = ""
                address = "N/A"

                try:
                    name = div.find_element(By.CLASS_NAME, 'resultbox_title_anchor').text.strip()
                except:
                    pass

                try:
                    phone = div.find_element(By.CLASS_NAME, 'callcontent').text.strip()
                except:
                    pass

                try:
                    address = div.find_element(By.CLASS_NAME, 'resultbox_address').text.strip()
                except:
                    pass

                if name and name != "N/A":
                    data.append({
                        "Name": name,
                        "Address": address,
                        "Phone": phone,
                        "City": city,
                        "Keyword": keyword,
                    })
            except:
                continue

        print(f"Successfully extracted {len(data)} records", file=sys.stderr)

    except Exception as e:
        print(f"Error during scraping: {e}", file=sys.stderr)
    finally:
        if driver:
            driver.quit()

    return data


def main():
    parser = argparse.ArgumentParser(description="JustDial scraper - single city+keyword")
    parser.add_argument("--city", required=True, help="City name")
    parser.add_argument("--keyword", required=True, help="Search keyword")
    parser.add_argument("--output", default="json", choices=["json", "csv"], help="Output format")
    args = parser.parse_args()

    records = scrape(args.city, args.keyword)

    if args.output == "json":
        print(json.dumps(records, ensure_ascii=False, indent=2))
    else:
        import csv, io
        output = io.StringIO()
        if records:
            writer = csv.DictWriter(output, fieldnames=records[0].keys())
            writer.writeheader()
            writer.writerows(records)
        print(output.getvalue())


if __name__ == "__main__":
    main()
