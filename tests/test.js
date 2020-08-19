require('dotenv').config()
const core = require('@actions/core');
const github = require('@actions/github');
const Octokit  = require("@octokit/action");
const axios = require('axios');
const myToken = core.getInput('GITHUB_TOKEN');
const mondayToken = process.env.MONDAY_TOKEN
const mondayUrl = "https://api.monday.com/v2/";
const mondayBoardId = 419053564
const issueComment = "Whalla Wulla"
const repoOrg = 'djdindin'
const repoName = 'mondaymona'
const mondayId = 691934679

const actionBastard = async()=> {
  
    try{
        
            console.log('awaiting data');
            var mondayData = [
                {id: 691934679}
            ]
            var issueBody = '691934679'
            for(var i in mondayData){
                console.log('inside loop');
                
                if (issueBody.includes(mondayData[i].id)){
                    console.log(mondayData[i].id);
                    
                     var options = {
                         query: `
                            mutation ($id: Int!, $body: String!){
                            create_update (item_id: $id, body: $body) {
                                id
                            }
                        }`,
                        variables: {
                            id: mondayData[i].id,
                            body: issueComment,
                            
                        }
                    } 
                
                    }
            console.log('posting');
            
               var response = await axios.post(mondayUrl, options , { 
                    headers: {
                        Authorization: mondayToken,
                    }
                });
            }
}catch(err){
        console.log(err);
    }
    
    
    
}
  actionBastard()