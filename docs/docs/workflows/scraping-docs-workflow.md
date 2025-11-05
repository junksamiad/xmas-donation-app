# Documentation Scraping Prompt

## Instructions for Web Scraping Documentation Sites

Please scrape the documentation website I specify below using the Playwright MCP tool. Follow these steps carefully:

### Pre-Setup
1. **Kill any existing browser sessions first** by running:
   ```bash
   pkill -f "mcp-chrome"
   ```
2. Verify the browser processes are killed before proceeding
3. Start a fresh Playwright browser session

### Scraping Requirements

**Target Website**: [INSERT_WEBSITE_URL_HERE]
**Base Documentation Path**: [INSERT_BASE_PATH_HERE] (e.g., https://ai-sdk.dev/docs/)
**Local Output Directory**: [INSERT_LOCAL_PATH_HERE] (e.g., /Users/leehayton/ai-apps/document-parser/docs/ai-docs)

### Scraping Instructions

1. **Directory Structure Mirroring**:
   - Create a mirrored directory structure in the local output directory
   - For example, if scraping `https://ai-sdk.dev/docs/foundations/overview`
   - Save to: `{local_output_dir}/ai-sdk.dev/docs/foundations/overview.md`
   - Maintain the exact URL path structure as directories

2. **Page Discovery**:
   - Start from the base documentation path
   - Navigate through ALL documentation pages under the specified base path
   - Follow all navigation links, sidebar links, and sub-sections
   - Include all pages that start with the base path URL

3. **Content Extraction Requirements**:
   - Extract the FULL page content including:
     - Main article text
     - All headings and sub-headings
     - Code blocks and examples
     - **IMPORTANT: Click through ALL interactive tabs/toggles to capture hidden code examples**
     - **IMPORTANT: Do NOT use the "Copy markdown" button on the website - use JavaScript extraction instead**
     - Tables and lists
     - Links (preserve as markdown links)
     - Any collapsible/expandable sections (expand them first)

4. **Interactive Elements**:
   - For tabbed code examples (like xAI/OpenAI/Anthropic/Google tabs):
     - Click EACH tab sequentially
     - Capture the code example from each tab
     - Include all variations in the markdown output
   - For collapsible sections:
     - Expand all sections before extracting content
   - For "Show more" or pagination:
     - Click to reveal all content

5. **Output Format**:
   - Save each page as a clean markdown file
   - Include proper markdown formatting:
     - Headers with appropriate levels (#, ##, ###)
     - Code blocks with language identifiers (```typescript, ```javascript, etc.)
     - Properly formatted tables
     - Blockquotes for notes/warnings
   - Remove navigation elements, headers, footers, ads
   - Focus on documentation content only

6. **File Naming**:
   - Use descriptive filenames based on the page URL
   - Replace `/` with directories
   - Add `.md` extension
   - Example: `foundations/overview.md` for `/docs/foundations/overview`

7. **Progress Tracking**:
   - Use the TodoWrite tool to track:
     - Pages discovered
     - Pages scraped
     - Pages remaining
   - Report any pages that fail to scrape

8. **Large Page Handling**:
   - **CRITICAL: NEVER summarize content** - always capture pages in FULL
   - If a page is too large to scrape in one operation:
     - Break the page down into smaller logical components (sections, headings, etc.)
     - Extract content piece by piece
     - Write content to the file incrementally using multiple write operations
     - Ensure no content is lost or truncated
   - Always preserve complete content regardless of page size

9. **Error Handling**:
   - If a page fails to load, note it and continue
   - If interactive elements don't work, capture what's visible
   - Log any issues encountered

### Example Usage

To scrape the Vercel AI SDK documentation:
```
Target Website: https://ai-sdk.dev
Base Documentation Path: https://ai-sdk.dev/docs/
Local Output Directory: /Users/leehayton/ai-apps/document-parser/docs/ai-docs
```

This would scrape all pages under `https://ai-sdk.dev/docs/` and save them to:
```
/Users/leehayton/ai-apps/document-parser/docs/ai-docs/ai-sdk.dev/docs/
├── foundations/
│   ├── overview.md
│   ├── providers-and-models.md
│   ├── prompts.md
│   └── ...
├── getting-started/
│   ├── nextjs-app-router.md
│   └── ...
└── ...
```

### Additional Notes
- Respect robots.txt and rate limits
- Be patient with dynamic content loading
- Use appropriate wait times for JavaScript-rendered content
- Capture breadcrumb navigation as context
- Preserve any important metadata (last updated, version info)

---

## Quick Start Template

Copy and modify this template:

```
Please scrape the documentation using Playwright MCP:

Target Website: [YOUR_WEBSITE]
Base Documentation Path: [YOUR_DOCS_PATH]
Local Output Directory: [YOUR_LOCAL_PATH]

Follow the comprehensive scraping instructions in this document, ensuring you:
1. Kill existing browser sessions first
2. Navigate all documentation pages
3. Click through ALL interactive elements (tabs, toggles, expandables)
4. Mirror the URL structure in local directories
5. Save as clean markdown files
```