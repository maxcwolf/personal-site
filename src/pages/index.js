import React from "react"
import { graphql } from "gatsby"
import Layout from "../layouts"

export default ({ data }) => {
  const { edges } = data.allMarkdownRemark
  return (
    <Layout>
      <h1>Wolf Blog Home Page</h1>
      {edges.map(({ node }) => (
        <div key={node.id}>
          <h3>{node.frontmatter.title} </h3>
          <p>{node.frontmatter.date}</p>
          <p>{node.excerpt}</p>
        </div>
      ))}
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          excerpt(pruneLength: 100)
          frontmatter {
            title
            date(formatString: "MM.DD.YYY")
          }
        }
      }
    }
  }
`
