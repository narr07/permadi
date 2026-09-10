#!/usr/bin/env python3
"""
Script Audit Google PageSpeed Insights API (Detail & Komprehensif)
Penggunaan:
  python scripts/pagespeed-audit.py
  python scripts/pagespeed-audit.py https://permadi.dev/id/projek/sdnteja2
  python scripts/pagespeed-audit.py --strategy desktop
  python scripts/pagespeed-audit.py --save report.json
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

def clean_str(val):
    if val is None:
        return "-"
    return str(val).replace("\xa0", " ").strip()

def fmt_bytes(b):
    if b is None or b == "":
        return "-"
    try:
        b = float(b)
    except Exception:
        return str(b)
    if b >= 1024 * 1024:
        return f"{b / (1024 * 1024):.2f} MB"
    elif b >= 1024:
        return f"{b / 1024:.1f} KB"
    return f"{int(b)} B"

def fmt_ms(ms):
    if ms is None or ms == "":
        return "-"
    try:
        ms = float(ms)
        if ms >= 1000:
            return f"{ms / 1000:.2f} s"
        return f"{ms:,.1f} ms"
    except Exception:
        return str(ms)

def color_score(score):
    if score >= 90:
        return f"\033[92m{score}/100 (Bagus Sekali)\033[0m"
    elif score >= 50:
        return f"\033[93m{score}/100 (Perlu Peningkatan)\033[0m"
    else:
        return f"\033[91m{score}/100 (Kurang)\033[0m"

def shorten_url(url, max_len=60):
    if not url or url == "Unattributable":
        return url
    if len(url) <= max_len:
        return url
    parsed = urllib.parse.urlparse(url)
    path = parsed.path
    if len(path) > max_len - 15:
        path = "..." + path[-(max_len - 18):]
    query = f"?{parsed.query[:12]}..." if parsed.query else ""
    return f"{parsed.netloc}{path}{query}"

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

def audit_pagespeed(url: str, strategy: str = "mobile", api_key: str = "", save_file: str = ""):
    print(f"\n🔍 Menghubungi Google PageSpeed Insights API...")
    print(f"   URL      : {url}")
    print(f"   Strategi : {strategy.upper()}")
    if api_key:
        print(f"   API Key  : Terpasang (AIza...{api_key[-4:]})")
    else:
        print(f"   API Key  : Tanpa API Key (kuota publik terbatas)")

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
            response = urllib.request.urlopen(req, timeout=120)
        except urllib.error.HTTPError as he:
            err_body = he.read().decode("utf-8", errors="ignore")
            print(f"\n❌ Google API Error ({he.code}):\n{err_body}\n")
            return False

        data = json.loads(response.read().decode("utf-8"))

        if save_file:
            try:
                with open(save_file, "w", encoding="utf-8") as sf:
                    json.dump(data, sf, indent=2, ensure_ascii=False)
                print(f"💾 Hasil mentah disimpan ke: {save_file}")
            except Exception as se:
                print(f"⚠️ Gagal menyimpan ke file: {se}")

        lighthouse = data.get("lighthouseResult", {})
        categories = lighthouse.get("categories", {})
        audits = lighthouse.get("audits", {})

        # 1. Skor Kategori (0 - 100)
        perf = int(categories.get("performance", {}).get("score", 0) * 100)
        seo = int(categories.get("seo", {}).get("score", 0) * 100)
        a11y = int(categories.get("accessibility", {}).get("score", 0) * 100)
        bp = int(categories.get("best-practices", {}).get("score", 0) * 100)

        # 2. Metrik Core Web Vitals & Timings
        fcp = clean_str(audits.get("first-contentful-paint", {}).get("displayValue"))
        lcp = clean_str(audits.get("largest-contentful-paint", {}).get("displayValue"))
        cls = clean_str(audits.get("cumulative-layout-shift", {}).get("displayValue"))
        tbt = clean_str(audits.get("total-blocking-time", {}).get("displayValue"))
        si = clean_str(audits.get("speed-index", {}).get("displayValue"))
        tti = clean_str(audits.get("interactive", {}).get("displayValue"))
        ttfb = clean_str(audits.get("server-response-time", {}).get("displayValue"))

        W = 68
        print("\n" + "=" * W)
        print("⚡ HASIL AUDIT LENGKAP GOOGLE PAGESPEED INSIGHTS")
        print("=" * W)
        print(f"🌐 URL     : {url}")
        print(f"📱 Mode    : {strategy.upper()}")
        print("-" * W)

        # Kategori
        print("📊 SKOR KATEGORI UTAMA:")
        print(f"  ⚡ Performance     : {color_score(perf)}")
        print(f"  🔍 SEO             : {color_score(seo)}")
        print(f"  ♿ Accessibility   : {color_score(a11y)}")
        print(f"  🛡️  Best Practices  : {color_score(bp)}")
        print("-" * W)

        # Core Web Vitals
        print("⏱️ CORE WEB VITALS & METRIK KUNCI:")
        print(f"  🚀 Largest Contentful Paint (LCP)  : {lcp:<12} (Target: < 2.5 s)")
        print(f"  ⏱️ First Contentful Paint (FCP)   : {fcp:<12} (Target: < 1.8 s)")
        print(f"  ⏳ Total Blocking Time (TBT)      : {tbt:<12} (Target: < 200 ms)")
        print(f"  📐 Cumulative Layout Shift (CLS)   : {cls:<12} (Target: < 0.1)")
        print(f"  🏎️ Speed Index (SI)               : {si}")
        print(f"  🔄 Time to Interactive (TTI)       : {tti}")
        print(f"  ⚡ Server Response Time (TTFB)     : {ttfb}")
        print("-" * W)

        # 3. LCP Deep Breakdown
        print("🎯 DETAIL ELEMEN LCP (Largest Contentful Paint):")
        lcp_insight = audits.get("lcp-breakdown-insight", {})
        lcp_items = lcp_insight.get("details", {}).get("items", [])
        lcp_node = None
        lcp_subparts = []

        for it in lcp_items:
            if isinstance(it, dict):
                if it.get("type") == "node":
                    lcp_node = it
                elif "items" in it:
                    lcp_subparts = it.get("items", [])

        # Fallback jika tidak di lcp-breakdown-insight
        if not lcp_node:
            el_items = audits.get("largest-contentful-paint-element", {}).get("details", {}).get("items", [])
            if el_items and isinstance(el_items[0], dict) and "node" in el_items[0]:
                lcp_node = el_items[0]["node"]

        if lcp_node:
            selector = lcp_node.get("selector") or lcp_node.get("nodeLabel") or "-"
            snippet = lcp_node.get("snippet") or "-"
            node_label = lcp_node.get("nodeLabel")
            print(f"  • Selector : {selector}")
            if node_label and node_label != selector:
                print(f"  • Konten   : \"{node_label.strip()}\"")
            if snippet and snippet != "-":
                # Potong jika snippet terlalu panjang
                clean_snip = snippet.replace("\n", " ").strip()
                if len(clean_snip) > 80:
                    clean_snip = clean_snip[:77] + "..."
                print(f"  • Snippet  : {clean_snip}")
        else:
            print("  • Elemen tidak terdeteksi secara spesifik.")

        if lcp_subparts:
            print("  • Alokasi Waktu LCP:")
            for sp in lcp_subparts:
                lbl = sp.get("label", "Subpart")
                dur = sp.get("duration", 0)
                print(f"    - {lbl:<26}: {fmt_ms(dur)}")
        print("-" * W)

        # 4. Distribusi Resource & Payload
        res_summary = audits.get("resource-summary", {}).get("details", {}).get("items", [])
        if res_summary:
            print("📦 DISTRIBUSI RESOURCE & UKURAN PAYLOAD:")
            print(f"  {'Jenis':<14} {'Ukuran Transfer':<18} {'Jumlah Request'}")
            print(f"  {'-'*12:<14} {'-'*15:<18} {'-'*14}")
            for res in res_summary:
                lbl = res.get("label", "-")
                sz = fmt_bytes(res.get("transferSize", 0))
                cnt = f"{res.get('requestCount', 0)} requests"
                print(f"  {lbl:<14} {sz:<18} {cnt}")
            print("-" * W)

        # 5. Peluang Penghematan (Opportunities)
        print("💡 PELUANG PENGHEMATAN & SARAN OPTIMASI:")
        opp_found = False

        # Cek render-blocking
        rb = audits.get("render-blocking-insight") or audits.get("render-blocking-resources")
        if rb:
            rb_disp = clean_str(rb.get("displayValue"))
            rb_items = rb.get("details", {}).get("items", [])
            if rb_items:
                opp_found = True
                print(f"  ⚠️  Render-blocking Requests ({rb_disp}):")
                for it in rb_items[:4]:
                    url_clean = shorten_url(it.get("url", ""))
                    w_ms = fmt_ms(it.get("wastedMs")) if "wastedMs" in it else ""
                    b_sz = fmt_bytes(it.get("totalBytes")) if "totalBytes" in it else ""
                    detail_str = f"({b_sz}, hemat ~{w_ms})" if (w_ms and b_sz) else f"({b_sz or w_ms})"
                    print(f"     • {url_clean} {detail_str}")

        # Cek Unused JS
        u_js = audits.get("unused-javascript")
        if u_js:
            js_disp = clean_str(u_js.get("displayValue"))
            js_items = u_js.get("details", {}).get("items", [])
            savings_bytes = u_js.get("details", {}).get("overallSavingsBytes", 0)
            if savings_bytes and savings_bytes > 20480: # > 20 KB
                opp_found = True
                print(f"  ⚠️  Kurangi Unused JavaScript ({js_disp}):")
                for it in js_items[:3]:
                    url_clean = shorten_url(it.get("url", ""))
                    w_b = fmt_bytes(it.get("wastedBytes", 0))
                    t_b = fmt_bytes(it.get("totalBytes", 0))
                    print(f"     • {url_clean} (Hemat {w_b} dari {t_b})")

        # Cek Unused CSS
        u_css = audits.get("unused-css-rules")
        if u_css:
            css_disp = clean_str(u_css.get("displayValue"))
            css_items = u_css.get("details", {}).get("items", [])
            savings_bytes = u_css.get("details", {}).get("overallSavingsBytes", 0)
            if savings_bytes and savings_bytes > 10240: # > 10 KB
                opp_found = True
                print(f"  ⚠️  Kurangi Unused CSS ({css_disp}):")
                for it in css_items[:3]:
                    url_clean = shorten_url(it.get("url", ""))
                    w_b = fmt_bytes(it.get("wastedBytes", 0))
                    t_b = fmt_bytes(it.get("totalBytes", 0))
                    print(f"     • {url_clean} (Hemat {w_b} dari {t_b})")

        # Cek Gambar / Modern Formats
        img_opt = audits.get("modern-image-formats") or audits.get("uses-optimized-images")
        if img_opt:
            img_savings = img_opt.get("details", {}).get("overallSavingsBytes", 0)
            if img_savings and img_savings > 20480:
                opp_found = True
                print(f"  ⚠️  Optimasi Format Gambar ({clean_str(img_opt.get('displayValue'))}):")
                for it in img_opt.get("details", {}).get("items", [])[:3]:
                    url_clean = shorten_url(it.get("url", ""))
                    w_b = fmt_bytes(it.get("wastedBytes", 0))
                    print(f"     • {url_clean} (Potensi hemat {w_b})")

        if not opp_found:
            print("  ✅ Tidak ditemukan masalah bottleneck atau pemborosan resource yang besar.")
        print("-" * W)

        # 6. Beban Kerja Main Thread
        mt = audits.get("mainthread-work-breakdown", {})
        mt_items = mt.get("details", {}).get("items", [])
        mt_disp = clean_str(mt.get("displayValue"))
        if mt_items:
            print(f"⚙️ BEBAN KERJA MAIN-THREAD ({mt_disp}):")
            for it in mt_items:
                lbl = it.get("groupLabel") or it.get("group") or "Lainnya"
                dur = it.get("duration", 0)
                if dur >= 50: # tampilkan hanya yang signifikan >= 50ms
                    print(f"  • {lbl:<28}: {fmt_ms(dur)}")
            print("-" * W)

        print("=" * W + "\n")
        return True

    except Exception as e:
        print(f"\n❌ Terjadi kesalahan saat audit: {e}\n")
        import traceback
        traceback.print_exc()
        return False

def main():
    parser = argparse.ArgumentParser(description="Audit Performa Web Lengkap via Google PageSpeed Insights API")
    parser.add_argument("url", nargs="?", default=DEFAULT_URL, help="URL yang ingin diaudit (default: https://permadi.dev)")
    parser.add_argument("--strategy", choices=["mobile", "desktop"], default="mobile", help="Mode perangkat: mobile atau desktop (default: mobile)")
    parser.add_argument("--key", default=GOOGLE_API_KEY, help="Google Cloud API Key (opsional jika sudah ada di .env)")
    parser.add_argument("--save", default="", help="Path file untuk menyimpan raw JSON hasil audit (opsional)")

    args = parser.parse_args()
    audit_pagespeed(args.url, strategy=args.strategy, api_key=args.key, save_file=args.save)

if __name__ == "__main__":
    main()
