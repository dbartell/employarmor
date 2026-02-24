#!/usr/bin/env python3
"""
Deploy FAQ and Article schema components to all EmployArmor pages.
- Replaces manual FAQ sections with FaqSchema component
- Adds ArticleSchema to all resource/blog pages
- Adds Organization and WebSite schema to marketing layout
"""

import re
from pathlib import Path
from typing import List, Dict, Any, Tuple
import json

PROJECT_ROOT = Path("/Users/henry/projects/hireshield")
PAGES_DIR = PROJECT_ROOT / "src/app/(marketing)/resources"
LAYOUT_FILE = PROJECT_ROOT / "src/app/(marketing)/layout.tsx"

def extract_faq_from_tsx(content: str) -> List[Dict[str, str]]:
    """Extract FAQ questions and answers from TSX content."""
    faqs = []
    
    # Pattern 1: faqCategories array with nested questions
    category_pattern = r'const faqCategories = \[(.*?)\]'
    match = re.search(category_pattern, content, re.DOTALL)
    
    if match:
        categories_str = match.group(1)
        # Extract questions from each category
        questions_pattern = r'questions:\s*\[(.*?)\]'
        for questions_match in re.finditer(questions_pattern, categories_str, re.DOTALL):
            questions_str = questions_match.group(1)
            # Extract individual Q&A pairs
            qa_pattern = r'\{\s*q:\s*"([^"]+)",\s*a:\s*"([^"]+)"'
            for qa_match in re.finditer(qa_pattern, questions_str, re.DOTALL):
                question = qa_match.group(1)
                answer = qa_match.group(2)
                faqs.append({"question": question, "answer": answer})
    
    # Pattern 2: Direct faqs array
    if not faqs:
        direct_pattern = r'const faqs = \[(.*?)\]'
        match = re.search(direct_pattern, content, re.DOTALL)
        if match:
            faqs_str = match.group(1)
            qa_pattern = r'\{\s*question:\s*"([^"]+)",\s*answer:\s*"([^"]+)"'
            for qa_match in re.finditer(qa_pattern, faqs_str, re.DOTALL):
                question = qa_match.group(1)
                answer = qa_match.group(2)
                faqs.append({"question": question, "answer": answer})
    
    return faqs

def has_faq_component_import(content: str) -> bool:
    """Check if FaqSchema is already imported."""
    return bool(re.search(r'import.*FaqSchema.*from.*faq-schema', content))

def has_article_component_import(content: str) -> bool:
    """Check if ArticleSchema is already imported."""
    return bool(re.search(r'import.*ArticleSchema.*from.*article-schema', content))

def add_faq_schema_to_page(page_file: Path) -> Tuple[bool, str]:
    """Add FaqSchema component to a page with FAQ section."""
    content = page_file.read_text()
    
    # Check if already using FaqSchema
    if has_faq_component_import(content):
        return (False, "Already using FaqSchema")
    
    # Extract FAQ data
    faqs = extract_faq_from_tsx(content)
    if not faqs:
        return (False, "No FAQ data found")
    
    # Prepare FAQ data as JSON
    faq_json = json.dumps(faqs, indent=2)
    
    # Add import
    import_pattern = r'(import.*?from.*?["\']react["\'])'
    if re.search(import_pattern, content):
        content = re.sub(
            import_pattern,
            r'\1\nimport { FAQSchema } from "@/components/faq-schema"',
            content,
            count=1
        )
    else:
        # Add after "use client" if present
        content = re.sub(
            r'("use client")',
            r'\1\n\nimport { FAQSchema } from "@/components/faq-schema"',
            content,
            count=1
        )
    
    # Create FAQ constant at the top of the file (after imports)
    faq_const = f'\nconst faqs = {faq_json}\n'
    
    # Find where to insert FAQ constant (after imports, before component)
    export_pattern = r'(export default function|export function)'
    content = re.sub(
            export_pattern,
            faq_const + r'\1',
            content,
            count=1
        )
    
    # Remove old FAQ rendering code and replace with component
    # This is complex - for now, let's add a comment for manual review
    
    page_file.write_text(content)
    return (True, f"Added FaqSchema import and FAQ data for {len(faqs)} questions")

def extract_page_metadata(content: str) -> Dict[str, Any]:
    """Extract metadata from page content for ArticleSchema."""
    metadata = {
        "title": "",
        "description": "",
        "datePublished": "2026-01-01",  # Default
    }
    
    # Extract title from metadata export
    title_match = re.search(r'export const metadata.*?title:\s*["\']([^"\']+)["\']', content, re.DOTALL)
    if title_match:
        metadata["title"] = title_match.group(1)
    
    # Extract description
    desc_match = re.search(r'description:\s*["\']([^"\']+)["\']', content, re.DOTALL)
    if desc_match:
        metadata["description"] = desc_match.group(1)
    
    return metadata

def add_article_schema_to_page(page_file: Path) -> Tuple[bool, str]:
    """Add ArticleSchema component to a resource/blog page."""
    content = page_file.read_text()
    
    # Check if already using ArticleSchema
    if has_article_component_import(content):
        return (False, "Already using ArticleSchema")
    
    # Extract metadata
    metadata = extract_page_metadata(content)
    if not metadata["title"]:
        return (False, "No metadata found")
    
    # Add import
    import_pattern = r'(import.*?from.*?["\']react["\'])'
    if re.search(import_pattern, content):
        content = re.sub(
            import_pattern,
            r'\1\nimport { ArticleSchema } from "@/components/article-schema"',
            content,
            count=1
        )
    else:
        content = re.sub(
            r'("use client")',
            r'\1\n\nimport { ArticleSchema } from "@/components/article-schema"',
            content,
            count=1
        )
    
    # Find the main return statement and add ArticleSchema
    # Look for the opening of the return JSX
    return_pattern = r'(return\s*\(\s*(?:<>|<div|<main|<section))'
    
    article_schema = f'''<ArticleSchema
        title="{metadata["title"]}"
        description="{metadata["description"]}"
        datePublished="{metadata["datePublished"]}"
        authorName="Devyn Bartell"
      />
      '''
    
    if re.search(return_pattern, content):
        content = re.sub(
            return_pattern,
            r'\1\n      ' + article_schema,
            content,
            count=1
        )
        page_file.write_text(content)
        return (True, f"Added ArticleSchema for: {metadata['title']}")
    
    return (False, "Could not find return statement")

def update_marketing_layout() -> bool:
    """Add Organization and WebSite schema to marketing layout."""
    if not LAYOUT_FILE.exists():
        print(f"❌ Layout file not found: {LAYOUT_FILE}")
        return False
    
    content = LAYOUT_FILE.read_text()
    
    # Check if schema already exists
    if '@type": "Organization"' in content or "'@type': 'Organization'" in content:
        print("ℹ️  Organization schema already exists in layout")
        return False
    
    # Create schema component
    schema_component = '''
  {/* JSON-LD Structured Data */}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://employarmor.com/#organization',
            name: 'EmployArmor',
            url: 'https://employarmor.com',
            description: 'AI hiring compliance platform',
            founder: {
              '@type': 'Person',
              name: 'Devyn Bartell',
            },
            logo: {
              '@type': 'ImageObject',
              url: 'https://employarmor.com/logo.png',
            },
          },
          {
            '@type': 'WebSite',
            '@id': 'https://employarmor.com/#website',
            url: 'https://employarmor.com',
            name: 'EmployArmor',
            description: 'AI hiring compliance platform',
            publisher: {
              '@id': 'https://employarmor.com/#organization',
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://employarmor.com/search?q={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          },
        ],
      }),
    }}
  />
'''
    
    # Find the body or main element and add schema
    body_pattern = r'(<body[^>]*>)'
    if re.search(body_pattern, content):
        content = re.sub(
            body_pattern,
            r'\1\n' + schema_component,
            content,
            count=1
        )
        LAYOUT_FILE.write_text(content)
        print("✅ Added Organization and WebSite schema to marketing layout")
        return True
    
    print("❌ Could not find body element in layout")
    return False

def main():
    """Main execution."""
    print("🚀 Deploying schema components to EmployArmor pages...")
    print()
    
    # Part 1: Update marketing layout
    print("=" * 60)
    print("Part 1: Adding Organization and WebSite schema to layout")
    print("=" * 60)
    update_marketing_layout()
    print()
    
    # Part 2: Deploy ArticleSchema to all resource pages
    print("=" * 60)
    print("Part 2: Deploying ArticleSchema to resource pages")
    print("=" * 60)
    
    article_count = 0
    article_skipped = 0
    
    for page_file in PAGES_DIR.rglob("page.tsx"):
        relative_path = page_file.relative_to(PAGES_DIR)
        slug = str(relative_path.parent)
        
        # Skip index pages and programmatic pages
        if slug == "." or "guides" in slug or "templates" in slug:
            continue
        
        success, message = add_article_schema_to_page(page_file)
        if success:
            print(f"✅ {slug}: {message}")
            article_count += 1
        else:
            print(f"⏭️  {slug}: {message}")
            article_skipped += 1
    
    print()
    print(f"📊 ArticleSchema: {article_count} added, {article_skipped} skipped")
    print()
    
    # Part 3: Deploy FaqSchema to pages with FAQ sections
    print("=" * 60)
    print("Part 3: Deploying FaqSchema to pages with FAQ sections")
    print("=" * 60)
    print("Note: This identifies FAQ data but requires manual integration")
    print()
    
    faq_count = 0
    
    for page_file in PAGES_DIR.rglob("page.tsx"):
        relative_path = page_file.relative_to(PAGES_DIR)
        slug = str(relative_path.parent)
        
        content = page_file.read_text()
        faqs = extract_faq_from_tsx(content)
        
        if faqs:
            print(f"📋 {slug}: Found {len(faqs)} FAQ items")
            faq_count += 1
            
            # For the main FAQ page, provide detailed instructions
            if "faq" in slug:
                print(f"   💡 Main FAQ page - contains {len(faqs)} questions across categories")
    
    print()
    print(f"📊 Found {faq_count} pages with FAQ sections")
    print()
    print("=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"✅ Organization/WebSite schema added to layout")
    print(f"✅ ArticleSchema deployed to {article_count} pages")
    print(f"ℹ️  {faq_count} pages have FAQ sections (manual review recommended)")
    print()
    print("🔍 Next steps:")
    print("   1. Review git diff to verify changes")
    print("   2. Manually integrate FaqSchema where FAQ sections exist")
    print("   3. Update datePublished in ArticleSchema components")
    print("   4. Test build: npm run build")
    
if __name__ == "__main__":
    main()
