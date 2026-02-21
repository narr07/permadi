import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, parse } from 'node:path'

const iconsDir = 'app/assets/icons'
const iconsJsonPath = 'app/assets/icons.json'

async function main() {
  try {
    const iconsJsonContent = await readFile(iconsJsonPath, 'utf-8')
    const iconsData = JSON.parse(iconsJsonContent)
    const existingIcons = new Set(Object.keys(iconsData.icons))

    const files = await readdir(iconsDir)
    const svgFiles = files.filter(file => file.endsWith('.svg'))

    for (const file of svgFiles) {
      const iconName = parse(file).name
      if (existingIcons.has(iconName)) {
        continue
      }

      const filePath = join(iconsDir, file)
      const content = await readFile(filePath, 'utf-8')

      // Extract viewBox
      // handle single quotes too if necessary, though double quotes are standard
      const viewBoxMatch = content.match(/viewBox=["']([^"']+)["']/)
      let width = 32
      let height = 32

      if (viewBoxMatch) {
        const parts = viewBoxMatch[1].split(/\s+/).map(Number)
        if (parts.length === 4) {
          width = parts[2]
          height = parts[3]
        }
      }
      else {
        // Fallback to width/height attributes
        const widthMatch = content.match(/width=["']([^"']+)["']/)
        const heightMatch = content.match(/height=["']([^"']+)["']/)
        if (widthMatch)
          width = Number.parseInt(widthMatch[1])
        if (heightMatch)
          height = Number.parseInt(heightMatch[1])
      }

      // Extract inner content (body)
      const svgStart = content.indexOf('<svg')
      const svgEnd = content.lastIndexOf('</svg>')

      if (svgStart !== -1 && svgEnd !== -1) {
        // Get everything from start of <svg to start of </svg>
        const rawBody = content.substring(svgStart, svgEnd)

        // Find the end of the opening <svg ...> tag
        const openingTagEnd = rawBody.indexOf('>')
        if (openingTagEnd !== -1) {
          const body = rawBody.substring(openingTagEnd + 1).trim()
          // remove any XML declaration if present at the very start of file, handled by svgStart

          iconsData.icons[iconName] = {
            body,
            width,
            height,
          }
          console.log(`Added icon: ${iconName}`)
        }
      }
      else {
        console.warn(`Could not parse SVG content for ${file}`)
      }
    }

    // Sort keys alphabetically
    const sortedIcons: Record<string, any> = {}
    Object.keys(iconsData.icons).sort().forEach((key) => {
      sortedIcons[key] = iconsData.icons[key]
    })
    iconsData.icons = sortedIcons

    await writeFile(iconsJsonPath, JSON.stringify(iconsData, null, 2))
    console.log('Updated icons.json successfully.')
  }
  catch (error) {
    console.error('Error updating icons:', error)
  }
}

main()
