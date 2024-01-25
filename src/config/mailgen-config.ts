import mailGen = require('mailgen');

export const mailGenerator = new mailGen({
  theme: 'default',
  product: {
    name: 'Collate',
    link: 'https://www.collate.africa/register',
    logo: 'https://election-result-bucket-v2.fra1.cdn.digitaloceanspaces.com/logo.jpeg',
  },
});
