var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }

  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      },
    ]);

    this.log("app name", answers.name);

    const pkgJson = {
      "name": answers.name,
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "dependencies": {
        "vue": "^2.6.12"
      },
      "devDependencies": {
        "copy-webpack-plugin": "^7.0.0",
        "css-loader": "^5.1.0",
        "vue-loader": "^15.9.6",
        "vue-style-loader": "^4.1.2",
        "vue-template-compiler": "^2.6.12",
        "webpack": "^5.24.2",
        "webpack-cli": "^4.5.0"
      }
    }


    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    // this.npmInstall(['lodash'], { 'save-dev': true });

  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('src/index.html'),
      this.destinationPath('src/index.html'),
      { title: 'Templating with Yeoman' }
    );

    this.fs.copyTpl(
      this.templatePath('src/HelloWorld.vue'),
      this.destinationPath('src/HelloWorld.vue')
    );

    this.fs.copyTpl(
      this.templatePath('src/main.js'),
      this.destinationPath('src/main.js')
    );

    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js')
    );
  }
};
