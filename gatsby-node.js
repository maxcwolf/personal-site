/**
 * SUMMARY:
 * We create a query that finds our files and gets the path from frontmatter.
 * We cycle through them and call createPage which will use our post template
 * to create a new page for each of our markdown files.
 */

const path = require('path')

exports.createPages = ({ graphql, actions }) => {
  /** Using Gatsby API's createPages...
   Create the createPages export function,and then destructure actions,
   which is where createPages is located,
   and the function then returns a new promise since file creation is async by nature. 
   */
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    // path to our post template
    const postTemplate = path.resolve('src/templates/post.jsx')
    const tagPage = path.resolve('src/pages/tags.jsx')
    const tagPosts = path.resolve('src/templates/tag.jsx')

    // Graphql query to resolve the promise starting with allMarkdownRemark and including the file path
    // Sort the results by date
    resolve(
      graphql(`
        query {
          allMarkdownRemark(sort: { order: ASC, fields: [frontmatter___date] }) {
            edges {
              node {
                frontmatter {
                  path
                  title
                  tags
                }
              }
            }
          }
        }
      `).then(result => {
        if (result.errors) {
          return Promise.reject(result.errors)
        }
        // object that matches the query above.
        const posts = result.data.allMarkdownRemark.edges

        // create tags page
        const postsByTag = {}

        // Since edges are the path to our files, we'll add a forEach on the edges to extract our file's path from node.frontmatter.
        posts.forEach(({ node }) => {
          if (node.frontmatter.tags) {
            node.frontmatter.tags.forEach(tag => {
              if (!postsByTag[tag]) {
                postsByTag[tag] = []
              }
              postsByTag[tag].push(node)
            })
          }
        })

        //create tags
        const tags = Object.keys(postsByTag)

        createPage({
          path: '/tags',
          component: tagPage,
          context: {
            tags: tags.sort()
          }
        })

        tags.forEach(tagName => {
          const posts = postsByTag[tagName]

          createPage({
            path: `/tags/${tagName}`,
            component: tagPosts,
            context: {
              posts,
              tagName
            }
          })
        })

        // Create Posts -> add pagination link paths
        posts.forEach(({ node }, index) => {
          const path = node.frontmatter.path
          const prev = index === 0 ? null : posts[index - 1].node
          const next = index === posts.length - 1 ? null : posts[index + 1].node

          createPage({
            path,
            component: postTemplate,
            context: {
              pathSlug: path,
              prev,
              next
            }
          })
        })
      })
    )
  })
}
