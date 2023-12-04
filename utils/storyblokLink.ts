import { withLeadingSlash } from 'ufo'

// @ts-expect-error
import type { MultilinkStoryblok } from '~/types/storyblok'

export function storyblokLink(link: MultilinkStoryblok | string) {
  if (typeof link === 'string')
    return withLeadingSlash(link)
  return link.linktype === 'url' ? link.cached_url : withLeadingSlash(link.cached_url)
}
