export default {
    title: 'ajin',
    description: 'ajin up!!!',
    themeConfig: {
        siteTitle: 'ajin',
        logo: '/logo.png',
        nav: [
            { text: '芜湖起飞!!!', link: '/study/' },
            { text: '让我捋捋...', link: '/summary/' },
            { text: '啥啊这是？', link: '/question/' },
            { text: 'offer多多~', link: '/job/' },
            { text: 'GIS,初恋啊', link: '/gis/' },
            // { text: 'DropMenu', items:[
            //     { text: 'Item A', link: '/item-1' },
            //     { text: 'Item B', link: '/item-2' },
            //     { text: 'Item C', link: '/item-3' },
            // ]},
        ],
        socialLinks: [
            { icon: 'github', link: 'https://github.com/jinjin123456'},
            { 
              icon: {
                svg: ''
              }, 
              link: '' 
            }
        ],
        sidebar: {
            '/study/': [
              {
                text: "JavaScript",
                collapsible: true,
                collapsed: true,
                items: [
                ],
              },
              {
                text: "Vue",
                collapsible: true,
                collapsed: true,
                items: [
                ],
              },
              {
                text: "NodeJS",
                collapsible: true,
                collapsed: true,
                items: [
                  { text: 'node基础', link: '/study/NodeJS/node基础' },
                  // { text: 'node进阶', link: '/study/NodeJS/进阶.md' },
                ],
              },
            ],
            '/summary/': [
              {
                text: "知识点小结",
                items: [
                  { text: "defer与async小结", link: "/summary/defer与async小结" },
                  { text: "各排序算法JavaScript实现", link: "/summary/各排序算法JavaScript实现" },
                  { text: "跨域解决方案总结", link: "/summary/跨域解决方案总结.md" },
                  { text: "总结前端坐标与尺寸区分", link: "/summary/总结前端坐标与尺寸区分" },
                ],
              },
            ],
            '/question/': [
              {
                text: "蠢哭了",
                items: [
                  { text: "setInterval的坑", link: "/question/setInterval的坑" },
                ],
              },
            ],
            '/job/': [
              // {
              //   text: "前端高频面试题",
              //   items: [
              //     { text: "前端高频面试题", link: "/job/前端高频面试题" },
              //   ],
              // },
            ],
            '/gis/': [
              {
                text: "WebGIS",
                items: [
                  { text: '常见OGC服务小结', link: '/gis/常见OGC服务小结' },
                ],
              },
            ],
        },
    }
}