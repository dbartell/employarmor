#!/usr/bin/env python3
"""
Post-optimization NLP analysis for EmployArmor pages.
Analyzes all 29 pages, compares to previous results, generates comparison report.
"""

import json
import re
import time
import requests
from pathlib import Path
from typing import Dict, List, Any
import sys

API_KEY = "AIzaSyAZypQ2lVM0whm8Mo9EWTjGhMHx4ckk3C8"
ENTITIES_ENDPOINT = f"https://language.googleapis.com/v1/documents:analyzeEntities?key={API_KEY}"
CLASSIFY_ENDPOINT = f"https://language.googleapis.com/v1/documents:classifyText?key={API_KEY}"

PROJECT_ROOT = Path("/Users/henry/projects/hireshield")
CONTENT_ANALYSIS_DIR = PROJECT_ROOT / "content-analysis"
POST_OPT_DIR = CONTENT_ANALYSIS_DIR / "post-optimization"
PAGES_DIR = PROJECT_ROOT / "src/app/(marketing)/resources"

def strip_jsx(content: str) -> str:
    """Extract readable text from TSX file, removing JSX tags and code."""
    # Remove imports and exports
    content = re.sub(r'^import .*?$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^export .*?$', '', content, flags=re.MULTILINE)
    
    # Remove JSX tags but keep text content
    content = re.sub(r'<[^>]+>', ' ', content)
    
    # Remove code blocks and function definitions
    content = re.sub(r'function\s+\w+\s*\([^)]*\)\s*{[^}]*}', '', content, flags=re.DOTALL)
    content = re.sub(r'const\s+\w+\s*=.*?;', '', content, flags=re.DOTALL)
    
    # Remove URLs and special characters
    content = re.sub(r'https?://[^\s]+', '', content)
    content = re.sub(r'[{}[\]();,]', ' ', content)
    
    # Clean up whitespace
    content = re.sub(r'\s+', ' ', content)
    content = content.strip()
    
    return content

def get_all_page_files() -> List[tuple]:
    """Get all resource page files with their slugs."""
    pages = []
    for page_file in PAGES_DIR.rglob("page.tsx"):
        relative_path = page_file.relative_to(PAGES_DIR)
        if relative_path.parent == Path("."):
            slug = "resources-index"
        else:
            slug = str(relative_path.parent).replace("/", "-")
        pages.append((slug, page_file))
    return sorted(pages)

def analyze_entities(text: str) -> Dict[str, Any]:
    """Call Google NLP analyzeEntities API."""
    payload = {
        "document": {
            "type": "PLAIN_TEXT",
            "content": text[:100000]  # API limit
        },
        "encodingType": "UTF8"
    }
    
    response = requests.post(ENTITIES_ENDPOINT, json=payload)
    if response.status_code != 200:
        print(f"  ⚠️  Entity analysis failed: {response.status_code}")
        return {}
    
    return response.json()

def classify_text(text: str) -> Dict[str, Any]:
    """Call Google NLP classifyText API."""
    payload = {
        "document": {
            "type": "PLAIN_TEXT",
            "content": text[:100000]  # API limit
        }
    }
    
    response = requests.post(CLASSIFY_ENDPOINT, json=payload)
    if response.status_code != 200:
        # Classification may fail for some content, that's okay
        return {}
    
    return response.json()

def analyze_page(slug: str, page_file: Path) -> Dict[str, Any]:
    """Run full NLP analysis on a page."""
    print(f"\n📄 Analyzing: {slug}")
    
    # Extract text content
    tsx_content = page_file.read_text()
    text_content = strip_jsx(tsx_content)
    
    if len(text_content) < 100:
        print(f"  ⚠️  Warning: Very little text extracted ({len(text_content)} chars)")
        return None
    
    print(f"  📝 Extracted {len(text_content)} characters")
    
    # Run NLP analysis
    print(f"  🔍 Running entity analysis...")
    entities_result = analyze_entities(text_content)
    
    time.sleep(2)  # Rate limit
    
    print(f"  🏷️  Running text classification...")
    classification_result = classify_text(text_content)
    
    # Combine results
    result = {
        "slug": slug,
        "analyzed_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "text_length": len(text_content),
        "entities": entities_result.get("entities", []),
        "entity_count": len(entities_result.get("entities", [])),
        "categories": classification_result.get("categories", []),
        "language": entities_result.get("language", "unknown")
    }
    
    print(f"  ✅ Found {result['entity_count']} entities, {len(result['categories'])} categories")
    
    return result

def load_previous_analysis(slug: str) -> Dict[str, Any]:
    """Load previous analysis results if they exist."""
    prev_file = CONTENT_ANALYSIS_DIR / f"{slug}.json"
    if prev_file.exists():
        return json.loads(prev_file.read_text())
    return None

def compare_results(previous: Dict, current: Dict) -> Dict[str, Any]:
    """Compare previous and current analysis results."""
    if not previous:
        return {
            "status": "new",
            "entity_change": current["entity_count"],
            "new_entities": current["entity_count"]
        }
    
    # Handle nested entities structure from previous analysis
    prev_entity_list = previous.get("entities", {})
    if isinstance(prev_entity_list, dict):
        prev_entity_list = prev_entity_list.get("entities", [])
    
    prev_entities = {e["name"]: e.get("salience", 0) for e in prev_entity_list}
    curr_entities = {e["name"]: e.get("salience", 0) for e in current.get("entities", [])}
    
    new_entities = set(curr_entities.keys()) - set(prev_entities.keys())
    removed_entities = set(prev_entities.keys()) - set(curr_entities.keys())
    
    # Calculate salience improvements
    salience_changes = []
    for entity in set(curr_entities.keys()) & set(prev_entities.keys()):
        prev_sal = prev_entities[entity]
        curr_sal = curr_entities[entity]
        if abs(curr_sal - prev_sal) > 0.01:  # Significant change
            salience_changes.append({
                "entity": entity,
                "previous": prev_sal,
                "current": curr_sal,
                "change": curr_sal - prev_sal
            })
    
    # Calculate previous entity count
    prev_count = len(prev_entity_list) if isinstance(prev_entity_list, list) else previous.get("entity_count", 0)
    
    # Handle previous categories structure
    prev_categories = previous.get("categories", {})
    if isinstance(prev_categories, dict):
        prev_categories = prev_categories.get("categories", [])
    
    return {
        "status": "updated",
        "entity_change": current["entity_count"] - prev_count,
        "previous_count": prev_count,
        "current_count": current["entity_count"],
        "new_entities": list(new_entities),
        "removed_entities": list(removed_entities),
        "salience_changes": sorted(salience_changes, key=lambda x: abs(x["change"]), reverse=True)[:10],
        "category_change": {
            "previous": [c.get("name", "") for c in prev_categories],
            "current": [c.get("name", "") for c in current.get("categories", [])]
        }
    }

def main():
    """Main execution."""
    print("🚀 Starting post-optimization NLP analysis...")
    print(f"📁 Output directory: {POST_OPT_DIR}")
    
    POST_OPT_DIR.mkdir(exist_ok=True, parents=True)
    
    pages = get_all_page_files()
    print(f"\n📊 Found {len(pages)} pages to analyze")
    
    results = []
    comparisons = []
    
    for slug, page_file in pages:
        # Run analysis
        current_result = analyze_page(slug, page_file)
        if not current_result:
            continue
        
        # Save current result
        output_file = POST_OPT_DIR / f"{slug}.json"
        output_file.write_text(json.dumps(current_result, indent=2))
        
        # Load and compare with previous
        previous_result = load_previous_analysis(slug)
        comparison = compare_results(previous_result, current_result)
        comparison["slug"] = slug
        comparisons.append(comparison)
        
        results.append(current_result)
        
        # Rate limit
        time.sleep(2)
    
    # Generate comparison report
    generate_comparison_report(results, comparisons)
    
    print(f"\n✅ Analysis complete! Processed {len(results)} pages")
    print(f"📄 Results saved to: {POST_OPT_DIR}")

def generate_comparison_report(results: List[Dict], comparisons: List[Dict]):
    """Generate markdown comparison report."""
    report_lines = [
        "# Post-Optimization NLP Analysis Comparison",
        "",
        f"**Analysis Date:** {time.strftime('%Y-%m-%d %H:%M:%S')}",
        f"**Pages Analyzed:** {len(results)}",
        "",
        "## Executive Summary",
        ""
    ]
    
    # Calculate overall stats
    total_entity_change = sum(c.get("entity_change", 0) for c in comparisons)
    avg_entities_before = sum(c.get("previous_count", 0) for c in comparisons if c.get("previous_count")) / max(len([c for c in comparisons if c.get("previous_count")]), 1)
    avg_entities_after = sum(r["entity_count"] for r in results) / len(results)
    
    report_lines.extend([
        f"- **Total Entity Change:** {total_entity_change:+d}",
        f"- **Average Entities Before:** {avg_entities_before:.1f}",
        f"- **Average Entities After:** {avg_entities_after:.1f}",
        f"- **Improvement:** {((avg_entities_after - avg_entities_before) / avg_entities_before * 100):.1f}%" if avg_entities_before > 0 else "- **Improvement:** N/A (first run)",
        "",
        "## Top Improvements",
        ""
    ])
    
    # Sort by improvement
    improved = sorted([c for c in comparisons if c.get("entity_change", 0) > 0], 
                     key=lambda x: x["entity_change"], reverse=True)[:10]
    
    if improved:
        report_lines.append("| Page | Before | After | Change |")
        report_lines.append("|------|--------|-------|--------|")
        for comp in improved:
            report_lines.append(
                f"| {comp['slug']} | {comp.get('previous_count', 0)} | {comp.get('current_count', 0)} | +{comp['entity_change']} |"
            )
        report_lines.append("")
    
    # Pages that need work (lowest entity counts)
    needs_work = sorted(results, key=lambda x: x["entity_count"])[:10]
    report_lines.extend([
        "## Pages Needing More Work",
        "",
        "| Page | Entity Count | Categories |",
        "|------|--------------|-----------|"
    ])
    
    for page in needs_work:
        categories = ", ".join([c.get("name", "").split("/")[-1] for c in page.get("categories", [])])[:50]
        report_lines.append(
            f"| {page['slug']} | {page['entity_count']} | {categories or 'None'} |"
        )
    
    report_lines.extend([
        "",
        "## Category Alignment Changes",
        ""
    ])
    
    # Track category changes
    category_changes = [c for c in comparisons if c.get("category_change")]
    if category_changes:
        report_lines.append("| Page | Previous Categories | Current Categories |")
        report_lines.append("|------|--------------------|--------------------|")
        for comp in category_changes[:15]:
            cat_change = comp.get("category_change", {})
            prev = ", ".join([c.split("/")[-1] for c in cat_change.get("previous", [])])[:40] or "None"
            curr = ", ".join([c.split("/")[-1] for c in cat_change.get("current", [])])[:40] or "None"
            if prev != curr:
                report_lines.append(f"| {comp['slug']} | {prev} | {curr} |")
    
    report_lines.extend([
        "",
        "## Detailed Page Results",
        ""
    ])
    
    # All pages summary
    report_lines.append("| Page | Entities | Categories | Status |")
    report_lines.append("|------|----------|------------|--------|")
    for result in sorted(results, key=lambda x: x["entity_count"], reverse=True):
        comp = next((c for c in comparisons if c["slug"] == result["slug"]), {})
        status = "🆕 New" if comp.get("status") == "new" else f"{comp.get('entity_change', 0):+d}"
        categories = len(result.get("categories", []))
        report_lines.append(
            f"| {result['slug']} | {result['entity_count']} | {categories} | {status} |"
        )
    
    # Write report
    report_file = POST_OPT_DIR / "COMPARISON.md"
    report_file.write_text("\n".join(report_lines))
    print(f"\n📊 Comparison report saved to: {report_file}")

if __name__ == "__main__":
    main()
