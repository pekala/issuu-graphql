const axios = require('axios');

const fields = {
    TITLE: 'title',
    IMPRESSIONS: 'views',
    PAGE_COUNT: 'pagecount',
    PUBLISHED_ON: 'epoch'
};

module.exports = {
    Query: {
        allPublications: async (root, { skip, first, orderBy }) => {
            const response = await axios.get(`http://search.issuu.com/api/2_0/document?responseParams=*&startIndex=${skip}&pageSize=${first}&sortBy=${fields[orderBy.field]}%20${orderBy.direction.toLowerCase()}`);
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
        owner: async ({ ownerUsername }, { skip, first }) => {
            const response = await axios.get(`http://issuu.com/query?pageSize=${first}&startIndex=${skip}&profileUsername=${ownerUsername}&action=issuu.user.get_anonymous&format=json`)
            return response.data.rsp._content.user;
        },
        publications: async ({ id }, { skip, first }) => {
            const response = await axios.get(`https://issuu.com/call/stream/api/stack/1/0/initial?stackId=${id}&startIndex=${skip}&pageSize=${first}&format=json`);
            return response.data.rsp._content.stream.map(item => item.content);
        },
    },
    User: {
        issuuUrl: root => `https://issuu.com/${root.username.toLowerCase()}`,
        url: root => root.web,
        publications: async ({ username }, { skip, first, orderBy }) => {
            const response = await axios.get(`http://search.issuu.com/api/2_0/document?q=username:${username}&responseParams=*&startIndex=${skip}&pageSize=${first}&sortBy=${fields[orderBy.field]}%20${orderBy.direction.toLowerCase()}`);
            return response.data.response.docs;
        },
        stacks: async ({ username }, { skip, first }) => {
            const response = await axios.get(`https://issuu.com/query?pageSize=${first}&stackUsername=${username}&access=public&sortBy=title&resultOrder=asc&startIndex=${skip}&action=issuu.stacks.list_anonymous&format=json`);
            return response.data.rsp._content.result._content.map(result => result.stack);
        },
        followers: async ({ username }, { skip, first }) => {
            const response = await axios.get(`https://issuu.com/query?pageSize=${first}&subscribedUsername=${username}&sortBy=subscriberCount&resultOrder=desc&startIndex=${skip}&action=issuu.user.list_subscribers&format=json`);
            return response.data.rsp._content.result._content.map(result => result.user);
        }
    },
};