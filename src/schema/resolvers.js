const axios = require('axios');

module.exports = {
    Query: {
        allPublications: async () => {
            const response = await axios.get(`http://search.issuu.com/api/2_0/document?responseParams=*`);
            return response.data.response.docs;
        },
        getUser: async (root, { username }) => {
            const response = await axios.get(`http://issuu.com/query?profileUsername=${username}&action=issuu.user.get_anonymous&format=json`)
            return response.data.rsp._content.user;
        }
    },
    Publication: {
        id: root => root.documentId || root.publicationId,
        issuuUrl: root => `https://issuu.com/${root.username || root.ownerUsername}/docs/${root.publicationName || root.docname}`,
        pageCount: root => root.pagecount,
        publishedOn: root => root.epoch,
        owner: async ({ username, ownerUsername }) => {
            const response = await axios.get(`http://issuu.com/query?profileUsername=${username || ownerUsername}&action=issuu.user.get_anonymous&format=json`)
            return response.data.rsp._content.user;
        },
        coverHWRatio: root => root.width ? root.height / root.width : null,
        coverUrl: root => {
            const id = root.documentId || `${root.revisionId}-${root.publicationId}`;
            return `https://image.isu.pub/${id}/jpg/page_1_thumb_large.jpg`;
        }
    },
    Stack: {
        itemsCount: root => root.items,
        owner: async ({ ownerUsername }) => {
            const response = await axios.get(`http://issuu.com/query?profileUsername=${ownerUsername}&action=issuu.user.get_anonymous&format=json`)
            return response.data.rsp._content.user;
        },
        publications: async ({ id }) => {
            const response = await axios.get(`https://issuu.com/call/stream/api/stack/1/0/initial?stackId=${id}&pageSize=50&format=json`);
            return response.data.rsp._content.stream.map(item => item.content);
        },
    },
    User: {
        issuuUrl: root => `https://issuu.com/${root.username.toLowerCase()}`,
        url: root => root.web,
        publications: async ({ username }) => {
            const response = await axios.get(`http://search.issuu.com/api/2_0/document?q=username:${username}&responseParams=*`);
            return response.data.response.docs;
        },
        stacks: async ({ username }) => {
            const response = await axios.get(`https://issuu.com/query?pageSize=25&stackUsername=${username}&access=public&sortBy=title&resultOrder=asc&startIndex=0&action=issuu.stacks.list_anonymous&format=json`);
            return response.data.rsp._content.result._content.map(result => result.stack);
        },
        followers: async({ username }) => {
            const response = await axios.get(`https://issuu.com/query?pageSize=20&subscribedUsername=${username}&sortBy=subscriberCount&resultOrder=desc&startIndex=0&action=issuu.user.list_subscribers&format=json`);
            return response.data.rsp._content.result._content.map(result => result.user);
        }
    },
};