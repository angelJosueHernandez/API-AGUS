const app = require('./app');

app.get("/", (req, res) => {
    const htmlResponse = `
    <html>
    <head><title>Home Page</title></head>
    <body>
    <h1>Hello World!</h1>
    </body>
    </html>
    `;
    res.send(htmlResponse);
});

app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
