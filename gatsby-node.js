require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
const path = require("path")
const { env } = process

// const gatsby_yv_id = env.PLATFORM_VARIABLES["GATSBY_YOUVISIT_INSTID"]
let projectId = env.PLATFORM_PROJECT
module.exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  // set GATSBY_YOUVISIT_INSTID in .platform.app.yaml fo
  const instID = process.env.GATSBY_YOUVISIT_INSTID
  console.log(
    "projectId-----------------------&&&&&&&&&&&&---------------",
    projectId
  )
  console.log(
    "env.PLATFORM_VARIABLES-----------------------&&&&&&&&&&&&---------------",
    env.PLATFORM_VARIABLES
  )

  console.log(
    "instID-----------------------&&&&&&&&&&&&---------------",
    instID
  )
  const partnerTemplate = path.resolve("./src/templates/partner-location.js")
  const internalTemplate = path.resolve("./src/templates/internal-location.js")

  const res = await graphql(
    `
      query($instID: String) {
        yv {
          institutions(instID: $instID) {
            locations {
              loc_id
            }
          }
        }
      }
    `,
    {
      instID: instID,
    }
  )

  res.data.yv.institutions.locations.forEach(location => {
    createPage({
      component: partnerTemplate,
      path: `/location/${location.loc_id}`,
      context: {
        locID: `${location.loc_id}`,
        instID: `${instID}`,
      },
    })
    createPage({
      component: internalTemplate,
      path: `/internal/location/${location.loc_id}`,
      context: {
        locID: `${location.loc_id}`,
        instID: `${instID}`,
      },
    })
  })
}

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions
  const instID =
    process.env.GATSBY_YOUVISIT_INSTID || env.GATSBY_YOUVISIT_INSTID

  deletePage(page)
  // You can access the variable "instID" in your page queries now
  createPage({
    ...page,
    context: {
      ...page.context,
      instID: instID,
    },
  })
}

// ignore /scripjs/ files on build
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /scriptjs/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}
