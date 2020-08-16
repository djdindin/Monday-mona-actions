const core = require('@actions/core');
const github = require('@actions/github');
const Octokit  = require("@octokit/action");
const axios = require('axios');
const myToken = core.getInput('GITHUB_TOKEN');
const mondayToken = core.getInput('MONDAY_TOKEN');
const  { graphql, buildSchema }  = require("graphql");
const { octoGraphQl } = require("@octokit/graphql")
const mondayUrl = "https://api.monday.com/v2/";
const mondayBoardId = 409101405 // update this
const octokit = github.getOctokit(myToken)
const issueComment = github.context.payload.comment.body
const issueBody = github.context.payload.issue.body
const commentPayload = github.context.payload.comment
const issuePayload = github.context.payload
const issueNumber = github.context.payload.issue.number
const repoOrg = 'github' //update this
const repoName = 'it-operations' // update this



const mondayItemData = async function () {
    var options = {
        headers: {
          // Reads from your .env file
          Authorization: mondayToken,
        },
          // GraphQL query here
          data: 
          { query: `
                    query ($itemId: [Int]) {
                    boards(ids: $itemId){
                          items {
                            id
                          }
                        }
                      }
                  
                    `,
                    variables: {
                        itemId: mondayBoardId,
                    }
                  }
                }
       try{
       var response = await axios.get(mondayUrl, options);
      return response.data.data.boards[0].items
}catch(err){
    console.log('Monday API Error!!!', err);
    
}
   
}

const actionBastard = async function () {
    if(github.context.payload.comment.user.login != 'mondaymona[bot]'){
    try{
        
            console.log('awaiting data');
            var mondayData = await mondayItemData();
            console.log('data awaited', mondayData);
            
            for(var i in mondayData){
                if (issueBody.includes(mondayData[i].id)){
                    console.log('inside loop', mondayData[i].id);
                    var options = {
                        query: `
                           mutation ($id: Int!, $body: String!){
                           create_update (item_id: $id, body: $body) {
                               id
                           }
                       }`,
                        variables: {
                            id: parseInt(mondayData[i].id),
                            body: 'From @' + commentPayload.user.login + ':\n' + issueComment,
                        } 
                }
            console.log('posting');
            var response = await axios.post(mondayUrl, options , { 
                headers: {
                    Authorization: mondayToken,
                }
            });
        console.log(response.data);
        console.log(commentPayload.user.login);
        
            }
        } 
}catch(err){
        console.log(err);
        }
    }
}


actionBastard()