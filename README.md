p# Getting Started

1. Fork the project or copy the files
2. Make a new terminal: Terminal -> New Terminal
3. npm install
4. Wait for dependencies to install.
5. Update package.json fields to be relevant to your project.

## Maybe Do These

### Auto-push to itch

If you want to be able to quickly publish to itch, you can modify the build:prod line to something like this (butler must be installed):

```
"build:prod": "webpack --config webpack.prod.js && butler push build your-name/your-phaser-project:html",
```

Then, when you hit build:prod, it will upload to itch. It's probably best to disable this once you've released to avoid bad pushes.