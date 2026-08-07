import type { H3Event } from 'h3'

interface NavItem {
  id?: string
  title?: string
  description?: string
  path?: string
  stem?: string
  category?: string
  icon?: string
  children?: NavItem[]
  [key: string]: any
}

interface SearchFileItem {
  id?: string
  path?: string
  title?: string
  titles?: string[]
  level?: number
  content?: string
  icon?: string
  [key: string]: any
}

const CATEGORY_ICON_MAP: Record<string, string> = {
  pendidikan: 'i-narr-school',
  programmer: 'i-narr-pc',
  desainer: 'i-ph-paint-brush-duotone',
}

function mapNavigationIcons(items: NavItem[], categoryMap: Map<string, string>): NavItem[] {
  if (!Array.isArray(items))
    return []
  return items.map((item) => {
    let icon = item.icon
    if (item.path && categoryMap.has(item.path)) {
      icon = categoryMap.get(item.path)
    }
    else if (item.stem && categoryMap.has(item.stem)) {
      icon = categoryMap.get(item.stem)
    }
    else {
      // Check matching path in categoryMap by stem or filename matching
      for (const [key, catIcon] of categoryMap.entries()) {
        if (item.path?.includes(key) || item.id?.includes(key)) {
          icon = catIcon
          break
        }
      }
    }

    return {
      ...item,
      icon: icon || 'i-narr-article',
      children: item.children ? mapNavigationIcons(item.children, categoryMap) : undefined,
    }
  })
}

export default eventHandler(async (event: H3Event) => {
  const query = getQuery(event)
  const locale = query.locale === 'en' ? 'en' : 'id'
  const part = query.part === 'navigation' || query.part === 'files' ? query.part : 'all'
  const collection = `${locale}_blog` as any

  // 1. Fetch all posts with path & category from database
  const posts = await queryCollection(event, collection).select('path', 'category', 'stem').all()

  // 2. Build categoryMap
  const categoryMap = new Map<string, string>()
  for (const post of posts) {
    const rawCategory = (post.category || '') as string
    const normalizedCategory = typeof rawCategory === 'string' ? rawCategory.toLowerCase().trim() : ''
    const icon = CATEGORY_ICON_MAP[normalizedCategory] || 'i-narr-article'
    if (post.path)
      categoryMap.set(post.path, icon)
    if (post.stem)
      categoryMap.set(post.stem, icon)
  }

  // 3. Helper to get navigation tree with icons
  async function getNavigation() {
    const rawNavigation = await queryCollectionNavigation(event, collection)
    return mapNavigationIcons(rawNavigation as NavItem[], categoryMap)
  }

  // 4. Helper to get search section files with icons
  async function getFiles() {
    const rawFiles = await queryCollectionSearchSections(event, collection)
    return (rawFiles as SearchFileItem[]).map((file) => {
      let icon = 'i-narr-article'
      for (const [key, catIcon] of categoryMap.entries()) {
        if (file.id?.includes(key) || file.path?.includes(key)) {
          icon = catIcon
          break
        }
      }
      return {
        ...file,
        icon,
      }
    })
  }

  if (part === 'navigation') {
    const navigation = await getNavigation()
    return { navigation }
  }

  if (part === 'files') {
    const files = await getFiles()
    return { files }
  }

  const [navigation, files] = await Promise.all([
    getNavigation(),
    getFiles(),
  ])

  return { navigation, files }
})
