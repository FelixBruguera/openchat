import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import remarkMath from 'remark-math'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

const MarkdownRenderer = ({ content }) => {
  // Enhanced sanitization schema
  const sanitizationSchema = {
    attributes: {
      '*': ['className', 'aria-hidden'],
      code: ['className'],
      pre: ['className'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      a: ['href', 'title', 'target', 'rel'],
      th: ['align'],
      td: ['align'],
      span: ['data-formula'],
      math: ['xmlns'],
      annotation: ['encoding'],
      semantics: ['definitionurl'],
      mrow: ['xmlns', 'xlink'],
      mstyle: ['mathcolor', 'mathbackground'],
      mfrac: ['linethickness'],
    },
    tagNames: [
      'p',
      'pre',
      'code',
      'strong',
      'em',
      'blockquote',
      'ul',
      'ol',
      'li',
      'a',
      'br',
      'img',
      'hr',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'math',
      'semantics',
      'mrow',
      'mi',
      'mo',
      'mn',
      'msup',
      'mfrac',
      'munder',
      'mover',
      'mtable',
      'mtr',
      'mtd',
      'msqrt',
      'mroot',
      'mtext',
      'menclose',
      'mglyph',
      'maligngroup',
      'malignmark',
      'mpadded',
      'mphantom',
      'mspace',
      'mstyle',
      'msub',
      'msubsup',
      'ms',
      'mstack',
      'mlongdiv',
      'msline',
      'maction',
      'annotation',
      'annotation-xml',
      'span',
    ],
    protocols: {
      href: ['http', 'https', 'mailto'],
      src: ['http', 'https', 'data'],
    },
  }

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [rehypeKatex, { output: 'mathml' }],
          [rehypeSanitize, sanitizationSchema],
        ]}
        components={{
          // Enhanced code block handling
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={a11yDark}
                language={match[1]}
                PreTag="div"
                showLineNumbers
                wrapLongLines
                customStyle={{ margin: 0 }}
                children={String(children).replace(/\n$/, '')}
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          // Proper paragraph handling
          p({ children }) {
            return <p className="mb-4 leading-relaxed">{children}</p>
          },
          // Secure links with styling
          a({ href, children, title }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                title={title}
              >
                {children}
              </a>
            )
          },
          // Responsive images
          img({ src, alt, title, ...props }) {
            return (
              <img
                src={src}
                alt={alt || ''}
                title={title}
                className="my-4 max-w-full h-auto rounded border border-gray-200"
                {...props}
              />
            )
          },
          // Styled blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-gray-400 pl-4 py-1 my-4 text-gray-700 italic">
                {children}
              </blockquote>
            )
          },
          // Styled tables
          table({ children }) {
            return (
              <table className="my-4 border-collapse border border-gray-300">
                {children}
              </table>
            )
          },
          th({ children, align }) {
            return (
              <th
                className="border border-gray-300 px-4 py-2 font-bold bg-gray-200 dark:bg-stone-600 dark:text-white dark:border-gray-500"
                style={{ textAlign: align || 'left' }}
              >
                {children}
              </th>
            )
          },
          td({ children, align }) {
            return (
              <td
                className="border border-gray-300 px-4 py-2 dark:border-gray-500"
                style={{ textAlign: align || 'left' }}
              >
                {children}
              </td>
            )
          },
          // Styled headings with anchor links
          h1({ children }) {
            return (
              <h1 className="text-3xl font-bold my-6 pb-2 border-b">
                {children}
              </h1>
            )
          },
          h2({ children }) {
            return (
              <h2 className="text-2xl font-semibold my-5 pb-2 border-b">
                {children}
              </h2>
            )
          },
          // Horizontal rule styling
          hr() {
            return <hr className="my-8 border-t border-gray-300" />
          },
          // List styling
          ul({ children }) {
            return <ul className="list-disc pl-8 my-4">{children}</ul>
          },
          ol({ children }) {
            return <ol className="list-decimal pl-8 my-4">{children}</ol>
          },
          li({ children }) {
            return <li className="my-2 pl-1">{children}</li>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer
