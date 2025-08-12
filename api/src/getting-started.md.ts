export const gettingStartedDescription = `
To create a post you first need to get the social accounts you want to post to, upload any media for the post (if applicable), and then create the post. 

You only need to get the social accounts once as the ids will not change, however you will need to upload media each time you create a post.

The below example shows how to create a media post from start to finish.

**Example flow using JavaScript and the Fetch API:**

**Get Social Accounts**

  \`\`\`js
   // Step 1: Fetch the social accounts you want to post to. In this case we are getting all facebook and instagram accounts.
   const socialAccountResponse = await fetch('https://api.postforme.app/v1/social-accounts?platform=facebook&platform=instagram', {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer YOUR_API_KEY'
     }
   });

   const { data } = await socialAccountResponse.json();

   //Grab the ids from the social account response
   const accountIds =  data.map((account) => account.id);
   \`\`\`


**Create the post**

 \`\`\`js
   // Step 2: Create the post using the social account ids

   // We are scheduling the post one hour from now
   const scheduledAt = new Date();
   scheduledAt.setHours(scheduledAt.getHours() + 1);

   const postResponse = await fetch('https://api.postforme.dev/v1/social-posts', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Bearer YOUR_API_KEY'
       },
       body: JSON.stringify({
         caption: 'Hello, world!',
         scheduled_at: scheduledAt,
         media: [
          {
            "url": "https://picsum.photos/id/237/1080/1080",
          }
        ],
         social_accounts: accountIds,
       }),
     });
   
     const postData = await postResponse.json();
   \`\`\`

**Thats It! You have successfully scheduled a post to go out in one hour.** 

`;
