![snippets in action](images/click.gif)

```
npm install -g yo generator-code
yo code

npm install -g vsce

"activationEvents": [
  "onLanguage:typescript"
],
"contributes": {
  "languages": [
    {
      "id": "typescript",
      "extensions": [".ts", ".tsx"]
    }
  ]
}


npm run compile
vsce package


```
