#!/usr/bin/env python3
"""
Script Audit Google PageSpeed Insights API
Penggunaan:
  python scripts/pagespeed-audit.py
  python scripts/pagespeed-audit.py https://permadi.dev/id/projek/sdnteja2
  python scripts/pagespeed-audit.py --strategy desktop
"""

import sys
import os
import json
import argparse
import urllib.request
import urllib.parse

# Dukung UTF-8 encoding untuk console Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Coba baca file .env jika ada
def get_env_api_key():
    key = os.getenv("GOOGLE_PAGESPEED_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
    if key and key.startswith("AIza"):
        return key
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("GOOGLE_PAGESPEED_API_KEY="):
                    val = line.split("=", 1)[1].strip().strip('"').strip("'")
                    if val:
                        return val
    return ""

GOOGLE_API_KEY = get_env_api_key()
DEFAULT_URL = "https://permadi.dev"

def audit_pagespeed(url: str, strategy: str = "mobile", api_key: str = ""):
    print(f"\n🔍 Menguji: {url} ({strategy.upper()})...")
    endpoint = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    query_params = [
        ("url", url),
        ("strategy", strategy),
        ("category", "performance"),
        ("category", "seo"),
        ("category", "accessibility"),
        ("category", "best-practices"),
    ]
    if api_key:
        query_params.append(("key", api_key))
    
    encoded_url = f"{endpoint}?{urllib.parse.urlencode(query_params)}"
    
    try:
        req = urllib.request.Request(encoded_url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            response = urllib.request.urlopen(req, timeout=90)
        except urllib.error.HTTPError as he:
            err_body = he.read().decode("utf-8", errors="ignore")
            print(f"❌ Google API Error ({he.code}):\n{err_body}\n")
            return False

        data = json.loads(response.read().decode("utf-8"))
        lighthouse = data.get("lighthouseResult", {})
        categories = lighthouse.get("categories", {})
        audits = lighthouse.get("audits", {})

        # Skor Kategori (0 - 100)
        perf = int(categories.get("performance", {}).get("score", 0) * 100)
        seo = int(categories.get("seo", {}).get("score", 0) * 100)
        a11y = int(categories.get("accessibility", {}).get("score", 0) * 100)
        bp = int(categories.get("best-practices", {}).get("score", 0) * 100)

        # Metrik Core Web Vitals
        fcp = audits.get("first-contentful-paint", {}).get("displayValue", "-")
        lcp = audits.get("largest-contentful-paint", {}).get("displayValue", "-")
        cls = audits.get("cumulative-layout-shift", {}).get("displayValue", "-")
        tbt = audits.get("total-blocking-time", {}).get("displayValue", "-")
        si = audits.get("speed-index", {}).get("displayValue", "-")

        def color_score(score):
            if score >= 90:
                return f"\033[92m{score}/100 (Bagus Sekali)\033[0m"
            elif score >= 50:
                return f"\033[93m{score}/100 (Perlu Peningkatan)\033[0m"
            else:
                return f"\033[91m{score}/100 (Kurang)\033[0m"

        print("=" * 55)
        print(f"📊 HASIL AUDIT PAGESPEED: {url}")
        print("=" * 55)
        print(f"⚡ Performance     : {color_score(perf)}")
        print(f"🔍 SEO             : {color_score(seo)}")
        print(f"♿ Accessibility   : {color_score(a11y)}")
        print(f"🛡️ Best Practices   : {color_score(bp)}")
        print("-" * 55)
        print(f"⏱️ First Contentful Paint (FCP)  : {fcp}")
        print(f"🚀 Largest Contentful Paint (LCP) : {lcp}")
        print(f"📐 Cumulative Layout Shift (CLS)  : {cls}")
        print(f"⏳ Total Blocking Time (TBT)     : {tbt}")
        print(f"🏎️ Speed Index (SI)              : {si}")
        print("=" * 55)
        return True

    except Exception as e:
        print(f"❌ Terjadi kesalahan saat audit: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Audit Performa Web via Google PageSpeed Insights API")
    parser.add_argument("url", nargs="?", default=DEFAULT_URL, help="URL yang ingin diaudit (default: https://permadi.dev)")
    parser.add_argument("--strategy", choices=["mobile", "desktop"], default="mobile", help="Mode perangkat: mobile atau desktop (default: mobile)")
    parser.add_argument("--key", default=GOOGLE_API_KEY, help="Google Cloud API Key (opsional jika sudah ada di .env)")
    
    args = parser.parse_args()
    audit_pagespeed(args.url, strategy=args.strategy, api_key=args.key)

if __name__ == "__main__":
    main()
