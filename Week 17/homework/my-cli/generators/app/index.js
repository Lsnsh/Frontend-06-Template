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
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?"
      }
    ]);

    this.log("app name", answers.name);
    this.log("cool feature", answers.cool);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: 'Templating with Yeoman' }
    );

    const pkgJson = {
      devDependencies: {
        eslint: '^3.15.0'
      },
      dependencies: {
        react: '^16.2.0'
      }
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    // yeoman v5.0 之后不再支持 npmInstall，而是建议使用 addDependencies/addDevDependencies 来修改 package.json 文件
    // 查看详情：https://github.com/yeoman/generator/issues/1283
    // this.npmInstall(['lodash'], { 'save-dev': true });
    // this.addDependencies({'lodash': 'latest'})
    // this.addDevDependencies(['webpack'])

  }
};
