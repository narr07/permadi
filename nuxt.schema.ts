import { field, group } from '@nuxt/content/studio'

export default defineNuxtSchema({
  appConfig: {
    profile: group({
      title: 'Personal information',
      description: 'Personal information configuration',
      icon: 'lucide:user',
      fields: {
        name: field({
          type: 'string',
          title: 'Name',
          description: 'Your name.',
          icon: 'lucide:user',
          default: 'Dinar Permadi Yusup',
        }),
        job: field({
          type: 'string',
          title: 'Job',
          description: 'Your job.',
          icon: 'lucide:briefcase',
          default: 'Teacher, Programmer and Designer',
        }),
        email: field({
          type: 'string',
          title: 'Email',
          description: 'Your email.',
          icon: 'lucide:mail',
          default: 'dinarpermadi07@gmail.com',
        }),
        phone: field({
          type: 'string',
          title: 'Phone',
          description: 'Your phone.',
          icon: 'lucide:phone',
          default: '+6285721340777',
        }),
        picture: field({
          type: 'string',
          title: 'Picture',
          description: 'Your picture.',
          icon: 'lucide:image',
          default: 'https://avatars.githubusercontent.com/u/71938701?v=4',
        }),
      },
    }),

    socials: group({
      title: 'Socials',
      description: 'Socials configuration',
      icon: 'lucide:link',
      fields: {
        github: field({
          type: 'string',
          title: 'Github',
          description: 'Your Github account.',
          icon: 'lucide:github',
          default: 'https://github.com/myusername',
        }),
        twitter: field({
          type: 'string',
          title: 'Twitter',
          description: 'Your Twitter account.',
          icon: 'lucide:twitter',
          default: 'https://twitter.com/myusername',
        }),
        linkedin: field({
          type: 'string',
          title: 'Linkedin',
          description: 'Your Linkedin account.',
          icon: 'lucide:linkedin',
          default: 'https://www.linkedin.com/in/myusername',
        }),
        instagram: field({
          type: 'string',
          title: 'Instagram',
          description: 'Your Instagram account.',
          icon: 'lucide:instagram',
          default: 'https://www.instagram.com/myusername',
        }),
        facebook: field({
          type: 'string',
          title: 'Facebook',
          description: 'Your Facebook account.',
          icon: 'lucide:facebook',
          default: 'https://www.facebook.com/myusername',
        }),
        behance: field({
          type: 'string',
          title: 'Behance',
          description: 'Your Behance account.',
          icon: 'lucide:behance',
          default: 'https://www.behance.net/myusername',
        }),
      },
    }),
  },
})
