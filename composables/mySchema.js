const pick = function (attrs, allowed) {
  if (!attrs)
    return null

  const h = {}
  for (const key in attrs) {
    const value = attrs[key]
    if (allowed.includes(key) && value !== null)
      h[key] = value
  }
  return h
}
const isEmailLinkType = type => type === 'email'
export default {
  nodes: {
    horizontal_rule() {
      return {
        singleTag: 'hr',
      }
    },
    blockquote() {
      return {
        tag: 'blockquote',
      }
    },
    bullet_list() {
      return {
        tag: 'ul',
      }
    },
    code_block(node) {
      return {
        tag: [
          'pre',
          {
            tag: 'code',
            attrs: node.attrs,
          },
        ],
      }
    },
    hard_break() {
      return {
        singleTag: 'br',
      }
    },
    heading(node) {
      return {
        tag: `h${node.attrs.level}`,
      }
    },
    image(node) {
      return {
        singleTag: [
          {
            tag: 'img',
            attrs: pick(node.attrs, ['src', 'alt', 'title']),
          },
        ],
      }
    },
    list_item() {
      return {
        tag: 'li',
      }
    },
    ordered_list() {
      return {
        tag: 'ol',
      }
    },
    paragraph() {
      return {
        tag: 'p',
      }
    },
  },
  marks: {
    bold() {
      return {
        tag: 'b',
      }
    },
    strike() {
      return {
        tag: 'strike',
      }
    },
    underline() {
      return {
        tag: 'u',
      }
    },
    strong() {
      return {
        tag: 'strong',
      }
    },
    code() {
      return {
        tag: 'code',
        attrs: {
          class: 'inlineCode',
        },
      }
    },
    italic() {
      return {
        tag: 'i',
      }
    },
    link(node) {
      const attrs = { ...node.attrs }
      const { linktype = 'url' } = node.attrs
      if (isEmailLinkType(linktype))
        attrs.href = `mailto:${attrs.href}`

      if (attrs.anchor) {
        attrs.href = `${attrs.href}#${attrs.anchor}`
        delete attrs.anchor
      }
      return {
        tag: [
          {
            tag: 'a',
            attrs,
          },
        ],
      }
    },
    styled(node) {
      return {
        tag: [
          {
            tag: 'span',
            attrs: node.attrs,
          },
        ],
      }
    },
  },
  blok: {
    code_blok() {
      return {
        tag: 'code',
        attrs: {
          class: 'code',
        },
      }
    },
  },
}
