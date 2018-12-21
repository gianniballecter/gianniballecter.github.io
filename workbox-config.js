module.exports = {
    "globDirectory": ".",
    "globPatterns": ["**/*.{css,js,html}"],
    "swDest": "sw.js",
    runtimeCaching: [
        {
        urlPattern: /https:\/\/jsonplaceholder\.typicode\.com/,
        handler: "networkFirst"
        }
    ]
  };