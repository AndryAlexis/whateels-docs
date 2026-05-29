# Markdown Feature Playground

This page demonstrates common Markdown features you can use in documentation files.

---

## 1) Headings

# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading

---

## 2) Text Formatting

Normal text

**Bold text**

*Italic text*

***Bold and italic***

~~Strikethrough~~

Inline code: `npm run start`

Escaped characters: \*not italic\* and \# not a heading

---

## 3) Lists

### Unordered

- First item
- Second item
	- Nested item A
	- Nested item B
- Third item

### Ordered

1. Step one
2. Step two
3. Step three

### Task List

- [x] Install dependencies
- [x] Create first markdown page
- [ ] Add more categories

---

## 4) Links and Images

[Open Angular docs](https://angular.dev)

Autolink style: <https://www.npmjs.com/package/ngx-markdown>

Image example:

![Sample placeholder image](https://via.placeholder.com/720x180.png?text=Markdown+Image+Example)

---

## 5) Blockquotes

> Simple quote.
>
> Multi-line quote text can continue like this.

> Nested quote example:
>
> > Inner quote level 2

---

## 6) Code Blocks

### TypeScript

```typescript
function greet(name: string): string {
	return `Hello, ${name}!`;
}
```

### HTML

```html
<button class="btn-primary">Click me</button>
```

### Bash

```bash
npm install ngx-markdown
npm run start
```

---

## 7) Tables

| Feature | Supported | Notes |
| --- | --- | --- |
| Headings | Yes | H1 to H6 |
| Lists | Yes | Ordered, unordered, task lists |
| Code fences | Yes | Useful with Prism highlighting |
| Tables | Yes | Great for references |

Alignment table:

| Left | Center | Right |
| :--- | :----: | ---: |
| A | B | C |
| 10 | 20 | 30 |

---

## 8) Horizontal Rule

Above and below this sentence are horizontal rules.

---

## 9) Footnotes

Markdown can include footnotes in many renderers.[^1]

[^1]: Footnote support depends on the parser and config.

---

## 10) Raw HTML (Intentionally Omitted)

This demo avoids raw HTML tags so it stays pure Markdown and works cleanly with Angular sanitization.

---

## 11) Mixed Example

1. Read docs at [ngx-markdown](https://www.npmjs.com/package/ngx-markdown)
2. Configure routes and slugs
3. Render file content in your Angular page
4. Style output with CSS and optional syntax highlighting

> Tip: keep one markdown file per topic and use clear slug-friendly names.

End of showcase.

---

## 12) Line Breaks and Paragraph Behavior

This is paragraph one.

This is paragraph two.

This line has a hard break at the end.  
This line appears below because of two trailing spaces.

This line uses a Markdown hard break instead.  
And this line comes after that break.

---

## 13) Alternate Heading Syntax (Setext)

Setext H1
=========

Setext H2
---------

---

## 14) Reference Links and Reference Images

Reference link to [Angular][angular-link].

Reference image:

![Reference image alt text][sample-image]

[angular-link]: https://angular.dev "Angular Documentation"
[sample-image]: https://via.placeholder.com/560x140.png?text=Reference+Image "Reference Image Title"

---

## 15) Pure Markdown Note

For portability and security, this file uses Markdown syntax only and avoids embedded HTML tags.

---

## 16) Nested Structures

> Blockquote with nested list:
>
> 1. First quoted step
> 2. Second quoted step
>    - nested bullet in quote
>    - another nested bullet

1. Ordered item with nested code block:

	```json
	{
	  "name": "markdown",
	  "type": "demo"
	}
	```

2. Ordered item with nested table:

	| Key | Value |
	| --- | --- |
	| A | Alpha |
	| B | Beta |

---

## 17) Escaping and Entities

Escaped punctuation examples:

\*literal asterisks\*  
\[not a link\]  
\#not-a-heading

HTML entities:

&copy; &trade; &rarr; &lt;div&gt; &amp;

---

## 18) Tag Coverage Checklist

If your stylesheet handles this file, you likely covered these elements:

- `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- `p`, `hr`
- `strong`, `em`, `del`, `code`, `pre`
- `a`, `img`
- `ul`, `ol`, `li`
- `blockquote`
- `table`, `thead`, `tbody`, `tr`, `th`, `td`
- `input[type="checkbox"]` (from task lists)
- Raw HTML tags are intentionally excluded in this version

This should give you a practical surface area for your Markdown content styling.
